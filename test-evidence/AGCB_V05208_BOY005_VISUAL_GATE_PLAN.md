# AG Cute Blocks Boy005 visual gate — V0.5.208

Status: TEST / PROD HOLD
Netlify: FORBIDDEN

Already PASS:
- Drive binary integrity
- native 18-bone identity
- Idle / Walk / Run / Jump clip presence
- animation sampler/channel finite-data integrity
- normalized rotation quaternion integrity

Visual gate still required before playable-route promotion:
1. Idle: upright, no collapsed mesh, hands/feet plausible.
2. Walk: alternating legs and arm swing; no skating caused by broken clip.
3. Run: faster cycle than Walk; no inverted limbs.
4. Jump: bilateral leg/arm motion renders without deformation failure.
5. Grounding: fitted character feet remain on/near ground after adapter normalization.
6. Transitions: Idle -> Walk -> Run -> Jump -> Idle do not leave a stuck pose.

Execution rule:
- Use a zero-Netlify isolated renderer/harness.
- Do not expose AGCB_BRIDGE_TOKEN to browser, GitHub, logs, or artifacts.
- Prefer the directly obtained TEST fixture bytes or a non-secret test artifact path.
- Do not attach Boy005 to the playable route until this gate has real rendered evidence.
- Do not touch PROD.
