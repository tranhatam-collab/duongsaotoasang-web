// FILE: /functions/api/nguoiviet/auth.js

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const redirect_uri = url.searchParams.get("redirect_uri");
  const state = url.searchParams.get("state");

  if (!env.NGUOIVIET_CLIENT_ID || !env.NGUOIVIET_CLIENT_SECRET) {
    return json({ ok: false, error: "NguoiViet integration not configured" }, 500);
  }

  // Generate OAuth 2.0 authorization URL
  const authUrl = new URL("https://nguoiviet.muonnoi.org/oauth/authorize");
  authUrl.searchParams.set("client_id", env.NGUOIVIET_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirect_uri || "https://duongsaotoasang.com/auth/nguoiviet/callback");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "read:profile read:trust");
  authUrl.searchParams.set("state", state || crypto.randomUUID());

  return json({
    ok: true,
    auth_url: authUrl.toString(),
    state: authUrl.searchParams.get("state")
  });
};

export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json();
    const { code, redirect_uri } = body;

    if (!code) {
      return json({ ok: false, error: "Missing authorization code" }, 400);
    }

    if (!env.NGUOIVIET_CLIENT_ID || !env.NGUOIVIET_CLIENT_SECRET) {
      return json({ ok: false, error: "NguoiViet integration not configured" }, 500);
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://nguoiviet.muonnoi.org/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: env.NGUOIVIET_CLIENT_ID,
        client_secret: env.NGUOIVIET_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirect_uri || "https://duongsaotoasang.com/auth/nguoiviet/callback"
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return json({ ok: false, error: "Failed to exchange token", details: errorData }, tokenResponse.status);
    }

    const tokenData = await tokenResponse.json();

    // Fetch user profile from NguoiViet
    const profileResponse = await fetch("https://nguoiviet.muonnoi.org/api/v1/profile", {
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    });

    if (!profileResponse.ok) {
      return json({ ok: false, error: "Failed to fetch profile" }, profileResponse.status);
    }

    const profileData = await profileResponse.json();

    // Sync trust score if available
    if (profileData.trust_score && env.DB) {
      const updateStmt = env.DB.prepare(`
        UPDATE users
        SET trust_score = GREATEST(trust_score, ?)
        WHERE email = ?
      `).bind(profileData.trust_score, profileData.email);

      await updateStmt.run();
    }

    return json({
      ok: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      user: {
        id: profileData.id,
        email: profileData.email,
        display_name: profileData.display_name,
        trust_score: profileData.trust_score
      }
    });
  } catch (error) {
    console.error("NguoiViet auth error:", error);
    return json({ ok: false, error: "Failed to authenticate with NguoiViet" }, 500);
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
