/**
 * Google OAuth Config — expose client_id to frontend safely.
 * GET /api/auth/google-config
 * Returns: { client_id: string | null }
 */

export async function onRequestGet({ env }) {
  return new Response(JSON.stringify({
    ok: true,
    client_id: env.GOOGLE_CLIENT_ID || null,
  }), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "https://duongsaotoasang.com" },
  });
}
