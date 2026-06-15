// DSTS Trust Score API
// POST /api/trust-score/update/{entityId} - Update single entity (admin only)
// POST /api/trust-score/batch - Update all entities (admin only)

import { updateTrustScore, batchUpdateTrustScores } from '../../_lib/trust-score.js';
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
