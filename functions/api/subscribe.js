export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const name = (body.name || '').trim();
    if (!email || !email.includes('@')) {
      return Response.json({ ok: false, error: 'Email không hợp lệ' }, { status: 400 });
    }
    // Cloudflare Turnstile verification
    if (env.TURNSTILE_SECRET_KEY) {
      const token = (body.turnstile_token || '').trim();
      if (!token) {
        return Response.json({ ok: false, error: 'Thiếu xác minh bảo mật' }, { status: 400 });
      }
      const form = new FormData();
      form.append('secret', env.TURNSTILE_SECRET_KEY);
      form.append('response', token);
      const ip = request.headers.get('CF-Connecting-IP');
      if (ip) form.append('remoteip', ip);
      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
      const result = await verify.json();
      if (!result.success) {
        return Response.json({ ok: false, error: 'Xác minh bảo mật thất bại' }, { status: 403 });
      }
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
