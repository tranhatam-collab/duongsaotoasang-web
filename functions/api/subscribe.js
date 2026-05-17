export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const name = (body.name || '').trim();
    if (!email || !email.includes('@')) {
      return Response.json({ ok: false, error: 'Email không hợp lệ' }, { status: 400 });
    }
    // Store in D1
    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT OR IGNORE INTO newsletter_subscribers (id, email, name, source, created_at)
       VALUES (?, ?, ?, 'website', datetime('now'))`
    ).bind(id, email, name).run();
    return Response.json({ ok: true, message: 'Cảm ơn bạn đã đăng ký!' });
  } catch (e) {
    return Response.json({ ok: false, error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
export async function onRequestGet() {
  return Response.json({ ok: true, service: 'subscribe-api' });
}
