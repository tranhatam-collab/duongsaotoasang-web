// DSTS Layer 3 API — Creator Analytics
// GET /api/analytics/:creator_id?range=30d

export async function onRequestGet(context) {
  const { creator_id } = context.params;
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const { searchParams } = new URL(context.request.url);
    const range = searchParams.get('range') || '30d';
    const days = parseInt(range) || 30;
    const { results } = await db.prepare(
      'SELECT period_start as date, revenue_vnd, follower_count, follower_delta, content_views, engagement_rate, retention_rate, referral_count FROM creator_metrics WHERE creator_id = ? AND period_start >= date("now", "-" || ? || " days") ORDER BY period_start DESC'
    ).bind(creator_id, days).all();
    return new Response(JSON.stringify({ ok: true, data: results || [] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
