export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    // input: { email, amount, currency, plan, item_type, item_slug }
    const email = (body.email || "").trim() || null;
    const currency = (body.currency || "USD").toUpperCase();
    const plan = body.plan || "one_time"; // one_time | monthly | yearly | two_year
    const item_type = body.item_type || "donate";
    const item_slug = body.item_slug || null;

    let amount = Number(body.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return json({ error: "Invalid amount" }, 400);
    }

    // Stripe uses integer cents for most currencies
    const unit_amount = Math.round(amount * 100);

    // Pricing model for phase 1 (donate):
    // - one_time: payment mode
    // - monthly/yearly/two_year: subscription mode
    const isSub = ["monthly", "yearly", "two_year"].includes(plan);

    // Build success/cancel URLs (use current domain)
    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;
    const success_url = `${origin}/donate?success=1`;
    const cancel_url = `${origin}/donate?canceled=1`;

    // Create checkout session
    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        "mode": isSub ? "subscription" : "payment",
        "success_url": success_url,
        "cancel_url": cancel_url,
        ...(email ? { "customer_email": email } : {}),

        // Line item
        "line_items[0][price_data][currency]": currency.toLowerCase(),
        "line_items[0][price_data][product_data][name]": `Duong Sao Toa Sang — ${item_type}`,
        "line_items[0][price_data][unit_amount]": String(unit_amount),
        "line_items[0][quantity]": "1",

        ...(isSub ? {
          "line_items[0][price_data][recurring][interval]": (plan === "monthly" ? "month" : "year"),
          ...(plan === "two_year" ? { "line_items[0][price_data][recurring][interval_count]": "2" } : {})
        } : {}),

        // metadata
        "metadata[item_type]": item_type,
        ...(item_slug ? { "metadata[item_slug]": item_slug } : {}),
        "metadata[plan]": plan
      }).toString()
    });

    const stripeText = await stripeRes.text();
    if (!stripeRes.ok) {
      return json({ error: "Stripe error", detail: stripeText }, 400);
    }
    const session = JSON.parse(stripeText);

    // Create pending payment record in Supabase (optional but helpful)
    await supabaseInsertPayment(env, {
      user_email: email,
      type: item_type,
      amount_expected: amount,
      currency,
      payment_method: "stripe",
      status: "pending",
      provider: "stripe",
      provider_session_id: session.id,
      item_type,
      item_slug,
      plan,
      meta: { source: "checkout", session_id: session.id }
    });

    return json({ url: session.url, session_id: session.id }, 200);
  } catch (e) {
    return json({ error: "Server error", detail: String(e?.message || e) }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

async function supabaseInsertPayment(env, payload) {
  // Supabase REST insert with service role key
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/payments`, {
    method: "POST",
    headers: {
      "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
      "authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      "prefer": "return=minimal"
    },
    body: JSON.stringify(payload)
  });
  // ignore insert failure to not block checkout
  return res.ok;
}
