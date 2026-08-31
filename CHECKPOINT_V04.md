# AG Cute Blocks — V0.4.5 Checkpoint

Date: 2026-08-31
Branch: `dev-v0.1`
Active PWA cache: `ag-cute-blocks-v045-runtime36`

## Locked product direction
- Original cozy farm-life chibi identity; do not copy recognizable protected characters, models, costumes, UI, maps, names, music or other protected expression.
- Three camera modes remain: First Person / Third Person / Farm View.
- Visible character faces actual movement direction in Third Person / Farm View.
- Character, pets, livestock and wildlife remain cute but must become believable complete 3D forms before final art PASS.
- Life systems stay gentle: no crop death for missed watering, no forced hunger/sleep grind, no debt/login-streak punishment.

## Real-device PASS already locked
- iPhone simultaneous movement + Jump: PASS on 2026-08-31.
- One finger may keep the movement joystick active while a second finger presses Jump.
- `mobile-input-runtime.js` has not been changed during runtime31-36 performance/art/locomotion work; do not re-test this specific PASS unless future input work can affect it.

## Runtime architecture
- `bootstrap-v045.js` remains the single live module entrypoint.
- Renderer/collision/raycast governance loads before the base world.
- Base world then loads heading/furniture-safety, procedural building surfaces, mobile HUD/input, life, wildlife and weather extensions in deterministic order.
- Cache presence alone is never treated as proof that a runtime is active.

## Daily progression — direct core migration COMPLETE
- `daily-progression-system.js` is the single rule authority for crop daily growth, seasonal eligibility, watering/rain/thunderstorm bonuses, fruit-tree growth, livestock product readiness and snapshot next-day settlement.
- `app-v043.js` imports `advanceDailyRecord` directly and midnight `growDay()` uses the central rules.
- `sleep-routine.js` routes sleep-to-morning through `advanceDailySnapshot`.
- The temporary daily reconciliation bridge has been removed.
- Livestock collection immediately stamps `lastProductDay=worldDay`.
- Orchard runtime is visual/interaction-only for daily tree growth, preventing double growth.
- Thunderstorm is natural rain across farming/crop care/sleep/direct daily progression.

## Building / materials
- Restored building primitives: cube, rectangular prism, sphere, cylinder, triangular prism, slope and roof.
- `building-extension-runtime.js` adds dedicated stairs plus dedicated tile and ceramic selections without replacing the core save/remove pipeline.
- Stairs persist through the normal block `shape` field and restore to actual stepped geometry after load.
- When stairs replace cube geometry they explicitly invalidate the collision-box cache and reindex the static spatial collision grid, so the movement broad phase cannot retain stale bounds.
- Tile/ceramic persist through the normal block material ID and are rendered by the original procedural material runtime.
- Restored/available building objects include door, window, fence, chair, table, sofa, bed, lamp, fridge, stove, washer, TV and cabinet.
- Six homestead pads remain present as non-colliding world markers.
- Shop rewards map into a dynamic `收藏` build category: peach sapling, round pet bed, cloud lamp, flower arch, garden swing and star bed.
- Procedural materials are generated locally at runtime; no downloaded/copied game texture pack is required.
- Building integration is not final material/art PASS.

## Mobile HUD
- Dedicated mobile control stylesheet/runtime is active.
- Movement joystick uses a larger left thumb zone.
- Right action cluster uses larger, more widely spaced staggered gamepad-style buttons; Jump is the dominant target.
- Context interaction and crop watering use separate context-action positions.
- Bottom build catalog stays in the center safe lane instead of extending under thumb zones.
- Short-height landscape phones receive a compact fallback layout.
- Controls are classified by role (`movement`, `primary-action`, `context-action`, `build-action`, `menu`) for future tool/run/fishing actions.

## Character / animal anatomy pass — runtime34
- Farm-life chibi child retains articulated face/hair/clothing/sock/shoe polish and adds restrained cheek/facial accents for better readability at Farm View distance.
- Clothing/shoe polish remains attached to animated arm/leg joints instead of floating independently.
- Dog silhouette has stronger chest/muzzle definition, visible nose, paws/toes and collar bell.
- Cat silhouette has stronger muzzle, inner-ear detail, visible whiskers, paws/toes and collar bell.
- Cow has stronger fetlock/leg treatment, neck/muzzle definition, horns, nostrils, collar/bell and an udder silhouette so it reads more clearly as bovine from multiple angles.
- Sheep has denser wool/ear/muzzle/nose detail while keeping a lightweight procedural model.
- Chicken has clearer tail/wing feather shapes, wattle, sharper beak and visible feet/toes.
- This is a meaningful anatomy/readability improvement, not final art PASS.

## Species locomotion pass — runtime35-36
- Livestock gait phase is no longer driven only by wall-clock animation time. `animal-models.js` advances gait from actual movement speed and elapsed frame time, so cadence tracks travel rather than continuing to cycle independently of motion.
- Cow and sheep use diagonal quadruped stepping with visible leg lift, restrained body roll/pitch and head/body bob; chicken uses a faster alternating two-leg cadence with larger lift.
- Leg pivots retain base-height data so the animation can lift a stepping leg and reliably return it to its neutral height when movement stops.
- Pet visual locomotion now samples actual parent travel distance during render and converts that travel into dog/cat gait phase, leg swing/lift, body bob and tail response instead of relying only on a fixed time oscillator.
- Sleep and pet-response states remain owned by the existing life/state systems and are excluded from the travel-gait override.
- `character-polish-runtime.js` is schema 5; pet travel gait is a non-destructive visual layer and does not touch the locked mobile input path.
- This is not locomotion PASS yet: player gait, pet paw/ground-contact polish, turning/stop transitions and subjective sliding still need concentrated real-device review/refinement.

## Collision hot path — runtime31
- Static `Box3.setFromObject()` cache uses O(1) transform/geometry revision validation for normal hits rather than scanning child geometry on every movement collision test.
- Geometry replacement has explicit invalidation support (`invalidateGeometry`) and a geometry revision token.
- Core collision tests reuse one `Vector3` and one `Box3` scratch object instead of allocating new ones for every candidate.

## Follow-camera hot path — runtime32
- `app-v043.js` owns a persistent `cameraTargets` registry for static solid meshes.
- Blocks and solid objects register once when created/loaded and unregister only when removed.
- Third-person/Farm View `safeCamera()` no longer rebuilds a temporary target array, filters every object, and traverses every solid object on every rendered frame.
- `safeCamera()` and the main frame loop reuse movement/camera/look vectors.
- Pets use a dedicated live array instead of `objects.filter(...)` every frame.
- `raycast-budget-runtime.js` reuses one `nearby` candidate buffer for short follow-camera rays.
- Aim/build ray behavior remains separate and unchanged.

## Movement collision spatial broad phase — runtime33
- Static solid blocks/furniture/buildings register into a 4-unit XZ spatial hash (`solidGrid`) when created or loaded.
- An object's expanded exact collision bounds determine every spatial cell it occupies, so larger furniture/building objects can span multiple buckets safely.
- Removal unregisters the object from all buckets and deletes empty buckets.
- `solidAt()` queries only the candidate player's current spatial bucket instead of scanning every block and every solid object in the world.
- The bucket is only a broad phase: candidates still use the existing exact cached world-space `Box3` test and the same `.24` block / `.22` solid-object padding, preserving collision semantics.
- The current furniture interaction anchor is still excluded from collision checks as before.
- `reindexSolid()` is exposed for any future static object's geometry/transform change; stairs already use it after geometry replacement.
- `globalThis.__AGCB_WORLD_HOTPATH` schema 2 exposes camera-target count, pet count and solid-cell count for later device diagnostics.
- This removes the major O(all static solids) movement scan, but does not replace future world/chunk streaming.

## Weather
- Admin weather selector includes `⛈️ 雷雨` directly.
- Rain/snow/fog/cloud/thunderstorm visuals are lightweight screen-space effects following the live render performance tier.
- Thunderstorm uses denser angled rain, darker haze and gentle brief lightning; no destructive lightning/building/crop damage.
- Saved thunderstorm selection is restored after bootstrap.

## Automated validation / deployment
- JavaScript workflow parses every root `.js` module and validates relative named imports.
- Daily-rule smoke tests cover normal/watered/thunderstorm crop growth, season pause, winter orange/apple behavior, sheep readiness and shipping settlement.
- Direct-core daily authority, shop buildability, restored building catalog and mobile thumb-zone HUD are locked by CI.
- Building-extension workflow locks stairs/tile/ceramic, collision geometry invalidation, spatial collision, persistent camera targets, reusable scratch paths, thunderstorm integration, anatomy markers and runtime36 pet/livestock distance-gait markers.
- Runtime36 push JavaScript syntax/import/rule/HUD checks: SUCCESS.
- Runtime36 push building/collision/camera/spatial/anatomy/locomotion invariant checks: SUCCESS.
- Runtime36 PR copies of JavaScript and building-extension checks: SUCCESS.
- Runtime36 Pages build, deploy and report-build-status for head `9f4f9771bf145334ae2bfa308e9756cee4082bf5`: SUCCESS.

## Explicitly NOT PASS yet
- V0.4.5 as a whole still needs a concentrated iPhone real-device validation batch.
- Final character/pet/livestock/wildlife art quality is still intermediate.
- Subjective movement/render smoothness after runtime31-33 optimization needs device evidence.
- Runtime34 anatomy proportions/readability and runtime35-36 locomotion quality need device evidence before visual/motion PASS.
- Furniture safe exit, heading boundary behavior and thunderstorm visual quality still need concentrated device validation.
- Current persistence remains local-device; six-player shared persistent cloud world is not implemented.
- Full world/chunk streaming is not implemented; the spatial hash/persistent camera registry are preparation for larger worlds, not a substitute for chunk streaming.

## NEXT
1. Reduce non-frame-critical O(n) interaction-nearby lookup without touching the locked multitouch input path.
2. Refine player gait and pet paw/ground-contact behavior so visible steps match travel and stop cleanly instead of sliding.
3. Reduce build-aim target assembly after interaction lookup is stabilized.
4. Add gentle wet-ground/puddle response only if it stays within the mobile performance budget.
5. Begin a chunk/world-index scaffold once local-world behavior is stable enough that persistence can be migrated without breaking existing saves.
6. Group enough stable changes before requesting the next concentrated iPhone validation.
