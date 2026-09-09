# AG Character 3 — Adult Female Mesh Blueprint

Status: ACTIVE
Technical base: UAL character 3 / 65-joint rig
Appearance source: user's `角色與動物正交圖細節總覽.png`
Purpose: define the first production split for Body / Head / Hair / Blouse / Pants / Shoes / Belt while preserving the existing Character Technical Base.

## Non-negotiable rules
- Keep the existing UAL3 skeleton, joint hierarchy, animation binding, forward orientation and gameplay wiring.
- Do not introduce a second character rig.
- Any deforming garment or body layer must ultimately deform from the same 65-joint skeleton.
- Rigid decorative attachments may parent to an existing bone/attachment point, but must never be used to fake a deforming body part.
- Appearance fitting adapts to the Technical Base; the Technical Base is not rebuilt to fit the appearance.

## 1. Body
Type: SkinnedMesh
Role: visible skin/body base underneath removable clothing.

Required weighting zones:
- root / pelvis / lower torso: body center and hip transition.
- spine chain (`spine_01`, `spine_02` and existing adjacent spine joints): abdomen, waist, rib cage and bust deformation.
- upperarm / lowerarm / hand chains, left and right: shoulders, upper arms, forearms, wrists and hands.
- thigh / calf / foot / toe chains, left and right: hips, thighs, knees, calves, ankles, feet and toes.
- neck / Head chain: neck-to-head transition only; head appearance itself is handled separately below.

Production rule:
- Preserve continuous topology around shoulder, elbow, wrist, hip, knee and ankle deformation zones.
- Do not create seams at hand/forearm or foot/calf transitions that can separate during Walk / Run / Jump / Interact.
- The adult-female waist/hip silhouette is sculpted around the existing joint centers; do not relocate joints merely to obtain the reference silhouette.

## 2. Head / Face
Type: preferably independent SkinnedMesh using the same skeleton; rigid Head-parented mesh is only acceptable for parts proven not to require neck/head deformation.
Primary bones: existing neck chain + `Head`.

Includes:
- head shape
- ears
- facial surface
- eyes / eyebrows / nose / mouth visual system

Production rule:
- Head must rotate with the existing `Head` bone without drift.
- Neck seam must remain covered/stable through idle, walk, run, jump and head-turn review.
- Eye/face components may be separate child meshes, but must stay in the same Head coordinate space and cannot float independently.

## 3. Hair
Type: hybrid attachment / lightly skinned visual layer.
Primary control: `Head`.
Secondary weighting: existing neck / upper-spine bones only where required by long back hair.

Recommended split:
- hair-cap / hairline: rigid or near-rigid Head attachment.
- bangs / side hair: Head-dominant weighting.
- long back wavy hair: Head-dominant with limited neck / upper-spine influence to avoid a rigid board during motion.

Production rule:
- No independent hair rig for version 1.
- Hair must not detach from scalp, cut through face/ears in the reference review angles, or lag behind the character due to a separate transform system.
- Keep the first version conservative: visual stability is more important than secondary hair physics.

## 4. White Blouse
Type: separate SkinnedMesh wardrobe layer.
Primary weighting zones:
- spine chain (`spine_01`, `spine_02`, adjacent torso joints)
- left/right shoulder and upperarm chains
- left/right lowerarm chains for sleeves/cuffs
- limited pelvis influence only at the lower hem if needed

Production rule:
- Must follow shoulder raising, elbow bending and torso twist without splitting from the body.
- Collar and cuff detail may be separate submeshes but remain attached to the same wardrobe item.
- Do not bake blouse permanently into Body; it must remain replaceable through the existing wardrobe route.

## 5. Beige / Tan Slim Pants
Type: separate SkinnedMesh wardrobe layer.
Primary weighting zones:
- pelvis / hip center
- left/right thigh
- left/right calf
- limited foot influence at ankle hem only when needed

Production rule:
- Waistband must stay aligned to the body through Sit and Sleep.
- Crotch/upper-thigh topology must tolerate run and sit poses without tearing.
- Slim silhouette must not be achieved by vertices intersecting the underlying body in normal motion; body-under-clothing masking may be used later only through the same wardrobe system.

## 6. Nude / Beige High Heels
Type: separate skinned footwear layer.
Primary weighting zones:
- left/right foot
- left/right toe/ball joint if present in the UAL skeleton
- minimal calf influence only around the ankle opening when required

Production rule:
- Keep existing ankle/foot/toe joint positions unchanged.
- Heel shape is visual geometry around the Technical Base foot chain; do not tilt or relocate the skeleton to fake a heel stance.
- Walking stability takes priority over an extreme heel angle.

## 7. Belt
Type: rigid or near-rigid attachment / accessory layer.
Primary parent/weighting: pelvis / lower-spine region.

Production rule:
- Belt may be a separate accessory slot.
- It should follow pelvis/waist motion without requiring full-body skinning.
- Buckle may remain rigid as a child of the belt layer.

## Layer ordering / occlusion
Recommended visual order:
1. Body skin base
2. Pants
3. Blouse
4. Belt
5. Shoes
6. Head/face
7. Hair
8. Optional accessories

Where hidden body surfaces cause clipping under clothing, prefer wardrobe-aware body masking or fitted body variants inside the same wardrobe system; do not create a second inventory/wardrobe implementation.

## Skeleton compatibility contract
Every deforming layer must bind to the exact same UAL3 skeleton instance or a verified clone preserving identical joint names/order/transforms. Existing animation tracks must continue targeting the same node names. The current runtime already rejects incompatible animation targets; appearance production must not weaken that fail-closed behavior.

## First production order
To minimize risk and isolate failures, produce in this order:
1. Head + face test on unchanged UAL body.
2. Hair test on the same head.
3. Body silhouette replacement bound to the same skeleton.
4. Blouse.
5. Pants.
6. Shoes.
7. Belt.
8. Combined character regression test.

Do not build all seven pieces before checking the first three. Each stage must preserve Walk / Run / Jump deformation before proceeding.

## Acceptance checkpoints
- Head: front / 45 / side / back alignment + head-turn stability.
- Hair: no scalp separation, face/ear collision kept within acceptable visual limits.
- Body: no joint tearing at shoulder/elbow/wrist/hip/knee/ankle.
- Blouse: shoulder/elbow/torso twist stable.
- Pants: Run + Sit stable.
- Shoes: Walk + Run foot contact remains credible.
- Belt: waist alignment stable.
- Combined: existing Sit / Sleep / Interact / Fish / close third-person camera remain available.
