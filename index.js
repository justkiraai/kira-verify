/** Verification expiry policy only; this fixture never creates or validates secret codes. */
export const DEFAULT_CODE_TTL_SECONDS = 600;

/** Return expiry metadata in Unix milliseconds for a verification code. */
export function createCodeWindow({ issuedAt = Date.now(), ttlSeconds = DEFAULT_CODE_TTL_SECONDS } = {}) {
  if (!Number.isSafeInteger(issuedAt) || issuedAt < 0) {
    throw new RangeError('issuedAt must be a nonnegative safe integer in milliseconds');
  }
  if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 3600) {
    throw new RangeError('ttlSeconds must be an integer from 1 to 3600');
  }
  const expiresAt = issuedAt + ttlSeconds * 1000;
  if (!Number.isSafeInteger(expiresAt)) throw new RangeError('expiresAt exceeds the safe integer range');
  return { issuedAt, expiresAt, ttlSeconds };
}

/** Check the half-open validity interval; expiry at the exact boundary is intentional. */
export function isCodeWindowActive(window, now = Date.now()) {
  return Number.isSafeInteger(now)
    && Number.isSafeInteger(window?.issuedAt)
    && Number.isSafeInteger(window?.expiresAt)
    && window.issuedAt >= 0
    && window.expiresAt > window.issuedAt
    && now >= window.issuedAt
    && now < window.expiresAt;
}
