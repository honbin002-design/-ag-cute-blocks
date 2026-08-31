# AG Cute Blocks — V0.4.5 Life / Wildlife / Orchard / Mobile Control Checkpoint

Date: 2026-08-31
Branch: `dev-v0.1`

## Locked direction
- Original cozy farm-life chibi identity; broad farm-life appeal/control references are allowed, but recognizable protected characters, costumes, models, UI, maps, names, music or other protected expression are not copied.
- Character, pets, livestock and wildlife must become attractive, believable species/child forms rather than generic boxes/balls.
- Three camera modes remain: First Person / Third Person / Farm View. Visible character faces actual movement direction.
- Life systems should feel gentle: no crop death for missed watering, no forced hunger/sleep grind, no debt/login-streak pressure.

## Persistent life loop already integrated
- Crop/fruit harvest -> inventory.
- Chicken/cow/sheep products -> inventory.
- Dog/cat petting and affection.
- Shipping box -> next-morning coin settlement.
- Optional coin shop and decorative unlocks.
- Chair/sofa sitting, bed lying, dining-chair action, garden-swing action.
- Bed can sleep to next morning; world saves first, advances to 06:00, settles shipping, advances gentle growth/readiness, then wakes beside the bed.

## V0.4.5 crop care
- Live crop registry is active.
- Near an immature crop, a dedicated watering action appears.
- Watering gives wet-soil feedback plus a small water-droplet splash.
- One watering bonus per game day; rain and thunderstorm both count as natural watering.
- Watering accelerates growth but is never required for crop survival.
- Watering state is persisted separately from the lossy base world snapshot so a reload does not silently forget today's watering.

## V0.4.5 animal life
- Cow/sheep/chicken visual states support idle / walk / eat / drink / sleep / petResponse.
- Pet dog/cat support idle / sleep / petResponse.
- Animal life runtime selects states from time/environment and is loaded by the active bootstrap.
- Sleep/rest states hold position so animals do not slide while sleeping.
- Animal-life no longer side-effect-imports renderer/input/collision/wildlife runtimes; bootstrap is the only runtime activation owner.
- Movement detection threshold was corrected so the slow ranch wandering speed is recognized as movement instead of being repeatedly mistaken for idle.
- The runtime detects a livestock product-ready -> collected transition, records `lastProductDay`, and patches the saved object immediately so milk/egg/wool readiness cannot accidentally restart from an old day after reload.
- Pet affection increases trigger the visible `petResponse` state.

## V0.4.5 wildlife + mobile LOD
- Deer/rabbit/fox have separate original models and locomotion hooks.
- Deterministic natural zones avoid the six homestead areas.
- `wildlife-live-runtime.js` instantiates wildlife into the active world through the live avatar/world bridge.
- Wildlife uses hard active-count budgets plus distance culling and full/medium/low/hidden LOD.
- Far wildlife stops high-cost animation; beyond the active distance it is hidden.
- Wildlife facing follows its actual movement vector.
- Deer, rabbit and fox receive distinct walk / idle / eat / drink / sleep poses instead of sharing one generic idle motion.
- Rabbit hopping, deer head-lowering and fox resting are kept species-specific while remaining lightweight procedural animation.
- Creature shadow changes are traversed only when the shadow state changes.
- Wildlife consumes the renderer's single live quality tier instead of running a second independent performance governor.
- Live avatar lookup is cached and only rescanned when the current avatar is detached.

## V0.4.5 orchard consistency
- `orchard-runtime.js` is loaded by the active bootstrap.
- Fruit harvesting is guarded by the same visible fruit readiness supplied by `crop-models.js`; a mature-looking but season-ineligible tree can no longer silently yield invisible fruit.
- When the visual fruit-ready threshold is reached, the holder is aligned to the interaction threshold so visible ripe fruit is immediately pickable.
- Orange keeps autumn/winter fruiting behavior and receives gentle winter daily growth even though the older generic tree loop pauses trees in winter.
- Orchard growth corrections are persisted back to the local world snapshot.

## V0.4.5 mobile controls + smoothness
- Original iPhone blocker: while one finger held the movement joystick, other gameplay buttons such as Jump did not reliably fire.
- REAL DEVICE PASS (2026-08-31): user confirmed the character can now keep walking while Jump is pressed with the other finger. This specific walk + jump multitouch behavior is locked PASS and must not regress.
- `mobile-input-runtime.js` converts Jump / Place / Remove / Rotate / Life Interaction plus camera/life buttons to immediate pointer-down actions instead of relying on delayed compatibility click after touch release.
- The movement joystick keeps its own pointer capture only for its movement finger, so a second finger remains available for action buttons.
- Delayed physical compatibility clicks are suppressed so one press cannot fire twice.
- Blur, page hide, visibility loss and lost pointer capture clear the tracked movement pointer so a cancelled iOS touch cannot leave movement stuck.
- Existing click capture/bubble logic is preserved through programmatic click dispatch, so crop/orchard interaction guards still run.
- `heading-runtime.js` corrects the base player's/pets'/livestock's scalar angle interpolation at the -PI/+PI boundary so they take the shortest turn instead of visually rotating the long way/backwards.
- `render-performance-runtime.js` governs the live WebGL renderer pixel ratio without touching saved world content and publishes one live quality tier for dependent systems.
- Shadow refresh is paced by adaptive tier: high every frame, normal every 2 frames, low every 3 frames. Geometry/lighting remains enabled; only shadow refresh cadence is reduced under mobile load.
- Static collision bounds remain cached through `collision-cache-runtime.js`; the cache compares numeric transforms directly instead of allocating transform-key strings on every collision check.
- `raycast-budget-runtime.js` leaves aim/build rays unchanged but culls obviously distant solid meshes from the short third-person/farm camera collision ray after the first rendered frame.

## Furniture exit safety
- Furniture anchor/exit transforms force an up-to-date world matrix before `localToWorld`, avoiding stale rotated seat coordinates.
- Furniture definitions expose front/right/left/back exit candidates.
- `furniture-safety-runtime.js` remembers the pre-seat position and checks the core stand-up result against world bounds, water and other solid objects.
- If the default stand-up point is blocked, it tries alternate furniture-relative exits and finally the remembered pre-seat position. This is runtime-integrated but still needs concentrated device validation before PASS.

## Weather visuals
- `weather-visual-runtime.js` is active and follows the existing world weather selector without changing destructive gameplay rules.
- Rain uses lightweight screen-space streaks; snow uses drifting flakes; fog/cloudy use a soft moving haze layer.
- Thunderstorm is now exposed as `⛈️ 雷雨` directly by the weather runtime without requiring a base-page rewrite.
- Thunderstorm uses denser angled rain, darker haze and brief low-intensity lightning flashes; there is no destructive lightning strike, crop damage, building damage or punishment.
- Saved thunderstorm selection is restored after bootstrap even though the base page originally had no thunderstorm option.
- Crop-care and sleep/day-advance paths both treat thunderstorm as natural rain so manual watering is disabled and rainy growth bonuses remain consistent in those paths.
- Particle counts follow the renderer's live quality tier, and low tier draws the overlay every second frame to protect mobile frame time.

## Runtime activation correction
- A runtime audit found that the live `index.html` was still directly loading the base app plus only some life extensions, while mobile-input/performance/collision/wildlife modules were merely present in the PWA cache. Cache presence alone is not accepted as proof that a runtime is active.
- `bootstrap-v045.js` is now the single live module entrypoint.
- Bootstrap order is deterministic: renderer/collision/raycast governance -> base world -> heading/furniture safety -> mobile input -> animal/crop/orchard/furniture/sleep/wildlife/weather extensions.
- This prevents later index edits from silently dropping a runtime while leaving its file cached.

## PWA / validation
- PWA cache is now `ag-cute-blocks-v045-runtime14` and includes deterministic bootstrap, mobile-input, adaptive render, collision cache, camera raycast budget, heading correction, furniture safety, crop care, animal life, wildlife, orchard, weather visuals and supporting modules.
- GitHub Actions parses every root `.js` file as an ES module and validates relative named imports.
- Earlier runtime/weather batches passed JavaScript syntax/import validation; runtime14 still requires its own latest workflow/deployment observation before integration-complete status.
- Walk + Jump simultaneous control has real iPhone PASS evidence.
- Other simultaneous action combinations, heading boundary behavior, furniture safe exit, thunderstorm visual quality and adaptive shadow cadence still need concentrated real-device validation later; do not re-test the already-PASS walk + jump unless a future input change could affect it.

## Explicitly not PASS yet
- V0.4.5 as a whole still needs concentrated iPhone real-device validation before milestone PASS.
- Final character/pet/livestock/wildlife art quality is still intermediate.
- Adaptive pixel ratio + shadow cadence are integrated, but subjective smoothness and visual shadow quality still need later device validation.
- Thunderstorm is non-destructive by design; deeper environmental responses such as puddles/wet materials are not yet implemented.
- The older base app still owns one midnight growth path, so all daily progression logic is not yet fully centralized; avoid assuming every thunderstorm growth rule is unified until that cleanup is done.
- Current world persistence is local-device; six-player shared cloud persistence is not implemented.

## NEXT
1. Observe syntax/import checks and Pages deployment for runtime14; fix failures before asking for device validation.
2. Centralize remaining duplicated daily progression/sleep logic, including the base midnight growth path.
3. Continue reducing camera/world collision per-frame work while preserving the already-PASS multitouch path.
4. Continue character hair/clothing/shoe/face refinement and pet/livestock/wildlife anatomy refinement.
5. Add gentle wet-ground/puddle response only if it stays within the mobile performance budget.
6. Only request another concentrated iPhone check when a stable checkpoint contains enough new behavior to justify it.
