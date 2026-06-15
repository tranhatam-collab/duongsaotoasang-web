// DSTS Payment Webhook
// POST /webhooks/payment

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return new Response('DB not bound', { status: 500 });
  try {
    const body = await context.request.json();
    const { payment_id, status, provider, provider_transaction_id, receipt_url } = body;
    if (!payment_id || !status) return new Response('Missing fields', { status: 400 });
    await db.prepare(
      'UPDATE payments SET status = ?, provider = ?, provider_transaction_id = ?, receipt_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, provider || null, provider_transaction_id || null, receipt_url || null, payment_id).run();
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
