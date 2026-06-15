// DSTS Trust.iai.one API
// POST /api/trust-iai-one/batch-sync - Batch sync multiple entities (admin only)

import { batchSyncVerificationStatus } from '../../../_lib/trust-iai-one.js';
import { requireAccessJWT } from '../../../_lib/auth.js';

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
    
    const result = await batchSyncVerificationStatus(db, context.env, entity_ids);
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}