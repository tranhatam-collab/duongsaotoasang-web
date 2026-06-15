/**
 * functions/api/legacy-stories.js
 * Story Preservation Engine API
 * GET /api/legacy-stories — list with filters
 * GET /api/legacy-stories?id={id} — single story with media & timeline
 * POST /api/legacy-stories — create (staff or verified creator)
 */

import { json, ok, err, randomId, getClientIp } from "../_lib/api-helpers.js";

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const slug = url.searchParams.get("slug");
  const db = env.DB;

  if (id || slug) {
    const story = await db.prepare(
      `SELECT ls.*,
        (SELECT json_group_array(json_object(
          'id', lm.id, 'media_type', lm.media_type, 'url', lm.url,
          'caption', lm.caption, 'mime_type', lm.mime_type, 'created_at', lm.created_at
        )) FROM legacy_media lm WHERE lm.story_id = ls.id) as media,
        (SELECT json_group_array(json_object(
          'id', lte.id, 'event_date', lte.event_date, 'event_year', lte.event_year,
          'event_title', lte.event_title, 'event_description', lte.event_description,
          'importance', lte.importance
        )) FROM legacy_timeline_events lte WHERE lte.story_id = ls.id ORDER BY lte.event_date, lte.event_year) as timeline
       FROM legacy_stories ls WHERE ls.id = ? OR ls.slug = ?`
    ).bind(id || "", slug || "").first();

    if (!story) return err("NOT_FOUND", "Story not found.", 404);
    story.media = JSON.parse(story.media || "[]");
    story.timeline = JSON.parse(story.timeline || "[]");
    return ok({ story });
  }

  const type = url.searchParams.get("type");
  const archiveStatus = url.searchParams.get("archive_status") || "active";
  const creatorId = url.searchParams.get("creator_id");
  const q = url.searchParams.get("q");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  let sql = `SELECT ls.id, ls.slug, ls.subject_name, ls.title, ls.summary, ls.story_type,
                    ls.archive_status, ls.preservation_level, ls.view_count, ls.created_at,
                    ls.video_url, ls.audio_url, ls.photo_urls_json
             FROM legacy_stories ls`;
  const where = [];
  const params = [];

  if (type) { where.push("ls.story_type = ?"); params.push(type); }
  if (archiveStatus) { where.push("ls.archive_status = ?"); params.push(archiveStatus); }
  if (creatorId) { where.push("ls.creator_id = ?"); params.push(creatorId); }
  if (q) { where.push("(ls.title LIKE ? OR ls.subject_name LIKE ? OR ls.summary LIKE ?)"); params.push(`%${q}%`, `%${q}%`, `%${q}%`); }

  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += ` ORDER BY ls.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const results = await db.prepare(sql).bind(...params).all();

  const countSql = `SELECT COUNT(*) as total FROM legacy_stories ls${where.length ? " WHERE " + where.join(" AND ") : ""}`;
  const countRes = await db.prepare(countSql).bind(...params.slice(0, -2)).first();

  return ok({
    stories: results.results || [],
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

  const required = ["slug", "subject_name", "title"];
  for (const f of required) if (!body[f]) return err("MISSING_FIELD", `${f} is required.`);

  const now = new Date().toISOString();
  const id = randomId("ls");

  await db.prepare(`
    INSERT INTO legacy_stories (id, slug, creator_id, subject_name, subject_birth_year, subject_origin,
      title, summary, story_type, video_url, audio_url, document_urls_json, photo_urls_json,
      timeline_json, family_tree_json, archive_status, preservation_level, verified_entity_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.slug, body.creator_id || null, body.subject_name, body.subject_birth_year || null,
    body.subject_origin || null, body.title, body.summary || null, body.story_type || "biography",
    body.video_url || null, body.audio_url || null, body.document_urls_json || null,
    body.photo_urls_json || null, body.timeline_json || null, body.family_tree_json || null,
    body.archive_status || "active", body.preservation_level || "standard",
    body.verified_entity_id || null, now, now
  ).run();

  // Insert timeline events if provided
  if (Array.isArray(body.timeline_events)) {
    for (const ev of body.timeline_events) {
      const evId = randomId("lte");
      await db.prepare(`
        INSERT INTO legacy_timeline_events (id, story_id, event_date, event_year, event_title, event_description, importance, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(evId, id, ev.event_date || null, ev.event_year || null, ev.event_title, ev.event_description || null, ev.importance || 3, now).run();
    }
  }

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

  const allowed = ["slug", "subject_name", "subject_birth_year", "subject_origin", "title", "summary",
    "story_type", "video_url", "audio_url", "document_urls_json", "photo_urls_json", "timeline_json",
    "family_tree_json", "archive_status", "preservation_level", "verified_entity_id"];
  const updates = [];
  const params = [];

  for (const k of allowed) {
    if (body[k] !== undefined) { updates.push(`${k} = ?`); params.push(body[k]); }
  }

  if (updates.length === 0) return err("NO_UPDATES", "No valid fields to update.");

  const now = new Date().toISOString();
  updates.push("updated_at = ?"); params.push(now);
  params.push(id);

  await db.prepare(`UPDATE legacy_stories SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
  return ok({ id, updated: true });
}
