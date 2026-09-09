# AG Character 3 — Adult Female Head + Face Implementation Spec

Status: ACTIVE
Technical base: UAL character 3 / same 65-joint skeleton
Appearance source: user's `角色與動物正交圖細節總覽.png`
Scope: first production stage only — Head + Face. Hair is explicitly excluded from this stage.

## Goal
Replace the mannequin-like head/face appearance with the adult-female target while preserving the exact Technical Base rig, animation binding, gameplay wiring and third-person camera behavior.

## Verified UAL3 structure decision
- Runtime explicitly confirms the existing head animation target uses bone name `Head`.
- The validated UAL3 asset contract is 1 skin / 65 joints / 1 mesh at the character level.
- Because the current source is a single skinned character mesh rather than a known independent head mesh, direct runtime deletion/replacement of a standalone old-head object is NOT assumed safe.
- Exact source-GLB neck bone spelling is not hard-coded here until binary node inspection can prove it; implementation must resolve the neck parent from the actual `Head` node hierarchy rather than guess a name.

### First-version replacement route — LOCKED
Use **local old-head masking/occlusion + a new true Skinned Head bound to the same UAL3 skeleton** as the first implementation route.

This route is chosen because:
1. it preserves the already-PASS Technical Base;
2. it does not assume the old mannequin head exists as a removable independent mesh;
3. it allows the new head to be genuinely driven by the existing `Head`/neck chain rather than acting as a rigid visual overlay;
4. it can later be upgraded to direct geometry replacement if the source mesh is proven to expose a safe head-only primitive/material region.

Direct replacement is allowed later only after source-mesh inspection proves a separable head region without damaging body skinning. Until then, do not delete vertices/material groups by guesswork.

## Hard constraints
- Keep the existing UAL3 skeleton and current joint hierarchy unchanged.
- Do not create a second character rig.
- Do not modify animation clip node names or weaken the current fail-closed animation target validation.
- Do not move the `Head` or neck joint centers to chase appearance proportions.
- Head/face appearance must adapt around the existing head/neck transforms.
- Hair is not part of this stage and must not be baked into the head mesh.

## Mesh split
### A. Head shell
Type: independent SkinnedMesh bound to the same UAL3 skeleton.
Primary influences:
- `Head`: dominant influence for cranium, face, ears and jaw surface.
- actual parent neck joint resolved from `Head.parent`: limited blending only around lower skull / neck seam.

Rules:
- Keep a continuous, closed neck opening aligned to the Technical Base neck.
- Do not use a rigid floating head if neck motion causes visible seam drift.
- The head shell must stay stable in Idle / Walk / Run / Jump and head turns.

### B. Eyes
Type: separate child meshes in Head coordinate space, or geometry embedded in the head shell if that is more stable.
Rules:
- Parent/skin to the same Head space; never animate them through an independent world transform.
- Symmetry is allowed as a starting point, but front / 45-degree / side review controls final placement.
- Large expressive anime-style eyes, but preserve facial negative space and avoid compressed chibi proportions.

### C. Eyebrows
Type: small Head-space meshes or texture/geometry detail.
Rules:
- Must remain locked to the forehead during head movement.
- Keep clear silhouette/readability at close third-person camera distance.

### D. Nose / mouth
Type: head-surface geometry or very shallow attached detail.
Rules:
- Keep stylized and simple; avoid protruding pieces that visibly float or intersect in side view.
- Mouth position must remain stable from front / 45 / side views.

### E. Ears
Type: integrated into head shell preferred.
Rules:
- Follow the Head bone through rotation without separate transforms.
- Placement must leave clearance for later side-hair production.

## Appearance target
- Adult female Japanese-anime / cute stylized 3D-cartoon direction.
- Rounded feminine head silhouette.
- Soft chin, not overly pointed.
- Large expressive eyes with natural spacing.
- Clear but simple eyebrows, nose and mouth.
- Light skin material impression.
- Do not copy UAL mannequin facial styling, Roblox-native head proportions, or any third-party character.

## Coordinate / attachment contract
1. Load/clone the existing UAL3 Technical Base exactly as today.
2. Resolve the existing `Head` node by exact name.
3. Resolve the neck joint from the real hierarchy (`Head.parent`) instead of guessing a fixed neck string.
4. Bind the new head SkinnedMesh to that same skeleton instance (preferred) or a verified clone with identical bone names/order/transforms.
5. Face child meshes, if separated, must live under the same head local coordinate space and inherit Head motion directly.
6. Existing root normalization / forwardYaw / gameplay animation mixer remain untouched.

## Old-head handling
- Do not delete the original Technical Base asset.
- First version uses localized old-head masking/occlusion only after the replacement head is confirmed bound to the same rig.
- Never hide the entire mannequin body and overlay a non-skinned decorative character.
- The mask must be restricted to the old visible head/face region; neck/body skinning remains active.
- If later binary mesh inspection proves a separate head primitive/material/vertex region, a proper direct geometry replacement may supersede the mask.

## Weighting guidance
- Cranium / face: Head-dominant.
- Lower skull / upper neck seam: smooth blend between Head and the actual parent neck joint only where required.
- Do not assign spine/arm weights to the face.
- Keep the neck seam topology dense enough to avoid tearing when looking up/down/left/right.

## Material guidance
- Clean stylized skin material; no photoreal pores.
- Soft highlight / toy-like or anime 3D finish consistent with the reference board.
- Eyes need strong contrast and readability at the already-PASS close third-person zoom.
- Avoid flat single-color treatment that erases nose/mouth/eyelid definition.

## Stage acceptance
This Head + Face stage may advance to Hair only when all are true:
1. Front silhouette matches the adult-female reference direction.
2. 45-degree and side views do not reveal floating face parts.
3. Head turn left/right keeps eyes, brows, mouth and ears locked to the head.
4. Neck seam remains stable in Idle / Walk / Run / Jump.
5. No shoulder/arm/body technical behavior changes.
6. Existing Interact / Fish / Sit / Sleep capability remains wired.
7. Existing third-person close camera still works.
8. Local old-head mask does not hide neck/body geometry or create a visible double-head silhouette.

## Explicit non-goals for this stage
- no hair production
- no body silhouette rebuild
- no blouse / pants / shoes / belt
- no new facial rig / blendshape system unless later proven necessary
- no runtime version bump merely for this spec
- no replacement of the UAL3 Technical Base
