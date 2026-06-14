// DSTS Payment — Create Payment Intent
// POST /api/payment/create-intent

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response(JSON.stringify({ error: 'DB not bound' }), { status: 500 });
  try {
    const body = await context.request.json();
    const { amount_cents, currency, description, user_id, type } = body;
    if (!amount_cents || !currency || !description) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }
    const result = await db.prepare(
      'INSERT INTO payments (user_id, amount_cents, currency, description, type, status, created_at) VALUES (?, ?, ?, ?, ?, "pending", CURRENT_TIMESTAMP)'
    ).bind(user_id || null, amount_cents, currency, description, type || 'donation').run();
    const paymentId = result.meta.last_row_id;
    const payApiKey = context.env.PAY_IAI_ONE_API_KEY;
    let clientAction = null;
    if (payApiKey) {
      try {
        const payRes = await fetch('https://pay.iai.one/api/v1/intents', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${payApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amount_cents, currency, description, external_id: `dsts-${paymentId}` })
        });
        const payJson = await payRes.json();
        if (payJson.ok && payJson.data?.client_action) clientAction = payJson.data.client_action;
      } catch (e) { /* fallback */ }
    }
    return new Response(JSON.stringify({ ok: true, paymentId, clientAction }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
