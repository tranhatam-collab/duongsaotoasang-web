// DSTS Payment Webhook
// POST /webhooks/payment
// HMAC-verified payment webhook from pay.iai.one

async function verifyHmac(secret, payload, signature) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const sigBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response('DB not bound', { status: 500 });
  
  try {
    // Read body once for HMAC verification
    const payload = await context.request.text();
    const body = JSON.parse(payload);
    const { payment_id, status, provider, provider_transaction_id, receipt_url, event_id } = body;
    
    if (!payment_id || !status) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // HMAC verification (fail-closed)
    const hmacSecret = context.env.PAY_DSTS_HMAC || context.env.PAY_IAI_ONE_HMAC;
    if (!hmacSecret) {
      return new Response(JSON.stringify({ ok: false, error: 'HMAC secret not configured' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const signature = context.request.headers.get('X-Webhook-Signature');
    if (!signature) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing signature' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const isValid = await verifyHmac(hmacSecret, payload, signature);
    if (!isValid) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid signature' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Replay guard (event_id dedup)
    if (event_id) {
      const existingEvent = await db.prepare('SELECT id FROM payment_webhook_events WHERE event_id = ?').bind(event_id).first();
      if (existingEvent) {
        return new Response(JSON.stringify({ ok: true, message: 'Event already processed' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Unknown-payment guard (check if payment exists)
    const payment = await db.prepare('SELECT id FROM payments WHERE id = ?').bind(payment_id).first();
    if (!payment) {
      return new Response(JSON.stringify({ ok: false, error: 'Payment not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update payment
    await db.prepare(
      'UPDATE payments SET status = ?, provider = ?, provider_transaction_id = ?, receipt_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, provider || null, provider_transaction_id || null, receipt_url || null, payment_id).run();
    
    // Log event for replay guard
    if (event_id) {
      await db.prepare(
        'INSERT INTO payment_webhook_events (id, event_id, payment_id, processed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
      ).bind(crypto.randomUUID(), event_id, payment_id).run();
    }
    
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
