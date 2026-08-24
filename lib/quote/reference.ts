// Crockford-ish: no I, L, O, U, 0 or 1, because these get read down a phone.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * A reference somebody can read out loud without spelling it.
 * Format: SL-XXXX-XXXX. Not a database id — the id stays internal.
 */
export function generateReference(): string {
  // Web Crypto, not node:crypto. This module is imported by the success page,
  // which is a client component, and a `node:` import there is a hard build
  // failure — webpack cannot bundle a Node builtin for the browser.
  // getRandomValues is global in Node 19+ and in every browser.
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
    if (i === 3) out += "-";
  }
  return `SL-${out}`;
}

export function isReference(value: string): boolean {
  return /^SL-[2-9A-HJ-NP-TV-Z]{4}-[2-9A-HJ-NP-TV-Z]{4}$/.test(value);
}
