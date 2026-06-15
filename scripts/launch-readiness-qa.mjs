#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL("..", import.meta.url)));
const failures = [];
const warnings = [];

function read(path) {
  const fullPath = join(repoRoot, path);
  if (!existsSync(fullPath)) {
    failures.push(`${path}: missing`);
    return "";
  }
  return readFileSync(fullPath, "utf8");
}

function requireMatch(path, pattern, message) {
  const text = read(path);
  if (!pattern.test(text)) failures.push(`${path}: ${message}`);
}

function forbidMatch(path, pattern, message) {
  const text = read(path);
  if (pattern.test(text)) failures.push(`${path}: ${message}`);
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

const enPages = [
  "en/index.html",
  "en/about.html",
  "en/contact.html",
  "en/donate.html",
  "en/map.html",
  "en/legacy.html",
  "en/register.html",
  "en/sponsor.html",
  "en/trust.html",
  "en/verify.html",
];

const app = read("assets/app-v5.js");
if (!/pathname/.test(app) || !/\/en(?:\/|\\b)/.test(app)) {
  failures.push("assets/app-v5.js: getLang/route logic does not recognize /en/ paths");
}
if (/searchParams\.set\(["']lang["'],\s*["']en["']\)/.test(app)) {
  failures.push("assets/app-v5.js: query-string language routing is still active");
}

const redirects = read("_redirects");
if (!/^\/map\s+\/map\.html\s+200$/m.test(redirects)) {
  failures.push("_redirects: /map must rewrite to /map.html with status 200");
}
if (!/^\/legacy\s+\/legacy\/index\.html\s+200$/m.test(redirects)) {
  failures.push("_redirects: /legacy must rewrite to /legacy/index.html with status 200");
}

const verifyPage = read("verify/index.html");
if (countMatches(verifyPage, /rel=["']alternate["'][^>]*hreflang=["']en["']/g) !== 1) {
  failures.push("verify/index.html: must contain exactly one EN hreflang");
}

for (const path of enPages) {
  const text = read(path);
  if (!/id=["']siteHeader["']/.test(text)) failures.push(`${path}: missing shared header host`);
  if (!/src=["']\/assets\/app-v5\.js["']/.test(text)) failures.push(`${path}: missing app-v5.js`);
  if (!/href=["']\/(?!en(?:\/|["']))[^"']*["'][^>]*lang=["']vi["']|lang=["']vi["'][^>]*href=["']\//.test(text)) {
    failures.push(`${path}: missing static Vietnamese fallback link`);
  }
  for (const meta of ["og:title", "og:description", "og:url", "og:image", "twitter:card"]) {
    if (!text.includes(meta)) failures.push(`${path}: missing ${meta}`);
  }
  if (!/hreflang=["']en["']/.test(text)) failures.push(`${path}: missing self EN hreflang`);
  if (!/hreflang=["']vi["']/.test(text)) failures.push(`${path}: missing VI hreflang`);
  if (!/hreflang=["']x-default["']/.test(text)) failures.push(`${path}: missing x-default hreflang`);
}

for (const path of ["index.html", ...enPages]) {
  forbidMatch(path, /G-XXXXXXXXXX|xxxxxxxxxxxxx@o123456/, "public analytics/monitoring placeholder remains");
}

const registerApi = read("functions/api/auth/register.js");
if (!/crypto\.subtle|PBKDF2/i.test(registerApi)) {
  failures.push("functions/api/auth/register.js: password hashing is not implemented");
}
if (/bind\(\s*email\s*,\s*password\b/.test(registerApi)) {
  failures.push("functions/api/auth/register.js: raw password is still written to D1");
}
if (/\{\s*email\s*,\s*password\s*,\s*display_name\s*,\s*role\s*\}/.test(registerApi)) {
  failures.push("functions/api/auth/register.js: public client can still submit privileged role");
}

const loginApi = read("functions/api/auth/login.js");
if (/password_hash\s*=\s*\?/.test(loginApi)) {
  failures.push("functions/api/auth/login.js: raw password comparison remains");
}
if (/dsts_session=\$\{row\.id\}/.test(loginApi)) {
  failures.push("functions/api/auth/login.js: cookie still exposes user ID as session token");
}

const authLib = read("functions/_lib/auth.js");
if (authLib && !/PBKDF2/i.test(authLib)) failures.push("functions/_lib/auth.js: PBKDF2 helper missing");
if (authLib && !/timing|constant/i.test(authLib)) warnings.push("functions/_lib/auth.js: confirm constant-time hash comparison");

const migrations = [
  "migrations/0022_auth_sessions.sql",
];
for (const path of migrations) {
  const text = read(path);
  if (text && !/CREATE TABLE IF NOT EXISTS sessions/i.test(text)) failures.push(`${path}: sessions table missing`);
  if (text && !/token_hash/i.test(text)) failures.push(`${path}: hashed session token column missing`);
}

const registerPage = read("register/index.html");
if (!/fetch\(\s*["']\/api\/auth\/register["']/.test(registerPage)) {
  failures.push("register/index.html: registration UI is not connected to /api/auth/register");
}
if (/<select[^>]+(?:id|name)=["']role["']/i.test(registerPage)) {
  failures.push("register/index.html: public role escalation selector remains");
}

if (!existsSync(join(repoRoot, "login/index.html"))) failures.push("login/index.html: missing");
if (!existsSync(join(repoRoot, "en/login.html"))) failures.push("en/login.html: missing");

const appShell = read("app/app.js");
if (/localStorage\.getItem\(["']dsts_session["']\)|localStorage\.setItem\(["']dsts_session["']\)/.test(appShell)) {
  failures.push("app/app.js: fake localStorage authentication remains");
}

const webhookFiles = [
  "functions/webhooks/payment.js",
  "functions/api/points/webhook.js",
  "functions/api/clubs/subscription/webhook.js",
  "functions/api/donate/webhook.js",
];

for (const path of webhookFiles) {
  const text = read(path);
  if (!/SIGNATURE_REQUIRED/.test(text) || !/SIGNATURE_INVALID/.test(text)) {
    failures.push(`${path}: missing explicit fail-closed signature responses`);
  }
  if (/if\s*\(\s*hmacSecret\s*\)\s*\{/.test(text)) {
    failures.push(`${path}: HMAC verification is optional and fails open when secret is absent`);
  }
}

const paymentWebhook = read("functions/webhooks/payment.js");
if (!/event_id|eventId/.test(paymentWebhook)) failures.push("functions/webhooks/payment.js: no event replay key");
if (!/unknown/i.test(paymentWebhook)) failures.push("functions/webhooks/payment.js: no unknown-payment guard");

const paymentIntent = read("functions/api/payment/create-intent.js");
if (!/\/internal\/checkout-session/.test(paymentIntent)) {
  failures.push("functions/api/payment/create-intent.js: canonical pay.iai.one endpoint missing");
}

const wrangler = read("wrangler.toml");
if (!/\[\[d1_databases\]\]/.test(wrangler) || !/binding\s*=\s*["']DB["']/.test(wrangler)) {
  failures.push("wrangler.toml: production DB binding is not configured");
}

if (warnings.length) {
  console.log("DSTS_LAUNCH_READINESS_WARNINGS");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length) {
  console.error("DSTS_LAUNCH_READINESS_FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`DSTS_LAUNCH_READINESS_PASS en_pages=${enPages.length} webhooks=${webhookFiles.length}`);
