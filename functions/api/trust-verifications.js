/**
 * functions/api/trust-verifications.js
 * Trust Layer API — Trust.iai.one integration ready
 * GET /api/trust-verifications — list with filters
 * GET /api/trust-verifications?id={id} — single verification
 * POST /api/trust-verifications — initiate verification
 * PATCH /api/trust-verifications?id={id} — update status / score
 */

import { json, ok, err, randomId, getClientIp } from "../_lib/api-helpers.js";

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const db = env.DB;
  const id = url.searchParams.get("id");

  if (id) {
    const tv = await db.prepare(
      `SELECT tv.*,
        (SELECT json_group_array(json_object(
          'id', tal.id, 'action', tal.action, 'performed_by', tal.performed_by,
          'details_json', tal.details_json, 'created_at', tal.created_at
        )) FROM trust_audit_log tal WHERE tal.entity_type = tv.entity_type AND tal.entity_id = tv.entity_id ORDER BY tal.created_at DESC LIMIT 20) as audit_log,
        (SELECT json_group_array(json_object(
          'id', tsh.id, 'old_score', tsh.old_score, 'new_score', tsh.new_score,
          'reason', tsh.reason, 'changed_by', tsh.changed_by, 'created_at', tsh.created_at
        )) FROM trust_score_history tsh WHERE tsh.entity_type = tv.entity_type AND tsh.entity_id = tv.entity_id ORDER BY tsh.created_at DESC LIMIT 20) as score_history
       FROM trust_verifications tv WHERE tv.id = ?`
    ).bind(id).first();

    if (!tv) return err("NOT_FOUND", "Trust verification not found.", 404);
    tv.audit_log = JSON.parse(tv.audit_log || "[]");
    tv.score_history = JSON.parse(tv.score_history || "[]");
    return ok({ verification: tv });
  }

  const entityType = url.searchParams.get("entity_type");
  const entityId = url.searchParams.get("entity_id");
  const status = url.searchParams.get("status");
  const provider = url.searchParams.get("provider") || "trust.iai.one";
  const minScore = url.searchParams.get("min_score");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  let sql = `SELECT id, entity_type, entity_id, entity_slug, trust_provider, verification_type,
                    status, trust_score, certificate_url, verified_at, expires_at, created_at, updated_at
             FROM trust_verifications`;
  const where = [];
  const params = [];

  if (entityType) { where.push("entity_type = ?"); params.push(entityType); }
  if (entityId) { where.push("entity_id = ?"); params.push(entityId); }
  if (status) { where.push("status = ?"); params.push(status); }
  if (provider) { where.push("trust_provider = ?"); params.push(provider); }
  if (minScore) { where.push("trust_score >= ?"); params.push(parseInt(minScore, 10)); }

  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += ` ORDER BY trust_score DESC, verified_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const results = await db.prepare(sql).bind(...params).all();

  const countSql = `SELECT COUNT(*) as total FROM trust_verifications${where.length ? " WHERE " + where.join(" AND ") : ""}`;
  const countRes = await db.prepare(countSql).bind(...params.slice(0, -2)).first();

  return ok({
    verifications: results.results || [],
    total: countRes?.total || 0,
    limit,
    offset
  });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  let body;
  try { body = await request.json(); } catch { return err("INVALID_JSON", "Invalid JSON body."); }

  const required = ["entity_type", "entity_id", "verification_type"];
  for (const f of required) if (!body[f]) return err("MISSING_FIELD", `${f} is required.`);

  const id = randomId("tv");
  const now = new Date().toISOString();

  await db.prepare(`
    INSERT INTO trust_verifications (id, entity_type, entity_id, entity_slug, trust_provider,
      verification_type, status, trust_score, metadata_json, certificate_url, verified_at, expires_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.entity_type, body.entity_id, body.entity_slug || null,
    body.trust_provider || "trust.iai.one", body.verification_type,
    body.status || "pending", body.trust_score || 0,
    body.metadata_json || null, body.certificate_url || null,
    body.verified_at || null, body.expires_at || null, now, now
  ).run();

  // Audit log
  await db.prepare(`
    INSERT INTO trust_audit_log (id, entity_type, entity_id, action, performed_by, details_json, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(randomId("tal"), body.entity_type, body.entity_id, "verification_initiated", body.performed_by || null, JSON.stringify({ provider: body.trust_provider || "trust.iai.one" }), getClientIp(request), now).run();

  return ok({ id, status: body.status || "pending" }, 201);
}

export async function onRequestPatch(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return err("MISSING_ID", "?id required.");

  const db = env.DB;
  let body;
  try { body = await request.json(); } catch { return err("INVALID_JSON", "Invalid JSON body."); }

  // Get old record for score history
  const old = await db.prepare("SELECT entity_type, entity_id, trust_score FROM trust_verifications WHERE id = ?").bind(id).first();

  const allowed = ["status", "trust_score", "metadata_json", "certificate_url", "verified_at", "expires_at"];
  const updates = [];
  const params = [];

  for (const k of allowed) {
    if (body[k] !== undefined) { updates.push(`${k} = ?`); params.push(body[k]); }
  }

  if (updates.length === 0) return err("NO_UPDATES", "No valid fields to update.");

  const now = new Date().toISOString();
  updates.push("updated_at = ?"); params.push(now);
  params.push(id);

  await db.prepare(`UPDATE trust_verifications SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();

  // Score history
  if (old && body.trust_score !== undefined && body.trust_score !== old.trust_score) {
    await db.prepare(`
      INSERT INTO trust_score_history (id, entity_type, entity_id, old_score, new_score, reason, changed_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(randomId("tsh"), old.entity_type, old.entity_id, old.trust_score, body.trust_score, body.reason || null, body.changed_by || null, now).run();
  }

  // Audit log
  await db.prepare(`
    INSERT INTO trust_audit_log (id, entity_type, entity_id, action, performed_by, details_json, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(randomId("tal"), old?.entity_type || "", old?.entity_id || "", body.status === "verified" ? "check_passed" : "score_updated", body.performed_by || null, JSON.stringify(body), getClientIp(request), now).run();

  return ok({ id, updated: true });
}
