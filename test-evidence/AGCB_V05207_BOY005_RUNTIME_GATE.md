# AG Cute Blocks V0.5.207 — Boy005 game-runtime bridge gate

Status: PREPARED / TEST ONLY / PROD HOLD

This increment connects the already deployed V0.5.206 Apps Script READ_ASSET response to the existing V0.5.205 native 18-bone character adapter.

Safety:
- Only assetKey=boy005 is sent.
- No Drive fileId is accepted or sent by the browser loader.
- Response must identify TEST + boy005 + base64.
- Byte length and SHA-256 are verified before GLTFLoader receives the Blob URL.
- Endpoint/token are runtime TEST configuration and are NOT committed to GitHub.
- Existing character runtime is not replaced yet. This is fail-closed preparation; visual switch happens only after runtime PASS.
- PROD remains disabled.

PASS sequence:
1. Configure the existing TEST Web App endpoint and TEST bridge token at runtime.
2. fetchBoy005() returns bytes whose size and SHA-256 match V0.5.206.
3. createBoy005() passes V0.5.205 adapter checks: exactly 18 required bones and Idle/Walk/Run/Jump.
4. Capture TEST Idle/Walk/Run/Jump visuals.
5. Only then attach Boy005 to the playable boy route with fallback preserved.
