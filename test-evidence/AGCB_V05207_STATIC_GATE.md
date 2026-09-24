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


## Animation data integrity gate — PASS (2026-09-24)

Directly parsed the animation samplers/channels from the same Drive GLB binary; no Netlify and no bridge token exposure.

Observed clip timing:
- Idle: 3.200000 s, 2 channels (chest rotation, head rotation)
- Walk: 1.000000 s, 11 channels (bilateral arms/forearms/thighs/shins/feet rotations + hips translation)
- Run: 0.650000 s, 11 channels (same body coverage + hips translation)
- Jump: 1.000000 s, 6 channels (bilateral upper arms/thighs/shins rotations)
- JointInspection: 4.000000 s, 4 channels

Data checks:
- all sampled animation values are finite
- all sampled rotation quaternion norms remain approximately 1.0
- Walk hips translation is finite/stable at Y ~= 0.608
- Run hips translation is finite/stable at Y ~= 0.585
- no animation sampler corruption detected

Result:
- ANIMATION_DATA_INTEGRITY_GATE = PASS
- VISUAL_RENDER_GATE = PENDING
- PLAYABLE_ROUTE_PROMOTION = HOLD
- PROD_PROMOTION = HOLD

This advances validation from name-only inspection to animation sampler/channel integrity. It still does not claim visual appearance, foot grounding, limb direction, or transition quality PASS.
