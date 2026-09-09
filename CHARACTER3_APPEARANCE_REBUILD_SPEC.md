# AG Character 3 Appearance Rebuild Spec

Status: ACTIVE — next character production stage
Technical base: UAL character 3 / Character Technical Base
Reference source: user's `角色與動物正交圖細節總覽.png`
First appearance target: 成年女性（身材比例較突出）

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
- head mesh / head proportions
- face shape
- eyes, eyebrows, nose, mouth, ears
- hairline, bangs, side hair, back hair, hair clumps
- body silhouette and visible proportions, provided deformation remains compatible with the technical base
- clothing meshes/materials
- shoes, hats, glasses and accessories
- materials, textures and shading

## Locked adult-female appearance target
The first rebuilt playable character must match the adult-female row of the user's reference board, using all available front / 45-degree / side / back / 45-degree-back and detail views.

### Head / face
- Cute stylized Japanese-anime/3D-cartoon face, light skin impression.
- Large expressive eyes, but keep enough facial negative space; do not return to oversized compressed facial proportions.
- Rounded/feminine facial silhouette; chin soft rather than sharply pointed.
- Facial features must remain stable from front, 45-degree and side views.

### Hair
- Long dark wavy hair.
- Preserve a clear front hairline/bangs/side-hair silhouette and a substantial long wavy back-hair curtain.
- Back and 45-degree-back views are mandatory references, not inferred from the front view.
- Hair must be bound to the head/appropriate bones and must not float away, cut through the face/ears, or drift during head motion.

### Body silhouette
- Adult female, not child/chibi-only proportions.
- Narrower shoulders than the adult male reference.
- Clearly defined waist and more pronounced feminine hip/body silhouette, following the reference label `身材比例較突出` without turning it into exaggerated anatomy that breaks animation.
- Preserve the Technical Base deformation and joint positions; visual silhouette/fitting adapts around the rig rather than replacing the rig.

### Outfit
- White blouse/shirt with visible collar/upper-torso structure and cuff detail.
- Beige/tan slim trousers.
- Visible belt/waist detail.
- Nude/beige high heels, shaped from the supplied shoe detail views rather than a generic shoe block.
- Rear waist/trouser and blouse details must read correctly in back view.

### Hands / shoes / detail views
- Use the supplied feminine hand-detail panels as shape/gesture references while retaining the Technical Base hand rig.
- Shoe construction must consider the supplied multiple heel angles and sole view.
- Do not bake hands or shoes as rigid decorative pieces if that would disable animation or wardrobe replacement.

### Material impression
- Clean, cute stylized 3D finish with soft/glossy toy-like shading consistent with the reference board.
- Avoid photoreal skin/hair materials and avoid flat single-color geometry that erases facial/clothing detail.

## Art direction already decided
- Japanese anime / cute stylized direction; do not use a native Roblox head style.
- Body stays comparatively simple and animation-friendly; visual quality is concentrated in head, face and hair.
- Male/female variants must differ in silhouette/proportion and not merely hair/color.
- No copying of a specific third-party character; the user's supplied reference art controls the target appearance.

## Reference-art rule
The user's `角色與動物正交圖細節總覽.png` is the authoritative appearance source for this stage. Do not substitute AG_Boy preview renders, Manus5, Kenney, Quaternius or UAL mannequin appearance as the aesthetic target. Those assets may only provide technical/reference information.

## First-character acceptance
The first rebuilt character is not accepted merely because it loads. It must retain the Technical Base and pass:
1. front / 45-degree / side / back / 45-degree-back appearance review against the adult-female reference;
2. idle / walk / run / jump deformation stability;
3. head turn stability — face/hair cannot float, drift or intersect badly;
4. shoulder, elbow, wrist, hip, knee and ankle remain connected without obvious tearing/explosion;
5. Sit/Sleep furniture integration remains compatible;
6. Interact/Fish wiring remains available;
7. third-person close-up inspection remains usable;
8. wardrobe compatibility is retained or adapted through the same wardrobe catalog route.

## Anti-regression rule
Appearance work must be additive/replace visual meshes only. Never solve an appearance problem by deleting or rebuilding a Technical Base feature that has already passed. If a visual mesh conflicts with the rig, adapt the visual mesh/weights/fitting first.
