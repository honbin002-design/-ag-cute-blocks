# AG Cute Blocks — V0.4.5 Checkpoint

Date: 2026-08-31
Branch: `dev-v0.1`
Active PWA cache: `ag-cute-blocks-v045-runtime42`

## Locked product direction
- Original cozy farm-life chibi identity; do not copy recognizable protected characters, models, costumes, UI, maps, names, music or other protected expression.
- Three camera modes remain: First Person / Third Person / Farm View.
- Visible character faces actual movement direction in Third Person / Farm View.
- Character, pets, livestock and wildlife remain cute but must become believable complete 3D forms before final art PASS.
- Life systems stay gentle: no crop death for missed watering, no forced hunger/sleep grind, no debt/login-streak punishment.

## Real-device PASS already locked
- iPhone simultaneous movement + Jump: PASS on 2026-08-31.
- One finger may keep the movement joystick active while a second finger presses Jump.
- `mobile-input-runtime.js` has not been changed during runtime31-38 performance/art/locomotion work; do not re-test this specific PASS unless future input work can affect it.

## Runtime architecture
- `bootstrap-v045.js` remains the single live module entrypoint.
- Renderer/collision/raycast governance loads before the base world.
- Base world then loads heading/furniture-safety, procedural building surfaces, character polish, pet grounding, mobile HUD/input, life, wildlife and weather extensions in deterministic order.
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
- When stairs replace cube geometry they explicitly invalidate the collision-box cache and reindex the static spatial collision grid.
- Tile/ceramic persist through the normal block material ID and are rendered by the original procedural material runtime.
- Restored/available building objects include door, window, fence, chair, table, sofa, bed, lamp, fridge, stove, washer, TV and cabinet.
- Six homestead pads remain present as non-colliding world markers.
- Shop rewards map into a dynamic `收藏` build category: peach sapling, round pet bed, cloud lamp, flower arch, garden swing and star bed.
- Building integration is not final material/art PASS.

## Mobile HUD
- Dedicated mobile control stylesheet/runtime is active.
- Movement joystick uses a larger left thumb zone.
- Right action cluster uses larger, more widely spaced staggered gamepad-style buttons; Jump is the dominant target.
- Context interaction and crop watering use separate context-action positions.
- Bottom build catalog stays in the center safe lane instead of extending under thumb zones.
- Short-height landscape phones receive a compact fallback layout.

## Character / animal anatomy pass — runtime34
- Farm-life chibi child has additional face/hair/clothing/sock/shoe detail.
- Dog/cat silhouettes have stronger muzzle/ear/paw/tail/species cues.
- Cow/sheep/chicken have stronger species anatomy and articulated-leg detail.
- This remains intermediate art, not final visual PASS.

## Species locomotion pass — runtime35-37
- Livestock gait phase is driven by actual movement speed and elapsed frame time instead of only wall-clock animation time.
- Cow and sheep use diagonal quadruped stepping with visible leg lift and restrained body/head motion; chicken uses faster alternating two-leg cadence.
- Pet and player gait are driven in the dedicated polish RAF from actual XZ travel distance, so visible limb cadence follows movement distance and stops when travel stops.
- Player legs/arms, body bob and slight roll are re-applied after the base loop; locked furniture poses (`sit`, `lie`, `sleep`, `swing`, `dine`) are excluded.
- Dog/cat leg swing/lift, body bob and tail response follow actual parent travel; sleep/pet-response states remain excluded.
- `character-polish-runtime.js` is schema 6 with a `WeakMap` travel-state registry.

## Pet ground-contact pass — runtime38
- New `pet-grounding-runtime.js` attaches the visible dog/cat paw shell and toe accents directly to each animated leg pivot.
- Legacy low root-level decorative paw meshes are hidden so the visible paw no longer stays behind while the leg swings.
- Paw geometry therefore inherits the same leg rotation and vertical lift used by distance-based locomotion.
- The runtime is additive and does not touch player input or animal life-state ownership.
- This materially fixes the known detached-paw architecture issue, but visual ground contact and stop/turn feel still require device evidence before locomotion PASS.

## Interaction-nearby spatial lookup — runtime39
- `nearestTarget()` now queries a dedicated 4-unit XZ interaction index instead of scanning the full `objects` array.
- Interactable furniture, crops, mature trees, shipping box, livestock and pets are registered when created and unregistered when removed.
- Moving pets and livestock reindex only when crossing an interaction cell boundary.
- The lookup remains independent from `mobile-input-runtime.js`; the locked movement + Jump multitouch path is unchanged.

## Turn / stop transition refinement — runtime40
- Player, pets and livestock use shortest-path heading interpolation so turn transitions stay smooth across the `±PI` boundary.
- Distance-driven player/pet locomotion now uses a smoothed motion envelope; legs, arms, body bob and pet tail settle progressively when travel stops instead of snapping to rest.
- This remains an integrated runtime change only; turn feel, stop feel, paw contact and subjective sliding still require concentrated real-device evidence.

## Build Aim target registry — runtime41
- Build raycast roots are maintained incrementally for ground, water, blocks and object groups.
- `aim()` reuses the registry with recursive raycast traversal instead of rebuilding and traversing every target array on each placement/removal action.
- Object and block creation/removal keep the registry synchronized; existing placement and save pipelines remain unchanged.

## Wet ground / puddle response — runtime42
- Rain and thunderstorm now show a small visual-only puddle layer on the world ground.
- Puddle count is performance-tiered at high/normal/low quality and uses shared geometry/material resources.
- The layer refreshes only when weather or performance tier changes; puddles are non-solid, excluded from build raycast and excluded from persistence.
- No farming rule, collision, interaction, mobile input or save format was changed.

## Collision hot path — runtime31
- Static `Box3.setFromObject()` cache uses O(1) transform/geometry revision validation for normal hits.
- Geometry replacement has explicit invalidation support.
- Core collision tests reuse scratch `Vector3`/`Box3` objects.

## Follow-camera hot path — runtime32
- `app-v043.js` owns a persistent `cameraTargets` registry.
- Third-person/Farm View `safeCamera()` no longer rebuilds all static targets every rendered frame.
- Camera/movement vectors and short-ray candidate buffers are reused.
- Pets use a dedicated live array instead of a per-frame filter.

## Movement collision spatial broad phase — runtime33
- Static solid blocks/furniture/buildings register into a 4-unit XZ spatial hash.
- `solidAt()` queries only the current spatial bucket, then still uses exact cached world-space `Box3` tests.
- Removal unregisters objects; stairs reindex after geometry replacement.
- `globalThis.__AGCB_WORLD_HOTPATH` exposes camera-target, pet and spatial-grid diagnostics.
- This prepares for larger worlds but is not full chunk streaming.

## Weather
- Admin weather selector includes `⛈️ 雷雨` directly.
- Rain/snow/fog/cloud/thunderstorm visuals follow the live performance tier.
- Thunderstorm uses denser rain, darker haze and gentle lightning with no destructive damage.

## Automated validation / deployment
- JavaScript workflow parses every root `.js` module and validates relative named imports.
- Daily-rule, shop, building catalog and mobile HUD checks remain locked.
- Building-extension workflow locks stairs/tile/ceramic, collision invalidation/spatial path, persistent camera path, anatomy markers, player/pet/livestock travel gait and runtime38 pet paw grounding markers.
- Runtime42 JavaScript syntax/import/rule/HUD checks: SUCCESS.
- Runtime42 building/collision/camera/spatial/anatomy/locomotion/paw-grounding/interaction-index/turn-stop/build-aim/wet-ground invariant checks: SUCCESS.
- Runtime42 Pages build/deployment/report steps: SUCCESS.

## Explicitly NOT PASS yet
- V0.4.5 as a whole still needs a concentrated iPhone real-device validation batch.
- Final character/pet/livestock/wildlife art quality is still intermediate.
- Subjective movement/render smoothness after runtime31-33 optimization needs device evidence.
- Runtime34 anatomy and runtime35-38 locomotion need device evidence before visual/motion PASS.
- Furniture safe exit, heading boundary behavior and thunderstorm visual quality still need concentrated device validation.
- Current persistence remains local-device; six-player shared persistent cloud world is not implemented.
- Full world/chunk streaming is not implemented.

## NEXT
1. Begin a chunk/world-index scaffold once local-world behavior is stable enough that persistence can be migrated without breaking existing saves.
2. Group enough stable changes before requesting the next concentrated iPhone validation.
