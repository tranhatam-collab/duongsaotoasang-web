#!/usr/bin/env node
/**
 * Fix duongsaotoasang.com DNS — CNAME → Pages project
 * Zone: duongsaotoasang.com, Zone ID: 551f3742f1ab3f8babd106ffa1abde8c (62d account)
 * Pages project: duongsaotoasang-com-v2 (subdomain: duongsaotoasang-com-v2.pages.dev)
 *
 * Usage (dry run):  node fix-duongsaotoasang-dns.mjs
 * Usage (apply):    CLOUDFLARE_API_TOKEN=<token> node fix-duongsaotoasang-dns.mjs --apply
 *
 * Get token (Zone:DNS:Edit, 62d account):
 *   https://dash.cloudflare.com/62d57eaa548617aeecac766e5a1cb98e/profile/api-tokens
 */
const ZONE_ID = "551f3742f1ab3f8babd106ffa1abde8c";
const PAGES_SUBDOMAIN = "duongsaotoasang-com-v2.pages.dev";
const APPLY = process.argv.includes("--apply");
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!TOKEN) {
  console.log("DRY RUN — set CLOUDFLARE_API_TOKEN to apply.");
  console.log("");
  console.log("Records to create/update:");
  console.log("  CNAME  @    duongsaotoasang-com-v2.pages.dev  proxied=true");
  console.log("  CNAME  www  duongsaotoasang-com-v2.pages.dev  proxied=true");
  process.exit(0);
}

async function cf(path, opts = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method: opts.method || "GET",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!data.success) throw new Error(JSON.stringify(data.errors));
  return data.result;
}

async function upsertCname(name, proxied = true) {
  const existing = await cf(`/zones/${ZONE_ID}/dns_records?name=${name}&type=CNAME`);
  const aRecords = await cf(`/zones/${ZONE_ID}/dns_records?name=${name}&type=A`);

  for (const rec of aRecords) {
    console.log(`DELETE A ${name} → ${rec.content}`);
    if (APPLY) await cf(`/zones/${ZONE_ID}/dns_records/${rec.id}`, { method: "DELETE" });
  }

  if (existing.length > 0) {
    const rec = existing[0];
    if (rec.content === PAGES_SUBDOMAIN && rec.proxied === proxied) {
      console.log(`SKIP (already correct) CNAME ${name} → ${PAGES_SUBDOMAIN}`);
      return;
    }
    console.log(`UPDATE CNAME ${name} → ${PAGES_SUBDOMAIN}`);
    if (APPLY) await cf(`/zones/${ZONE_ID}/dns_records/${rec.id}`, {
      method: "PUT",
      body: { type: "CNAME", name, content: PAGES_SUBDOMAIN, proxied },
    });
  } else {
    console.log(`CREATE CNAME ${name} → ${PAGES_SUBDOMAIN}`);
    if (APPLY) await cf(`/zones/${ZONE_ID}/dns_records`, {
      method: "POST",
      body: { type: "CNAME", name, content: PAGES_SUBDOMAIN, proxied },
    });
  }
}

async function main() {
  console.log(APPLY ? "==> APPLYING changes" : "==> DRY RUN");
  await upsertCname("duongsaotoasang.com");
  await upsertCname("www.duongsaotoasang.com");
  console.log(APPLY ? "\n✓ Done. Verify: curl -I https://duongsaotoasang.com" : "\n(dry run — pass --apply to execute)");
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });
