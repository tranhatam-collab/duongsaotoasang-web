/**
 * TOTP (Time-based One-Time Password) implementation for Cloudflare Workers.
 * Compatible with Google Authenticator, Authy, Microsoft Authenticator.
 * RFC 6238 / RFC 4226 compliant.
 */

const DEFAULT_STEP = 30;
const DEFAULT_DIGITS = 6;

/**
 * Base32 decode (RFC 4648).
 */
function base32Decode(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = base32.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const c of cleaned) {
    bits += alphabet.indexOf(c).toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, (i + 1) * 8), 2);
  }
  return bytes;
}

/**
 * Base32 encode.
 */
function base32Encode(bytes) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const b of bytes) {
    bits += b.toString(2).padStart(8, "0");
  }
  let result = "";
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    result += alphabet[parseInt(bits.slice(i, i + 5), 2)];
  }
  return result;
}

/**
 * Generate a random TOTP secret (20 bytes = 160 bits → 32 base32 chars).
 */
export function generateTotpSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return base32Encode(bytes);
}

/**
 * Generate TOTP URI for QR code.
 */
export function buildTotpUri({ secret, label, issuer = "DSTS" }) {
  const encodedLabel = encodeURIComponent(label);
  const encodedIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Compute HOTP value for a given counter.
 */
async function hotp(secret, counter) {
  const key = base32Decode(secret);
  const encoder = new TextEncoder();
  // Counter as 8-byte big-endian
  const counterBuf = new ArrayBuffer(8);
  const view = new DataView(counterBuf);
  view.setUint32(0, 0, false); // high 32 bits = 0
  view.setUint32(4, counter, false); // low 32 bits

  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new Uint8Array(counterBuf));
  const hash = new Uint8Array(sig);

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const binCode =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const otp = binCode % 10 ** DEFAULT_DIGITS;
  return String(otp).padStart(DEFAULT_DIGITS, "0");
}

/**
 * Verify a TOTP code. Checks current window and ±1 window for clock skew.
 */
export async function verifyTotp(secret, code, window = 1) {
  if (!secret || !code || code.length !== DEFAULT_DIGITS) return false;
  const counter = Math.floor(Date.now() / 1000 / DEFAULT_STEP);
  for (let i = -window; i <= window; i++) {
    const expected = await hotp(secret, counter + i);
    if (expected === code) return true;
  }
  return false;
}

/**
 * Generate 10 backup codes (8-char hex, hashed for storage).
 */
export async function generateBackupCodes() {
  const codes = [];
  const hashes = [];
  for (let i = 0; i < 10; i++) {
    const bytes = crypto.getRandomValues(new Uint8Array(4));
    const code = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
    codes.push(code);
    const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
    hashes.push(Array.from(new Uint8Array(hashBuf), b => b.toString(16).padStart(2, "0")).join(""));
  }
  return { codes, hashes };
}

/**
 * Verify a backup code against stored hashes.
 */
export async function verifyBackupCode(code, storedHashesJson) {
  if (!code || !storedHashesJson) return false;
  const hashes = JSON.parse(storedHashesJson);
  const inputHash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code))),
    b => b.toString(16).padStart(2, "0")
  ).join("");
  return hashes.includes(inputHash);
}
