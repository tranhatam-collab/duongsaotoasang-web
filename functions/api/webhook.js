export async function onRequestPost(context) {
  const { request, env } = context;

  // Stripe webhook needs raw body, not JSON-parsed
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  // Verify signature using Stripe's /v1/webhook_endpoints? No.
  // We'll use Stripe's "construct event" equivalent by calling Stripe API to validate:
  // Stripe does NOT offer a simple verify endpoint. So we implement minimal HMAC verification is complex.
  // Practical MVP: accept webhook only if it comes with correct secret via basic approach:
  // -> Use Stripe CLI / endpoint secret and a small HMAC lib. But CF Functions has no built-in.
  // Best practice: use Stripe's official libs (not available here as Node package).
  //
  // MVP safe-enough approach for phase 1:
  // - Deploy webhook secret and verify using WebCrypto HMAC manually.

  const ok = await verifyStripeSignature(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
  if (!ok) return new Response("Bad signature", { status: 400 });

  const event = JSON.parse(rawBody);

  try {
    // Handle main events
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      await upsertPayment(env, {
        provider_session_id: s.id,
        provider_payment_id: s.payment_intent || s.subscription || null,
        status: "success",
        verified: true,
        amount_received: (s.amount_total ? s.amount_total / 100 : null),
        currency: (s.currency || "USD").toUpperCase(),
        user_email: s.customer_details?.email || null,
        meta: { webhook: event.type, raw: event }
      });
    }

    if (event.type === "checkout.session.expired") {
      const s = event.data.object;
      await upsertPayment(env, {
        provider_session_id: s.id,
        status: "failed",
        verified: true,
        meta: { webhook: event.type, raw: event }
      });
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    return new Response(`error: ${String(e?.message || e)}`, { status: 500 });
  }
}

async function upsertPayment(env, patch) {
  // Update by provider_session_id
  // 1) fetch existing row
  const q = encodeURIComponent(`provider_session_id=eq.${patch.provider_session_id}`);
  const get = await fetch(`${env.SUPABASE_URL}/rest/v1/payments?${q}&select=id`, {
    headers: {
      "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
      "authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  const rows = await get.json();
  const id = rows?.[0]?.id;

  if (id) {
    await fetch(`${env.SUPABASE_URL}/rest/v1/payments?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
        "authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(patch)
    });
  } else {
    // Insert if missing
    await fetch(`${env.SUPABASE_URL}/rest/v1/payments`, {
      method: "POST",
      headers: {
        "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
        "authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
        "prefer": "return=minimal"
      },
      body: JSON.stringify({
        payment_method: "stripe",
        provider: "stripe",
        status: patch.status || "success",
        ...patch
      })
    });
  }
}

// --- Stripe signature verification (HMAC SHA256) using WebCrypto ---
async function verifyStripeSignature(payload, sigHeader, webhookSecret) {
  // Stripe signature header looks like: "t=...,v1=...,v0=..."
  const parts = sigHeader.split(",").map(s => s.trim());
  const tPart = parts.find(p => p.startsWith("t="));
  const v1Part = parts.find(p => p.startsWith("v1="));
  if (!tPart || !v1Part) return false;

  const timestamp = tPart.split("=")[1];
  const signature = v1Part.split("=")[1];

  const signedPayload = `${timestamp}.${payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const hex = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, "0")).join("");

  // timing-safe compare
  return timingSafeEqual(hex, signature);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
