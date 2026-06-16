// FILE: /functions/api/nguoiviet/webhook.js

export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json();
    const { event, data } = body;

    if (!event) {
      return json({ ok: false, error: "Missing event type" }, 400);
    }

    if (!env.NGUOIVIET_WEBHOOK_SECRET) {
      return json({ ok: false, error: "NguoiViet webhook secret not configured" }, 500);
    }

    // Verify webhook signature
    const signature = request.headers.get("X-NguoiViet-Signature");
    if (!signature) {
      return json({ ok: false, error: "Missing signature" }, 401);
    }

    const expectedSignature = crypto
      .createHmac("sha256", env.NGUOVIET_WEBHOOK_SECRET)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return json({ ok: false, error: "Invalid signature" }, 401);
    }

    // Handle different event types
    switch (event) {
      case "trust_score.updated":
        await handleTrustScoreUpdate(data, env);
        break;
      case "user.verified":
        await handleUserVerified(data, env);
        break;
      case "story.created":
        await handleStoryCreated(data, env);
        break;
      case "story.updated":
        await handleStoryUpdated(data, env);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    return json({ ok: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("NguoiViet webhook error:", error);
    return json({ ok: false, error: "Failed to process webhook" }, 500);
  }
};

async function handleTrustScoreUpdate(data, env) {
  if (!env.DB) return;

  const { user_id, trust_score } = data;

  const updateStmt = env.DB.prepare(`
    UPDATE users
    SET trust_score = ?
    WHERE user_id = ?
  `).bind(trust_score, user_id);

  await updateStmt.run();
}

async function handleUserVerified(data, env) {
  if (!env.DB) return;

  const { user_id, verified_status, verified_at } = data;

  const updateStmt = env.DB.prepare(`
    UPDATE users
    SET verified_status = ?,
        verified_at = ?
    WHERE user_id = ?
  `).bind(verified_status, verified_at, user_id);

  await updateStmt.run();
}

async function handleStoryCreated(data, env) {
  if (!env.DB) return;

  const { slug, title_vi, title_en, excerpt_vi, excerpt_en, content_vi, content_en, tags, cover_url } = data;

  const insertStmt = env.DB.prepare(`
    INSERT OR REPLACE INTO contents (slug, type, title_vi, title_en, excerpt_vi, excerpt_en, content_vi, content_en, tags, cover_url, created_at)
    VALUES (?, 'story', ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(slug, title_vi, title_en, excerpt_vi, excerpt_en, content_vi, content_en, tags, cover_url, new Date().toISOString());

  await insertStmt.run();
}

async function handleStoryUpdated(data, env) {
  if (!env.DB) return;

  const { slug, title_vi, title_en, excerpt_vi, excerpt_en, content_vi, content_en, tags, cover_url } = data;

  const updateStmt = env.DB.prepare(`
    UPDATE contents
    SET title_vi = ?,
        title_en = ?,
        excerpt_vi = ?,
        excerpt_en = ?,
        content_vi = ?,
        content_en = ?,
        tags = ?,
        cover_url = ?
    WHERE slug = ?
  `).bind(title_vi, title_en, excerpt_vi, excerpt_en, content_vi, content_en, tags, cover_url, slug);

  await updateStmt.run();
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
