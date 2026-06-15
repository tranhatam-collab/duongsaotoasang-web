// DSTS Layer 5 — trust.iai.one webhook
// POST /webhooks/trust-iai

import { verifyHmac } from '../_lib/auth.js';

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response('DB not bound', { status: 500 });
  
  // Verify HMAC signature
  const signature = context.request.headers.get('X-Signature');
  const payload = await context.request.text();
  
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing signature' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const secret = context.env.TRUST_IAI_ONE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const isValid = await verifyHmac(secret, payload, signature);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const body = JSON.parse(payload);
    const { verification_id, status, trust_score, entity_id, verified_at, expires_at } = body;
    
    // Log webhook delivery
    await db.prepare('INSERT INTO webhook_deliveries (webhook_type, payload_json) VALUES (?, ?)')
      .bind('trust_iai', JSON.stringify(body)).run();
    
    // Map entity_id "dsts-{user_id}" -> DSTS verified_identities
    const userIdMatch = entity_id && entity_id.match(/^dsts-(\d+)$/);
    if (!userIdMatch) return new Response('Invalid entity_id', { status: 400 });
    const user_id = parseInt(userIdMatch[1]);
    
    // Update or create external_verification record
    await db.prepare(
      'INSERT INTO external_verifications (verified_identity_id, provider, external_verification_id, status, trust_score, verified_at, expires_at, raw_response_json) VALUES ((SELECT id FROM verified_identities WHERE user_id = ?), "trust_iai", ?, ?, ?, ?, ?, ?) ON CONFLICT(external_verification_id) DO UPDATE SET status=excluded.status, trust_score=excluded.trust_score, verified_at=excluded.verified_at, expires_at=excluded.expires_at, updated_at=CURRENT_TIMESTAMP'
    ).bind(user_id, verification_id, status, trust_score || 0, verified_at, expires_at, JSON.stringify(body)).run();
    
    // Update verified_identities trust_score if approved
    if (status === 'approved') {
      await db.prepare(
        'UPDATE verified_identities SET trust_score = ?, status = "approved", verified_at = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
      ).bind(trust_score || 0, verified_at, user_id).run();
    }
    
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
