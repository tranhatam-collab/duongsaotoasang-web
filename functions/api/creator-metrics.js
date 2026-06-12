/**
 * functions/api/creator-metrics.js
 * Creator Economy Dashboard API
 * GET /api/creator-metrics?creator_id={id} — metrics for a creator
 * GET /api/creator-metrics/leaderboard — top creators by metric
 * POST /api/creator-metrics — ingest metric period (admin/system)
 */

import { json, ok, err, randomId } from "../_lib/api-helpers.js";

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const db = env.DB;
  const creatorId = url.searchParams.get("creator_id");
  const path = url.pathname;

  // Leaderboard
  if (path.endsWith("/leaderboard") || url.searchParams.get("leaderboard")) {
    const metric = url.searchParams.get("metric") || "revenue_vnd";
    const periodStart = url.searchParams.get("period_start");
    const periodEnd = url.searchParams.get("period_end");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);

    const allowedMetrics = ["revenue_vnd", "follower_count", "content_views", "engagement_rate", "retention_rate", "referral_count"];
    if (!allowedMetrics.includes(metric)) return err("INVALID_METRIC", `Allowed: ${allowedMetrics.join(", ")}`);

    let sql = `SELECT cm.*, c.display_name, c.slug as creator_slug
               FROM creator_metrics cm
               JOIN creators c ON cm.creator_id = c.id`;
    const where = [];
    const params = [];

    if (periodStart) { where.push("cm.period_start >= ?"); params.push(periodStart); }
    if (periodEnd) { where.push("cm.period_end <= ?"); params.push(periodEnd); }

    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += ` ORDER BY cm.${metric} DESC LIMIT ?`;
    params.push(limit);

    const results = await db.prepare(sql).bind(...params).all();
    return ok({ leaderboard: results.results || [] });
  }

  if (!creatorId) return err("MISSING_CREATOR_ID", "?creator_id required.");

  const periodStart = url.searchParams.get("period_start");
  const periodEnd = url.searchParams.get("period_end");

  let sql = `SELECT * FROM creator_metrics WHERE creator_id = ?`;
  const params = [creatorId];

  if (periodStart) { sql += " AND period_start >= ?"; params.push(periodStart); }
  if (periodEnd) { sql += " AND period_end <= ?"; params.push(periodEnd); }
  sql += " ORDER BY period_start DESC LIMIT 100";

  const results = await db.prepare(sql).bind(...params).all();

  // Aggregate totals
  const totals = await db.prepare(`
    SELECT
      SUM(revenue_vnd) as total_revenue,
      SUM(follower_delta) as total_follower_growth,
      SUM(referral_count) as total_referrals,
      SUM(content_views) as total_views,
      AVG(engagement_rate) as avg_engagement,
      AVG(retention_rate) as avg_retention
    FROM creator_metrics
    WHERE creator_id = ?
  `).bind(creatorId).first();

  // Revenue streams breakdown
  const streams = await db.prepare(`
    SELECT stream_type, SUM(amount_vnd) as total FROM creator_revenue_streams
    WHERE creator_id = ? GROUP BY stream_type ORDER BY total DESC
  `).bind(creatorId).all();

  return ok({
    metrics: results.results || [],
    totals: totals || {},
    revenue_streams: streams.results || []
  });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const db = env.DB;

  let body;
  try { body = await request.json(); } catch { return err("INVALID_JSON", "Invalid JSON body."); }

  const required = ["creator_id", "period_start", "period_end"];
  for (const f of required) if (!body[f]) return err("MISSING_FIELD", `${f} is required.`);

  const id = randomId("cm");
  const now = new Date().toISOString();

  await db.prepare(`
    INSERT INTO creator_metrics (id, creator_id, period_start, period_end, revenue_vnd, follower_count,
      follower_delta, retention_rate, conversion_rate, referral_count, talkshow_performance_json,
      content_views, engagement_rate, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.creator_id, body.period_start, body.period_end,
    body.revenue_vnd || 0, body.follower_count || 0, body.follower_delta || 0,
    body.retention_rate || null, body.conversion_rate || null, body.referral_count || 0,
    body.talkshow_performance_json || null, body.content_views || 0, body.engagement_rate || null, now
  ).run();

  // Insert revenue streams if provided
  if (Array.isArray(body.revenue_streams)) {
    for (const rs of body.revenue_streams) {
      const rsId = randomId("crs");
      await db.prepare(`
        INSERT INTO creator_revenue_streams (id, creator_id, stream_type, amount_vnd, platform_fee_vnd, net_vnd, period_start, period_end, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(rsId, body.creator_id, rs.stream_type, rs.amount_vnd || 0, rs.platform_fee_vnd || 0, rs.net_vnd || 0, body.period_start, body.period_end, now).run();
    }
  }

  return ok({ id }, 201);
}
