# V0.5.207 Boy005 static gate

Purpose: validate the current TEST source line without Netlify.

This gate is deliberately static and fail-closed. It proves wiring/safety only; it does not claim that the Drive Boy005 binary has passed the live 18-bone + Idle/Walk/Run/Jump runtime gate.

Expected:
- 18 required native bone names remain enforced by V0.5.205 adapter.
- Idle/Walk/Run/Jump remain required.
- Browser bridge requests TEST + assetKey boy005 only.
- SHA-256 verification remains mandatory.
- No arbitrary fileId path.
- PROD disabled.
- Current bootstrap loads V0.5.207 bridge passively and does not promote Boy005.

Netlify is not used.
