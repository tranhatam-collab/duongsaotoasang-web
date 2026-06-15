// DSTS Trust.iai.one API
// POST /api/trust-iai-one/sync/{entityId} - Sync verification status (admin only)

import { syncVerificationStatus } from '../../_lib/trust-iai-one.js';
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
    const entityId = pathParts[pathParts.length - 1];
    
    if (!entityId || entityId === 'sync') {
      return new Response(JSON.stringify({ error: 'Entity ID required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await syncVerificationStatus(db, context.env, entityId);
    
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