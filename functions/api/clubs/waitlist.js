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

  return json({ ok: true, id, status: "new" });
};
