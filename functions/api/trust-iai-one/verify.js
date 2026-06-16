// FILE: /functions/api/trust-iai-one/verify.js

export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json();
    const { identity_id, government_id, credential_id } = body;

    if (!identity_id || !government_id) {
      return json({ ok: false, error: "Missing required fields" }, 400);
    }

    if (!env.TRUST_IAI_ONE_API_KEY) {
      return json({ ok: false, error: "Trust.iai.ONE API key not configured" }, 500);
    }

    // Call trust.iai.ONE verification API
    const trustResponse = await fetch("https://trust.iai.one/api/v1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.TRUST_IAI_ONE_API_KEY}`
      },
      body: JSON.stringify({
        identity_id,
        government_id,
        credential_id,
        tenant_code: "dsts"
      })
    });

    if (!trustResponse.ok) {
      const errorData = await trustResponse.json();
      return json({ ok: false, error: "Trust.iai.ONE verification failed", details: errorData }, trustResponse.status);
    }

    const trustData = await trustResponse.json();

    // Update user trust score based on verification result
    if (trustData.verified && env.DB) {
      const updateStmt = env.DB.prepare(`
        UPDATE users
        SET trust_score = ?,
        verified_status = ?,
        verified_at = ?
        WHERE user_id = ?
      `).bind(
        trustData.trust_score || 75,
        "verified",
        new Date().toISOString(),
        identity_id
      );

      await updateStmt.run();
    }

    return json({
      ok: true,
      verified: trustData.verified,
      trust_score: trustData.trust_score,
      verification_id: trustData.verification_id,
      verified_at: trustData.verified_at
    });
  } catch (error) {
    console.error("Trust.iai.ONE verification error:", error);
    return json({ ok: false, error: "Failed to verify with Trust.iai.ONE" }, 500);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
