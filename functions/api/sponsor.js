// DSTS Layer 4 API — Sponsor Ecosystem
// GET /api/sponsors — Public wall
// GET /api/sponsor/:id — Sponsor detail
// POST /api/sponsor/campaign — Create campaign

export async function onRequestGet(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const { searchParams } = new URL(context.request.url);
    const status = searchParams.get('status') || 'active';
    const { results } = await db.prepare(
      'SELECT id, slug, name, logo_url, website_url, tier, status, country, total_contributed_vnd FROM sponsors WHERE status = ? ORDER BY total_contributed_vnd DESC LIMIT 50'
    ).bind(status).all();
    return new Response(JSON.stringify({ ok: true, data: results || [] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const body = await context.request.json();
    const { sponsor_id, campaign_type, title, budget_cents } = body;
    if (!sponsor_id || !campaign_type || !title || !budget_cents) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }
    const result = await db.prepare(
      'INSERT INTO sponsor_campaigns (sponsor_id, campaign_type, title, budget_cents) VALUES (?, ?, ?, ?)'
    ).bind(sponsor_id, campaign_type, title, budget_cents).run();
    return new Response(JSON.stringify({ ok: true, id: result.meta.last_row_id }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
