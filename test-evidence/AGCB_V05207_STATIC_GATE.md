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


## Direct Drive binary inspection — PASS (2026-09-24)

Source: AG專用 / TEST_ONLY_AG_Boy_Hoodie_Study_005_RuntimeFixture.glb
Drive file ID: 1PumNgfL_cr12kG9wIBwu_XKUaOgAIpt9

Observed directly from the GLB container:
- GLB magic: glTF
- GLB version: 2
- byte size: 2,296,868
- SHA-256: 4e9cea628c95a6d50544a2cd70407ac67c5725b7578102cae4dbb3888fdae5fb
- animation clips: Idle, Walk, Run, Jump, JointInspection
- required AGCB nodes: all 18 present
- every declared skin inspected has exactly 18 joints

Required native nodes:
agcb-root, agcb-hips, agcb-spine, agcb-chest, agcb-neck, agcb-head,
agcb-upper-arm-l, agcb-forearm-l, agcb-hand-l,
agcb-upper-arm-r, agcb-forearm-r, agcb-hand-r,
agcb-thigh-l, agcb-shin-l, agcb-foot-l,
agcb-thigh-r, agcb-shin-r, agcb-foot-r.

Gate result:
- BINARY_STRUCTURE_GATE = PASS
- REQUIRED_ACTION_NAMES_GATE = PASS
- 18_BONE_IDENTITY_GATE = PASS
- VISUAL_ANIMATION_GATE = PENDING
- PLAYABLE_ROUTE_PROMOTION = HOLD
- PROD_PROMOTION = HOLD

This is a direct structural inspection of the Drive GLB, not a visual/rendering claim.
Netlify was not used.
