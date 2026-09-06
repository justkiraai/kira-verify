/** Executable baseline contract for the documentation audit. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createCodeWindow, isCodeWindowActive, DEFAULT_CODE_TTL_SECONDS } from './index.js';

test('v1.1 defaults to 600 seconds and uses Unix milliseconds', () => {
  assert.equal(DEFAULT_CODE_TTL_SECONDS, 600);
  assert.deepEqual(createCodeWindow({ issuedAt: 1000 }),
    { issuedAt: 1000, expiresAt: 601000, ttlSeconds: 600 });
});

test('validity begins at issuance and ends at the exact expiry boundary', () => {
  const window = createCodeWindow({ issuedAt: 1000 });
  assert.equal(isCodeWindowActive(window, 999), false);
  assert.equal(isCodeWindowActive(window, 1000), true);
  assert.equal(isCodeWindowActive(window, 600999), true);
  assert.equal(isCodeWindowActive(window, 601000), false);
  assert.equal(isCodeWindowActive(window, 601001), false);
});

test('allows an explicit TTL and rejects invalid values', () => {
  assert.equal(createCodeWindow({ issuedAt: 0, ttlSeconds: 60 }).expiresAt, 60000);
  for (const ttlSeconds of [0, -1, 1.5, 3601, NaN]) {
    assert.throws(() => createCodeWindow({ ttlSeconds }), RangeError);
  }
  assert.throws(() => createCodeWindow({ issuedAt: Number.MAX_SAFE_INTEGER }), RangeError);
  assert.equal(isCodeWindowActive(null, 1000), false);
  assert.equal(isCodeWindowActive({ issuedAt: 0, expiresAt: Infinity }, 1000), false);
});
