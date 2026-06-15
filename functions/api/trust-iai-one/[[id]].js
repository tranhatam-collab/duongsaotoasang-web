// DSTS Trust.iai.one API
// POST /api/trust-iai-one/verify/{entityId} - Verify entity with trust.iai.one (admin only)
// POST /api/trust-iai-one/sync/{entityId} - Sync verification status (admin only)
// POST /api/trust-iai-one/batch-sync - Batch sync multiple entities (admin only)

import { verifyWithTrustIAIOne, getVerificationStatus, syncVerificationStatus, batchSyncVerificationStatus } from '../../_lib/trust-iai-one.js';
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
    
    // Check if this is a batch sync
    if (pathParts.includes('batch-sync')) {
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
    }
    
    // Check if this is a sync
    if (pathParts.includes('sync')) {
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
    }
    
    // Verify entity
    const entityId = pathParts[pathParts.length - 1];
    if (!entityId || entityId === 'verify') {
      return new Response(JSON.stringify({ error: 'Entity ID required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fetch entity data
    const entity = await db.prepare('SELECT * FROM verified_entities WHERE id = ?').bind(entityId).first();
    
    if (!entity) {
      return new Response(JSON.stringify({ error: 'Entity not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verify with trust.iai.one (passes db for local fallback if no key)
    const result = await verifyWithTrustIAIOne(context.env, entity, db);

    // If local fallback, just return the result without updating DB
    if (result.mode === 'local_fallback' || result.mode === 'api_error' || result.mode === 'network_error') {
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update local database with verification result
    await db.prepare(`
      UPDATE verified_entities
      SET status = ?, trust_score = ?, verified_at = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      result.status,
      result.trust_score || 0,
      result.verified_at || null,
      result.expires_at || null,
      entityId
    ).run();

    return new Response(JSON.stringify({
      ok: true,
      result
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
