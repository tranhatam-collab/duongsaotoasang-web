/**
 * functions/api/sponsors.js
 * Sponsor Ecosystem API
 * GET /api/sponsors — list sponsors
 * GET /api/sponsors?id={id} — single sponsor with campaigns & impact
 * POST /api/sponsors — create sponsor record
 * GET /api/sponsors/campaigns — list campaigns
 * GET /api/sponsors/impact — impact reports
 */

import { json, ok, err, randomId, getClientIp, checkRateLimit } from "../_lib/api-helpers.js";

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const db = env.DB;
  const id = url.searchParams.get("id");
  const slug = url.searchParams.get("slug");
  const path = url.pathname;

  // Campaigns list
  if (path.includes("/campaigns") && !id && !slug) {
    const sponsorId = url.searchParams.get("sponsor_id");
    const status = url.searchParams.get("status");
    let sql = `SELECT sc.*, s.name as sponsor_name, s.logo_url as sponsor_logo FROM sponsor_campaigns sc JOIN sponsors s ON sc.sponsor_id = s.id`;
    const where = [];
    const params = [];
    if (sponsorId) { where.push("sc.sponsor_id = ?"); params.push(sponsorId); }
    if (status) { where.push("sc.status = ?"); params.push(status); }
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY sc.start_date DESC LIMIT 100";
    const res = await db.prepare(sql).bind(...params).all();
    return ok({ campaigns: res.results || [] });
  }

  // Impact reports
  if (path.includes("/impact") && !id && !slug) {
    const sponsorId = url.searchParams.get("sponsor_id");
    const campaignId = url.searchParams.get("campaign_id");
    if (!sponsorId) return err("MISSING_SPONSOR_ID", "?sponsor_id required.");
    let sql = `SELECT * FROM sponsor_impact_reports WHERE sponsor_id = ?`;
    const params = [sponsorId];
    if (campaignId) { sql += " AND campaign_id = ?"; params.push(campaignId); }
    sql += " ORDER BY report_period_end DESC LIMIT 50";
    const res = await db.prepare(sql).bind(...params).all();
    return ok({ reports: res.results || [] });
  }

  if (id || slug) {
    const sponsor = await db.prepare(
      `SELECT sp.*,
        (SELECT json_group_array(json_object(
          'id', sc.id, 'name', sc.name, 'slug', sc.slug, 'campaign_type', sc.campaign_type,
          'start_date', sc.start_date, 'end_date', sc.end_date, 'budget_vnd', sc.budget_vnd,
          'spent_vnd', sc.spent_vnd, 'status', sc.status
        )) FROM sponsor_campaigns sc WHERE sc.sponsor_id = sp.id ORDER BY sc.start_date DESC) as campaigns,
        (SELECT json_group_array(json_object(
          'id', sir.id, 'report_period_start', sir.report_period_start, 'report_period_end', sir.report_period_end,
          'reach_count', sir.reach_count, 'mentor_hours', sir.mentor_hours, 'youth_served', sir.youth_served,
          'generated_at', sir.generated_at
        )) FROM sponsor_impact_reports sir WHERE sir.sponsor_id = sp.id ORDER BY sir.report_period_end DESC LIMIT 12) as impact
       FROM sponsors sp WHERE sp.id = ? OR sp.slug = ?`
    ).bind(id || "", slug || "").first();

    if (!sponsor) return err("NOT_FOUND", "Sponsor not found.", 404);
    sponsor.campaigns = JSON.parse(sponsor.campaigns || "[]");
    sponsor.impact = JSON.parse(sponsor.impact || "[]");
    return ok({ sponsor });
  }

  const status = url.searchParams.get("status");
  const tier = url.searchParams.get("tier");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  let sql = `SELECT id, slug, name, logo_url, tier, status, industry, country, total_contributed_vnd, start_date, end_date, created_at FROM sponsors`;
  const where = [];
  const params = [];

  if (status) { where.push("status = ?"); params.push(status); }
  if (tier) { where.push("tier = ?"); params.push(tier); }

  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += ` ORDER BY total_contributed_vnd DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const results = await db.prepare(sql).bind(...params).all();

  const countSql = `SELECT COUNT(*) as total FROM sponsors${where.length ? " WHERE " + where.join(" AND ") : ""}`;
  const countRes = await db.prepare(countSql).bind(...params.slice(0, -2)).first();

  return ok({ sponsors: results.results || [], total: countRes?.total || 0, limit, offset });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  let body;
  try { body = await request.json(); } catch { return err("INVALID_JSON", "Invalid JSON body."); }

  const required = ["slug", "name"];
  for (const f of required) if (!body[f]) return err("MISSING_FIELD", `${f} is required.`);

  const id = randomId("sp");
  const now = new Date().toISOString();

  await db.prepare(`
    INSERT INTO sponsors (id, slug, name, logo_url, website_url, tier, status, contact_name, contact_email, contact_phone, industry, country, mission_alignment, start_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.slug, body.name, body.logo_url || null, body.website_url || null,
    body.tier || "bronze", body.status || "prospect", body.contact_name || null,
    body.contact_email || null, body.contact_phone || null, body.industry || null,
    body.country || null, body.mission_alignment || null, body.start_date || now, now, now
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

  const allowed = ["name", "logo_url", "website_url", "tier", "status", "contact_name", "contact_email", "contact_phone", "industry", "country", "mission_alignment", "total_contributed_vnd", "start_date", "end_date"];
  const updates = [];
  const params = [];

  for (const k of allowed) {
    if (body[k] !== undefined) { updates.push(`${k} = ?`); params.push(body[k]); }
  }

  if (updates.length === 0) return err("NO_UPDATES", "No valid fields to update.");

  const now = new Date().toISOString();
  updates.push("updated_at = ?"); params.push(now);
  params.push(id);

  await db.prepare(`UPDATE sponsors SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
  return ok({ id, updated: true });
}
