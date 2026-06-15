// DSTS Trust Score API
// POST /api/trust-score/batch - Update all entities (admin only)

import { batchUpdateTrustScores } from '../../_lib/trust-score.js';
import { requireAccessJWT } from '../../_lib/auth.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response('DB not bound', { status: 500 });
  
  // Require admin authentication
  try {
    await requireAccessJWT(context.request, context.env);
  } catch (authError) {
    return authError;
  }
  
  try {
    const body = await context.request.json();
    const { entity_ids } = body;
    
    if (!entity_ids || !Array.isArray(entity_ids)) {
      return new Response(JSON.stringify({ error: 'entity_ids array required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const updated = await batchUpdateTrustScores(db, entity_ids);
    
    return new Response(JSON.stringify({ 
      ok: true, 
      updated,
      message: `Updated trust scores for ${updated} entities`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}