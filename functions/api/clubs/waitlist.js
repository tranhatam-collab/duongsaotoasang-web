const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const errorJson = (code, message, status = 400) =>
  json({ ok: false, error: code, message }, status);

const VALID_INTEREST_TYPES = ["member", "circle", "inner_circle", "creator", "sponsor", "talkshow_reminder"];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function randomId(prefix = "") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}_${hex}` : hex;
}

export const onRequestPost = async ({ request, env }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorJson("INVALID_JSON", "Request body must be valid JSON.");
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) return errorJson("INVALID_EMAIL", "A valid email address is required.");

  const interestType = (body.interest_type || "").trim().toLowerCase();
  if (!interestType || !VALID_INTEREST_TYPES.includes(interestType)) {
    return errorJson("INVALID_INTEREST_TYPE", `Interest type must be one of: ${VALID_INTEREST_TYPES.join(", ")}`);
  }

  if (!env.DB) return errorJson("DB_UNAVAILABLE", "Database not available.", 503);

  const existing = await env.DB.prepare(
    "SELECT id, interest_type, status FROM club_waitlist WHERE email = ?"
  ).bind(email).first();

  if (existing) return json({ ok: true, replayed: true, id: existing.id, status: existing.status });

  const id = randomId("wl");
  const phone = (body.phone || "").trim() || null;
  const fullName = (body.full_name || "").trim() || null;
  const creatorSlug = (body.creator_slug || "").trim() || null;
  const notes = (body.notes || "").slice(0, 1000).trim() || null;
  const sourceRoute = (body.source_route || "").slice(0, 200).trim() || null;

  await env.DB.prepare(`
    INSERT INTO club_waitlist (id, email, phone, full_name, interest_type, creator_slug, notes, source_route, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))
  `).bind(id, email, phone, fullName, interestType, creatorSlug, notes, sourceRoute).run();

  // Send confirmation email (fire-and-forget; failure is non-blocking)
  try {
    const { sendEmail } = await import("../../_lib/email.js");
    const interestLabel = {
      member: "Member", circle: "Circle", inner_circle: "Inner Circle",
      creator: "Creator", sponsor: "Sponsor", talkshow_reminder: "Talk Show Reminder"
    }[interestType] || interestType;
    await sendEmail(env, {
      to: email,
      subject: "Xác nhận ghi danh DSTS Club — Đường Sao Tỏa Sáng",
      replyTo: "hello@duongsaotoasang.com",
      tags: [{ name: "type", value: "club_waitlist_confirm" }],
      html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b111d;color:#e2e8f0;padding:40px 32px;border-radius:12px">
  <h1 style="font-size:1.5rem;color:#e0c896;margin:0 0 16px">Cảm ơn bạn đã ghi danh!</h1>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 16px">
    ${fullName ? `Xin chào <strong style="color:#e2e8f0">${fullName}</strong>,` : "Xin chào,"}
    bạn đã ghi danh thành công vào danh sách chờ <strong style="color:#e2e8f0">DSTS Club — ${interestLabel}</strong>.
  </p>
  <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px">
    Chúng tôi sẽ liên hệ qua email khi chính thức mở cửa. Trong thời gian chờ, bạn có thể tìm hiểu thêm tại
    <a href="https://duongsaotoasang.com/club" style="color:#e0c896">duongsaotoasang.com/club</a>.
  </p>
  <hr style="border:none;border-top:1px solid rgba(216,188,119,.14);margin:0 0 24px">
  <p style="font-size:.8rem;color:#64748b">
    &copy; 2026 Đường Sao Tỏa Sáng &middot; <a href="https://duongsaotoasang.com/legal" style="color:#64748b">Chính sách bảo mật</a>
  </p>
</div>`
    });
  } catch {}

  return json({ ok: true, id, status: "new" });
};
