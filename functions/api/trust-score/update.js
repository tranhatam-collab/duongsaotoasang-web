// DSTS Trust Score API
// POST /api/trust-score/update/{entityId} - Update single entity
// POST /api/trust-score/batch - Update all entities

import { updateTrustScore, batchUpdateTrustScores } from '../../_lib/trust-score.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response('DB not bound', { status: 500 });
  
  try {
    const url = new URL(context.request.url);
    const pathParts = url.pathname.split('/');
    
    // Check if this is a batch update
    if (pathParts.includes('batch')) {
      const updated = await batchUpdateTrustScores(db);
      return new Response(JSON.stringify({ 
        ok: true, 
        updated,
        message: `Updated trust scores for ${updated} entities`
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Single entity update
    const entityId = pathParts[pathParts.length - 1];
    if (!entityId || entityId === 'update') {
      return new Response(JSON.stringify({ error: 'Entity ID required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const trustScore = await updateTrustScore(db, entityId);
    
    return new Response(JSON.stringify({ 
      ok: true, 
      trustScore 
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
