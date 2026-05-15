#!/usr/bin/env node
/**
 * scripts/donate-webhook-behavior-qa.mjs
 *
 * BEHAVIOR test (not string-check) for the donation webhook handler.
 * Invariants validated:
 *   T1. HMAC configured + signature header missing       → 401 SIGNATURE_REQUIRED
 *   T2. HMAC configured + signature header wrong         → 401 SIGNATURE_INVALID
 *   T3. HMAC configured + valid signature + unknown id   → 200 ignored, NO dispatch row
 *   T4. HMAC configured + valid signature + valid row +
 *        no mail provider configured                     → dispatch row status="skipped_no_provider"
 *        (i.e. NEVER falsely "sent")
 *   T5. Same as T4 but with stubbed mail provider success → dispatch row status="sent"
 *
 * Requires Node 19+ for global crypto.subtle + Request/Response.
 */

import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, "..");

const failures = [];
const expect = (cond, label) => {
  if (cond) {
    console.log(`  [ok] ${label}`);
  } else {
    failures.push(label);
    console.log(`  [fail] ${label}`);
  }
};

if (!globalThis.crypto || !globalThis.crypto.subtle) {
  console.error("DONATE_WEBHOOK_BEHAVIOR_QA_FAIL");
  console.error("- Node runtime missing global crypto.subtle. Need Node 19+.");
  process.exit(2);
}

// ── Mock DB ──────────────────────────────────────────────────────────────────
function makeDb({ donations = [] } = {}) {
  const calls = { dispatches: [], webhookLogs: [], donationUpdates: [] };

  function prepare(sql) {
    const params = [];
    return {
      bind(...args) { params.push(...args); return this; },
      async first() {
        const q = sql.replace(/\s+/g, " ").trim().toLowerCase();
        if (q.startsWith("select id from donation_webhook_log")) {
          const [eventId] = params;
          return calls.webhookLogs.find((l) => l.event_id === eventId) || null;
        }
        if (q.startsWith("select id, donor_email, donor_name, amount_vnd, status from donations")) {
          const [id] = params;
          return donations.find((d) => d.id === id) || null;
        }
        return null;
      },
      async run() {
        const q = sql.replace(/\s+/g, " ").trim().toLowerCase();
        if (q.startsWith("insert or ignore into donation_webhook_log")) {
          const [id, event_id, event_type, donation_id, payload, processed] = params;
          calls.webhookLogs.push({ id, event_id, event_type, donation_id, payload, processed });
        } else if (q.startsWith("insert or ignore into donation_email_dispatches")) {
          const [id, donation_id, event_id, recipient_email, provider, provider_message_id, status, response_json] = params;
          calls.dispatches.push({ id, donation_id, event_id, recipient_email, provider, provider_message_id, status, response_json });
        } else if (q.startsWith("update donations")) {
          calls.donationUpdates.push({ sql: q, params: [...params] });
        } else if (q.startsWith("update donation_webhook_log")) {
          const eventId = params[params.length - 1];
          const row = calls.webhookLogs.find((l) => l.event_id === eventId);
          if (row) row.processed = 1;
        }
        return { success: true };
      },
      async all() { return { results: [] }; },
    };
  }
  return { prepare, _calls: calls };
}

async function makeSignedRequest(body, hmacSecret) {
  const enc = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw", enc.encode(hmacSecret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBuf = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(body));
  const sigHex = Array.from(new Uint8Array(sigBuf), (b) => b.toString(16).padStart(2, "0")).join("");
  return new Request("https://example.com/api/donate/webhook", {
    method: "POST",
    headers: { "content-type": "application/json", "x-iai-signature": sigHex },
    body,
  });
}

// ── Import handler ──────────────────────────────────────────────────────────
const webhookUrl = pathToFileURL(join(repoRoot, "functions", "api", "donate", "webhook.js")).href;
const { onRequestPost } = await import(webhookUrl);

const HMAC = "test-hmac-secret-32bytes-padding-padding";

// T1 — unsigned (no header) with HMAC configured → 401
{
  console.log("T1 — unsigned request, HMAC configured");
  const DB = makeDb();
  const request = new Request("https://example.com/api/donate/webhook", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event_type: "payment.completed", order_id: "don_x" }),
  });
  const resp = await onRequestPost({ request, env: { DB, PAY_DSTS_HMAC: HMAC } });
  const data = await resp.json();
  expect(resp.status === 401, "T1: returns 401");
  expect(data.error === "SIGNATURE_REQUIRED", "T1: error=SIGNATURE_REQUIRED");
  expect(DB._calls.webhookLogs.length === 0, "T1: no webhook log row written");
  expect(DB._calls.dispatches.length === 0, "T1: no dispatch row written");
}

// T2 — bad signature → 401
{
  console.log("T2 — bad signature, HMAC configured");
  const DB = makeDb();
  const request = new Request("https://example.com/api/donate/webhook", {
    method: "POST",
    headers: { "content-type": "application/json", "x-iai-signature": "deadbeef" },
    body: JSON.stringify({ event_type: "payment.completed", order_id: "don_x" }),
  });
  const resp = await onRequestPost({ request, env: { DB, PAY_DSTS_HMAC: HMAC } });
  const data = await resp.json();
  expect(resp.status === 401, "T2: returns 401");
  expect(data.error === "SIGNATURE_INVALID", "T2: error=SIGNATURE_INVALID");
  expect(DB._calls.dispatches.length === 0, "T2: no dispatch row written");
}

// T3 — valid signature, unknown donation → 200 ignored, NO dispatch row
{
  console.log("T3 — valid sig, unknown donation_id");
  const DB = makeDb({ donations: [] });
  const body = JSON.stringify({
    event_type: "payment.completed",
    event_id: "evt_t3",
    order_id: "don_missing",
  });
  const request = await makeSignedRequest(body, HMAC);
  const resp = await onRequestPost({ request, env: { DB, PAY_DSTS_HMAC: HMAC } });
  const data = await resp.json();
  expect(resp.status === 200, "T3: returns 200");
  expect(data.ignored === "unknown_donation_id", "T3: ignored=unknown_donation_id");
  expect(DB._calls.dispatches.length === 0, "T3: NO dispatch row for unknown donation");
  expect(DB._calls.donationUpdates.length === 0, "T3: NO donation status mutation");
}

// T4 — valid sig + real donation + NO mail provider → dispatch row "skipped_no_provider"
{
  console.log("T4 — valid sig + real donation, no mail provider");
  const DB = makeDb({
    donations: [{
      id: "don_real",
      donor_email: "donor@example.com",
      donor_name: "Donor",
      amount_vnd: 50000,
      status: "pending",
    }],
  });
  const body = JSON.stringify({
    event_type: "payment.completed",
    event_id: "evt_t4",
    order_id: "don_real",
  });
  const request = await makeSignedRequest(body, HMAC);
  const resp = await onRequestPost({ request, env: { DB, PAY_DSTS_HMAC: HMAC } });
  expect(resp.status === 200, "T4: returns 200");
  expect(DB._calls.dispatches.length === 1, "T4: exactly 1 dispatch row");
  const row = DB._calls.dispatches[0];
  expect(row?.status === "skipped_no_provider", `T4: dispatch.status=skipped_no_provider (got '${row?.status}')`);
  expect(row?.provider_message_id === null, "T4: provider_message_id=null (never falsely sent)");
}

// T5 — valid sig + real donation + stubbed mail success → dispatch "sent"
{
  console.log("T5 — valid sig + real donation + stubbed provider success");
  const DB = makeDb({
    donations: [{
      id: "don_real_2",
      donor_email: "donor2@example.com",
      donor_name: "Donor2",
      amount_vnd: 75000,
      status: "pending",
    }],
  });

  // Stub global fetch so the mail.iai.one POST returns a success body
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (typeof url === "string" && url.includes("mail.iai.one")) {
      return new Response(JSON.stringify({ message_id: "msg_abc123" }), {
        status: 200, headers: { "content-type": "application/json" },
      });
    }
    return origFetch(url, init);
  };

  try {
    const body = JSON.stringify({
      event_type: "payment.completed",
      event_id: "evt_t5",
      order_id: "don_real_2",
    });
    const request = await makeSignedRequest(body, HMAC);
    const resp = await onRequestPost({
      request,
      env: { DB, PAY_DSTS_HMAC: HMAC, MAIL_API_KEY: "stub-key", MAIL_API_WORKSPACE_ID: "ws-stub" },
    });
    expect(resp.status === 200, "T5: returns 200");
    expect(DB._calls.dispatches.length === 1, "T5: exactly 1 dispatch row");
    const row = DB._calls.dispatches[0];
    expect(row?.status === "sent", `T5: dispatch.status=sent (got '${row?.status}')`);
    expect(row?.provider_message_id === "msg_abc123", `T5: provider_message_id=msg_abc123 (got '${row?.provider_message_id}')`);
    expect(row?.provider === "mail_iai_one", "T5: provider=mail_iai_one");
  } finally {
    globalThis.fetch = origFetch;
  }
}

// T6 — replay: same event_id second time → ok+replayed, no extra dispatch
{
  console.log("T6 — replay protection");
  const DB = makeDb({
    donations: [{
      id: "don_real_3",
      donor_email: "donor3@example.com",
      donor_name: "Donor3",
      amount_vnd: 30000,
      status: "pending",
    }],
  });
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (typeof url === "string" && url.includes("mail.iai.one")) {
      return new Response(JSON.stringify({ message_id: "msg_replay" }), { status: 200 });
    }
    return origFetch(url);
  };
  try {
    const body = JSON.stringify({
      event_type: "payment.completed",
      event_id: "evt_t6",
      order_id: "don_real_3",
    });
    const env = { DB, PAY_DSTS_HMAC: HMAC, MAIL_API_KEY: "stub", MAIL_API_WORKSPACE_ID: "ws" };
    const r1 = await onRequestPost({ request: await makeSignedRequest(body, HMAC), env });
    expect(r1.status === 200, "T6: first call 200");
    const r2 = await onRequestPost({ request: await makeSignedRequest(body, HMAC), env });
    const d2 = await r2.json();
    expect(d2.replayed === true, "T6: second call replayed=true");
    expect(DB._calls.dispatches.length === 1, "T6: dispatches still =1 after replay");
  } finally {
    globalThis.fetch = origFetch;
  }
}

if (failures.length) {
  console.error("\nDONATE_WEBHOOK_BEHAVIOR_QA_FAIL");
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log("\nDONATE_WEBHOOK_BEHAVIOR_QA_PASS tests=6 assertions=18");
