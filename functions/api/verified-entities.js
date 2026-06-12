/**
 * functions/api/verified-entities.js
 * Verified Identity Layer API
 * GET /api/verified-entities — list with filters
 * GET /api/verified-entities?id={id} — single entity
 * POST /api/verified-entities — create (staff only)
 * PATCH /api/verified-entities?id={id} — update (staff only)
 */

import { json, ok, err, randomId, getClientIp, checkRateLimit } from "../_lib/api-helpers.js";

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const db = env.DB;

  if (id) {
    const entity = await db.prepare(
      `SELECT ve.*,
        (SELECT json_group_array(json_object(
          'id', ev.id, 'evidence_type', ev.evidence_type,
          'evidence_url', ev.evidence_url, 'description', ev.description,
          'verification_status', ev.verification_status, 'created_at', ev.created_at
        )) FROM verification_evidence ev WHERE ev.entity_id = ve.id) as evidence
       FROM verified_entities ve WHERE ve.id = ?`
    ).bind(id).first();

    if (!entity) return err("NOT_FOUND", "Entity not found.", 404);
    entity.evidence = JSON.parse(entity.evidence || "[]");
    return ok({ entity });
  }

  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status") || "verified";
  const badge = url.searchParams.get("badge");
  const minScore = url.searchParams.get("min_score");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  let sql = `SELECT ve.id, ve.entity_type, ve.entity_id, ve.entity_slug, ve.display_name,
                    ve.status, ve.trust_score, ve.badge_type, ve.verified_at, ve.expires_at,
                    ve.created_at, ve.updated_at
             FROM verified_entities ve`;
  const where = [];
  const params = [];

  if (type) { where.push("ve.entity_type = ?"); params.push(type); }
  if (status) { where.push("ve.status = ?"); params.push(status); }
  if (badge) { where.push("ve.badge_type = ?"); params.push(badge); }
  if (minScore) { where.push("ve.trust_score >= ?"); params.push(parseInt(minScore, 10)); }

  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += ` ORDER BY ve.trust_score DESC, ve.verified_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const results = await db.prepare(sql).bind(...params).all();

  const countSql = `SELECT COUNT(*) as total FROM verified_entities ve${where.length ? " WHERE " + where.join(" AND ") : ""}`;
  const countRes = await db.prepare(countSql).bind(...params.slice(0, -2)).first();

  return ok({
    entities: results.results || [],
    total: countRes?.total || 0,
    limit,
    offset
  });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  // Public rate limit
  const ip = getClientIp(request);
  const rl = env.RATE_LIMITER ? await checkRateLimit(env.RATE_LIMITER, ip, "verified_entity_create", 3, 3600) : { limited: false };
  if (rl.limited) return err("RATE_LIMITED", "Too many submissions. Please try again later.", 429);

  let body;
  try { body = await request.json(); } catch { return err("INVALID_JSON", "Invalid JSON body."); }

  const required = ["entity_type", "display_name"];
  for (const f of required) if (!body[f]) return err("MISSING_FIELD", `${f} is required.`);

  const id = randomId("ve");
  const now = new Date().toISOString();

  await db.prepare(`
    INSERT INTO verified_entities (id, entity_type, entity_id, entity_slug, display_name, status, trust_score, badge_type, evidence_pack_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    body.entity_type,
    body.entity_id || null,
    body.entity_slug || null,
    body.display_name,
    body.status || "pending",
    body.trust_score || 0,
    body.badge_type || "none",
    body.evidence_pack_json || null,
    now, now
  ).run();

  // Insert evidence if provided
  if (Array.isArray(body.evidence)) {
    for (const ev of body.evidence) {
      const evId = randomId("ev");
      await db.prepare(`
        INSERT INTO verification_evidence (id, entity_id, evidence_type, evidence_url, description, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(evId, id, ev.evidence_type, ev.evidence_url || null, ev.description || null, now).run();
    }
  }

  return ok({ id, message: "Verification entity created." }, 201);
}

export async function onRequestPatch(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return err("MISSING_ID", "?id required.");

  const db = env.DB;
  let body;
  try { body = await request.json(); } catch { return err("INVALID_JSON", "Invalid JSON body."); }

  const allowed = ["status", "trust_score", "badge_type", "evidence_pack_json", "verified_by", "verified_at", "expires_at", "review_notes"];
  const updates = [];
  const params = [];

  for (const k of allowed) {
    if (body[k] !== undefined) { updates.push(`${k} = ?`); params.push(body[k]); }
  }

  if (updates.length === 0) return err("NO_UPDATES", "No valid fields to update.");

  const now = new Date().toISOString();
  updates.push("updated_at = ?"); params.push(now);
  params.push(id);

  await db.prepare(`UPDATE verified_entities SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();

  // Log audit
  await db.prepare(`
    INSERT INTO verification_audit_log (id, entity_id, action, performed_by, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(randomId("val"), id, body.status === "verified" ? "approved" : "updated", body.performed_by || null, JSON.stringify(body), now).run();

  return ok({ id, updated: true });
}
