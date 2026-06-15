/**
 * functions/api/trust-score.js
 * DSTS Layer 1 — Trust Score Algorithm
 * POST /api/trust-score/calculate — recalculate trust score for an entity
 * GET  /api/trust-score/:entity_id — get current trust score
 *
 * Algorithm:
 * - Base score: 0
 * - Each verified evidence: +10 to +25 points (by type)
 * - Each pending evidence: +0 (not counted)
 * - Rejected evidence: -5 (penalty)
 * - Multiplier for diversity of evidence types (1.0 → 1.3)
 * - Time decay: evidence older than 365 days loses 10%
 * - Badge assignment: score < 60 = none, 60-69 = bronze, 70-79 = silver,
 *   80-89 = gold, 90-94 = platinum, 95-100 = diamond
 */

import { json } from "../_lib/api-helpers.js";

const EVIDENCE_WEIGHTS = {
  identity_document: 20,
  certificate: 20,
  portfolio: 15,
  achievement: 18,
  media: 12,
  reference: 10,
  interview: 15,
  social: 8,
  default: 10
};

const BADGE_THRESHOLDS = [
  { min: 95, badge: 'diamond' },
  { min: 90, badge: 'platinum' },
  { min: 80, badge: 'gold' },
  { min: 70, badge: 'silver' },
  { min: 60, badge: 'bronze' },
  { min: 0, badge: 'none' }
];

function calculateScore(evidenceList) {
  if (!evidenceList?.length) return { score: 0, breakdown: [] };

  const now = new Date();
  let total = 0;
  const breakdown = [];
  const typeCounts = {};

  for (const ev of evidenceList) {
    if (ev.verification_status !== 'verified') {
      if (ev.verification_status === 'rejected') {
        total -= 5;
        breakdown.push({ type: ev.evidence_type, name: ev.description || ev.evidence_type, points: -5, status: 'rejected' });
      }
      continue;
    }

    const weight = EVIDENCE_WEIGHTS[ev.evidence_type] || EVIDENCE_WEIGHTS.default;
    const ageDays = ev.verified_at
      ? (now - new Date(ev.verified_at)) / (1000 * 60 * 60 * 24)
      : 0;
    const decay = ageDays > 365 ? 0.9 : 1.0;
    const points = Math.round(weight * decay);
    total += points;

    typeCounts[ev.evidence_type] = (typeCounts[ev.evidence_type] || 0) + 1;
    breakdown.push({ type: ev.evidence_type, name: ev.description || ev.evidence_type, points, status: 'verified', ageDays: Math.round(ageDays) });
  }

  // Diversity bonus: 0.0 → 0.3 based on unique evidence types
  const uniqueTypes = Object.keys(typeCounts).length;
  const diversityMultiplier = 1 + Math.min(uniqueTypes / 10, 0.3);
  total = Math.round(total * diversityMultiplier);

  // Cap at 100
  total = Math.min(100, Math.max(0, total));

  return { score: total, breakdown, diversityMultiplier, uniqueTypes };
}

function scoreToBadge(score) {
  for (const t of BADGE_THRESHOLDS) {
    if (score >= t.min) return t.badge;
  }
  return 'none';
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const entityId = url.pathname.split('/').pop() || url.searchParams.get('entity_id');
  if (!entityId) return json({ ok: false, error: 'entity_id required' }, 400);

  const db = env.DB;
  if (!db) return json({ ok: false, error: 'DB not bound' }, 500);

  try {
    // Get entity
    const entity = await db.prepare('SELECT id, display_name, trust_score, badge_type FROM verified_entities WHERE id = ?').bind(entityId).first();
    if (!entity) return json({ ok: false, error: 'Entity not found' }, 404);

    // Get evidence
    const evidence = await db.prepare(
      'SELECT evidence_type, description, verification_status, verified_at FROM verification_evidence WHERE entity_id = ? ORDER BY verified_at DESC'
    ).bind(entityId).all();

    const calc = calculateScore(evidence.results || []);
    const badge = scoreToBadge(calc.score);

    return json({
      ok: true,
      entity_id: entityId,
      display_name: entity.display_name,
      current_score: entity.trust_score,
      calculated_score: calc.score,
      badge_type: badge,
      unique_evidence_types: calc.uniqueTypes,
      diversity_multiplier: calc.diversityMultiplier,
      breakdown: calc.breakdown,
      evidence_count: (evidence.results || []).length
    });
  } catch (e) {
    return json({ ok: false, error: e.message }, 500);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB;
  if (!db) return json({ ok: false, error: 'DB not bound' }, 500);

  let body;
  try { body = await request.json(); } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const entityId = body?.entity_id || new URL(request.url).pathname.split('/').pop();
  if (!entityId) return json({ ok: false, error: 'entity_id required' }, 400);

  try {
    // Get and calculate
    const evidence = await db.prepare(
      'SELECT evidence_type, description, verification_status, verified_at FROM verification_evidence WHERE entity_id = ? ORDER BY verified_at DESC'
    ).bind(entityId).all();

    const calc = calculateScore(evidence.results || []);
    const badge = scoreToBadge(calc.score);

    // Update entity
    await db.prepare(
      'UPDATE verified_entities SET trust_score = ?, badge_type = ?, updated_at = datetime("now") WHERE id = ?'
    ).bind(calc.score, badge, entityId).run();

    // Log audit
    await db.prepare(
      'INSERT INTO verification_audit_log (id, entity_id, action, actor, reason, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now"))'
    ).bind(
      crypto.randomUUID(), entityId, 'trust_score_recalculated',
      body.actor || 'system', 'Algorithm recalculation',
      JSON.stringify({ old_score: body.old_score || null, new_score: calc.score, badge })
    ).run();

    return json({
      ok: true,
      entity_id: entityId,
      trust_score: calc.score,
      badge_type: badge,
      breakdown: calc.breakdown,
      diversity_multiplier: calc.diversityMultiplier
    });
  } catch (e) {
    return json({ ok: false, error: e.message }, 500);
  }
}
