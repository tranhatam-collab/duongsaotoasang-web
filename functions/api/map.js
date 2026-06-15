// DSTS Layer 6 API — Global Vietnamese Map
// GET /api/map/entities?type=&country=&lat=&lon=&limit=

export async function onRequestGet(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const { searchParams } = new URL(context.request.url);
    const type = searchParams.get('type');
    const country = searchParams.get('country');
    const lat = parseFloat(searchParams.get('lat')) || 0;
    const lon = parseFloat(searchParams.get('lon')) || 0;
    const radius = parseFloat(searchParams.get('radius')) || 500; // km
    const limit = Math.min(parseInt(searchParams.get('limit')) || 100, 500);
    
    // Simple bounding box query (D1 has no spatial index)
    const latDelta = radius / 111;
    const lonDelta = radius / (111 * Math.cos(lat * Math.PI / 180));
    
    let sql = 'SELECT g.id, g.slug, g.name, g.category, g.headline, g.country, g.city, g.latitude, g.longitude, g.avatar_url, COALESCE(v.trust_score, 0) AS trust_score FROM global_vietnamese g LEFT JOIN verified_entities v ON g.verified_entity_id = v.id WHERE g.status = "active" AND g.latitude IS NOT NULL';
    const params = [];

    if (type) { sql += ' AND g.category = ?'; params.push(type); }
    if (country) { sql += ' AND g.country = ?'; params.push(country); }
    if (lat && lon) {
      sql += ' AND g.latitude BETWEEN ? AND ? AND g.longitude BETWEEN ? AND ?';
      params.push(lat - latDelta, lat + latDelta, lon - lonDelta, lon + lonDelta);
    }
    sql += ' ORDER BY trust_score DESC LIMIT ?';
    params.push(limit);
    
    const { results } = await db.prepare(sql).bind(...params).all();
    return new Response(JSON.stringify({ ok: true, count: results?.length || 0, data: results || [] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
