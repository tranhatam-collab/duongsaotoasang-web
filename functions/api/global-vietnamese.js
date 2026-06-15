/**
 * functions/api/global-vietnamese.js
 * Global Vietnamese Map API
 * GET /api/global-vietnamese — list with filters
 * GET /api/global-vietnamese?id={id} — single profile with connections
 * GET /api/global-vietnamese/map — geo data for map rendering
 * POST /api/global-vietnamese — create profile
 * POST /api/global-vietnamese/connections — create connection
 */

import { json, ok, err, randomId, getClientIp, checkRateLimit } from "../_lib/api-helpers.js";

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const db = env.DB;
  const id = url.searchParams.get("id");
  const slug = url.searchParams.get("slug");
  const path = url.pathname;

  // Map geo endpoint
  if (path.includes("/map")) {
    const bounds = url.searchParams.get("bounds"); // sw_lat,sw_lng,ne_lat,ne_lng
    const category = url.searchParams.get("category");
    let sql = `SELECT id, slug, name, category, country, city, latitude, longitude, avatar_url, headline, is_featured
               FROM global_vietnamese WHERE status = 'active' AND latitude IS NOT NULL AND longitude IS NOT NULL`;
    const params = [];

    if (category) { sql += " AND category = ?"; params.push(category); }

    if (bounds) {
      const [swLat, swLng, neLat, neLng] = bounds.split(",").map(Number);
      sql += " AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?";
      params.push(swLat, neLat, swLng, neLng);
    }

    sql += " ORDER BY is_featured DESC, name ASC LIMIT 500";
    const results = await db.prepare(sql).bind(...params).all();

    // Cluster summary
    const clusters = await db.prepare(`
      SELECT country, category, COUNT(*) as count FROM global_vietnamese
      WHERE status = 'active' GROUP BY country, category ORDER BY count DESC
    `).all();

    return ok({ profiles: results.results || [], clusters: clusters.results || [] });
  }

  if (id || slug) {
    const profile = await db.prepare(
      `SELECT gv.*,
        (SELECT json_group_array(json_object(
          'id', gvc.id, 'to_id', gvc.to_id, 'connection_type', gvc.connection_type,
          'description', gvc.description, 'to_name', gv2.name, 'to_slug', gv2.slug,
          'to_category', gv2.category, 'to_avatar', gv2.avatar_url
        )) FROM global_vietnamese_connections gvc
        JOIN global_vietnamese gv2 ON gvc.to_id = gv2.id
        WHERE gvc.from_id = gv.id ORDER BY gvc.created_at DESC LIMIT 20) as connections,
        ve.trust_score, ve.badge_type as verification_badge
       FROM global_vietnamese gv
       LEFT JOIN verified_entities ve ON gv.verified_entity_id = ve.id
       WHERE gv.id = ? OR gv.slug = ?`
    ).bind(id || "", slug || "").first();

    if (!profile) return err("NOT_FOUND", "Profile not found.", 404);
    profile.connections = JSON.parse(profile.connections || "[]");
    return ok({ profile });
  }

  const category = url.searchParams.get("category");
  const country = url.searchParams.get("country");
  const featured = url.searchParams.get("featured");
  const status = url.searchParams.get("status") || "active";
  const q = url.searchParams.get("q");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  let sql = `SELECT gv.id, gv.slug, gv.name, gv.category, gv.headline, gv.country, gv.city,
                    gv.latitude, gv.longitude, gv.avatar_url, gv.cover_url, gv.is_featured,
                    gv.status, gv.view_count, gv.created_at, ve.trust_score, ve.badge_type as verification_badge
             FROM global_vietnamese gv
             LEFT JOIN verified_entities ve ON gv.verified_entity_id = ve.id`;
  const where = [];
  const params = [];

  if (status) { where.push("gv.status = ?"); params.push(status); }
  if (category) { where.push("gv.category = ?"); params.push(category); }
  if (country) { where.push("gv.country = ?"); params.push(country); }
  if (featured) { where.push("gv.is_featured = 1"); }
  if (q) { where.push("(gv.name LIKE ? OR gv.headline LIKE ? OR gv.bio LIKE ?)"); params.push(`%${q}%`, `%${q}%`, `%${q}%`); }

  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += ` ORDER BY gv.is_featured DESC, gv.view_count DESC, gv.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const results = await db.prepare(sql).bind(...params).all();

  const countSql = `SELECT COUNT(*) as total FROM global_vietnamese gv${where.length ? " WHERE " + where.join(" AND ") : ""}`;
  const countRes = await db.prepare(countSql).bind(...params.slice(0, -2)).first();

  return ok({
    profiles: results.results || [],
    total: countRes?.total || 0,
    limit,
    offset
  });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  const url = new URL(request.url);
  const path = url.pathname;

  // Connection creation
  if (path.includes("/connections")) {
    let body;
    try { body = await request.json(); } catch { return err("INVALID_JSON", "Invalid JSON body."); }

    const required = ["from_id", "to_id", "connection_type"];
    for (const f of required) if (!body[f]) return err("MISSING_FIELD", `${f} is required.`);

    const id = randomId("gvc");
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO global_vietnamese_connections (id, from_id, to_id, connection_type, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, body.from_id, body.to_id, body.connection_type, body.description || null, now).run();

    return ok({ id }, 201);
  }

  // Profile creation
  let body;
  try { body = await request.json(); } catch { return err("INVALID_JSON", "Invalid JSON body."); }

  const required = ["slug", "name", "category"];
  for (const f of required) if (!body[f]) return err("MISSING_FIELD", `${f} is required.`);

  const id = randomId("gv");
  const now = new Date().toISOString();

  await db.prepare(`
    INSERT INTO global_vietnamese (id, slug, name, category, headline, bio, country, city, latitude, longitude,
      avatar_url, cover_url, verified_entity_id, social_links_json, achievements_json, is_featured, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.slug, body.name, body.category, body.headline || null, body.bio || null,
    body.country || null, body.city || null, body.latitude || null, body.longitude || null,
    body.avatar_url || null, body.cover_url || null, body.verified_entity_id || null,
    body.social_links_json || null, body.achievements_json || null,
    body.is_featured ? 1 : 0, body.status || "draft", now, now
  ).run();

  return ok({ id, slug: body.slug }, 201);
}

export async function onRequestPatch(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return err("MISSING_ID", "?id required.");

  const db = env.DB;
  let body;
  try { body = await request.json(); } catch { return err("INVALID_JSON", "Invalid JSON body."); }

  const allowed = ["slug", "name", "category", "headline", "bio", "country", "city", "latitude", "longitude",
    "avatar_url", "cover_url", "verified_entity_id", "social_links_json", "achievements_json", "is_featured", "status"];
  const updates = [];
  const params = [];

  for (const k of allowed) {
    if (body[k] !== undefined) { updates.push(`${k} = ?`); params.push(body[k]); }
  }

  if (updates.length === 0) return err("NO_UPDATES", "No valid fields to update.");

  const now = new Date().toISOString();
  updates.push("updated_at = ?"); params.push(now);
  params.push(id);

  await db.prepare(`UPDATE global_vietnamese SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
  return ok({ id, updated: true });
}
