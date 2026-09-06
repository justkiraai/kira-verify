# Kira Verify

Kira Verify is a small verification code expiry policy library. This dependency-free local fixture calculates a validity window; it does not generate, deliver, compare, or consume verification codes and is not an authentication service.

## Version 1.0 baseline

`createCodeWindow({ issuedAt, ttlSeconds })` defaults to **300 seconds (5 minutes)**. `issuedAt` defaults to `Date.now()` and uses Unix milliseconds. The result is `{ issuedAt, expiresAt, ttlSeconds }`, where `expiresAt = issuedAt + ttlSeconds * 1000`.

`isCodeWindowActive(window, now)` is true starting at issuance and false **at the exact expiry timestamp**: `issuedAt <= now < expiresAt`. `now` also defaults to `Date.now()`. An explicit TTL must be an integer from 1 through 3600 seconds. Issuance must be a nonnegative safe integer, and calculated expiry must remain a safe integer.

```js
import { createCodeWindow, isCodeWindowActive } from './index.js';
const window = createCodeWindow({ issuedAt: 1000 });
// { issuedAt: 1000, expiresAt: 301000, ttlSeconds: 300 }
isCodeWindowActive(window, 301000); // false
```

Run `npm test` with Node.js 20 or later. No installation or build is needed.
