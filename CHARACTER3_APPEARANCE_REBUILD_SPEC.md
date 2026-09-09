# AG Character 3 Appearance Rebuild Spec

Status: ACTIVE — next character production stage
Technical base: UAL character 3 / Character Technical Base

## Fixed production route
Character Technical Base -> rebuild appearance from user's reference art -> preserve technical base -> validate one playable character -> derive additional characters.

Manus5 and other historical candidates are reference assets only. They must not replace the Character 3 technical base.

## Locked technical layer — MUST NOT BREAK
- Existing UAL3 rig / skinning / joint hierarchy and working animation binding.
- Existing movement orientation and passed walk/run baseline.
- Idle, Walk, Run, Jump animation capability.
- Sit, Sleep, Wake, Interact and Fish capability and existing gameplay wiring.
- Furniture fitting/anchor behavior and acceptance telemetry.
- Third-person close zoom/orbit behavior already passed on iPhone.
- Existing wardrobe / paper-doll compatibility route must remain available; appearance work may add fitting adapters but must not create a second unrelated wardrobe system.
- Swim/Dodge remain non-blocking gameplay expansion items; do not invent fake gameplay merely to satisfy character completion.

## Appearance layer — allowed to rebuild
The following may be replaced/rebuilt while retaining the locked technical layer:
- head mesh / head proportions
- face shape
- eyes, eyebrows, nose, mouth, ears
- hairline, bangs, side hair, back hair, hair clumps
- body silhouette and visible proportions, provided deformation remains compatible with the technical base
- clothing meshes/materials
- shoes, hats, glasses and accessories
- materials, textures and shading

## Art direction already decided
- Japanese anime / cute stylized direction; do not use a native Roblox head style.
- Rounded/cute head, enough facial negative space, chin not excessively sharp.
- Eyes larger but proportionally natural; facial features simple, clear and expressive.
- Hair silhouette is more important than tiny strand detail. Front/45-degree/side/back views must all read correctly.
- Body stays comparatively simple and animation-friendly; visual quality is concentrated in head, face and hair.
- Male/female variants must differ in silhouette/proportion and not merely hair/color.
- No copying of a specific third-party character; user's supplied reference art controls the target appearance.

## Reference-art rule
The user's supplied character image(s) are the appearance target. Do not substitute AG_Boy preview renders, Manus5, Kenney, Quaternius or UAL mannequin appearance as the aesthetic target. Those assets may only provide technical/reference information.

Before mesh production, extract the chosen reference into a compact appearance sheet covering: head/face, hair, body proportions, outfit, palette/material impression, and front/side silhouette. If the original reference image is not recoverable from project storage, do not guess its exact details and do not fabricate a replacement target; retain this spec and recover the original reference before appearance matching.

## First-character acceptance
The first rebuilt character is not accepted merely because it loads. It must retain the Technical Base and pass:
1. front / 45-degree / side / back appearance review;
2. idle / walk / run / jump deformation stability;
3. head turn stability — face/hair cannot float, drift or intersect badly;
4. shoulder, elbow, wrist, hip, knee and ankle remain connected without obvious tearing/explosion;
5. Sit/Sleep furniture integration remains compatible;
6. Interact/Fish wiring remains available;
7. third-person close-up inspection remains usable;
8. wardrobe compatibility is retained or adapted through the same wardrobe catalog route.

## Anti-regression rule
Appearance work must be additive/replace visual meshes only. Never solve an appearance problem by deleting or rebuilding a Technical Base feature that has already passed. If a visual mesh conflicts with the rig, adapt the visual mesh/weights/fitting first.
