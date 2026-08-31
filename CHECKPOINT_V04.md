# AG Cute Blocks — V0.4.5 Checkpoint

Date: 2026-08-31
Branch: `dev-v0.1`
Active PWA cache: `ag-cute-blocks-v045-runtime32`

## Locked product direction
- Original cozy farm-life chibi identity; do not copy recognizable protected characters, models, costumes, UI, maps, names, music or other protected expression.
- Three camera modes remain: First Person / Third Person / Farm View.
- Visible character faces actual movement direction in Third Person / Farm View.
- Character, pets, livestock and wildlife remain cute but must become believable complete 3D forms before final art PASS.
- Life systems stay gentle: no crop death for missed watering, no forced hunger/sleep grind, no debt/login-streak punishment.

## Real-device PASS already locked
- iPhone simultaneous movement + Jump: PASS on 2026-08-31.
- One finger may keep the movement joystick active while a second finger presses Jump.
- `mobile-input-runtime.js` has not been changed during the runtime31/32 performance work; do not re-test this specific PASS unless future input work can affect it.

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
- Stairs persist through the normal block `shape` field and are restored to actual stepped geometry after load.
- Tile/ceramic persist through the normal block material ID and are rendered by the original procedural material runtime.
- Restored/available building objects include door, window, fence, chair, table, sofa, bed, lamp, fridge, stove, washer, TV and cabinet.
- Six homestead pads remain present as non-colliding world markers.
- Shop rewards map into a dynamic `收藏` build category: peach sapling, round pet bed, cloud lamp, flower arch, garden swing and star bed.
- Procedural materials are generated locally at runtime; no downloaded/copied game texture pack is required.
- Wood/dark wood, stone, marble, brick, concrete, roof, pink accent, tile and ceramic have distinct procedural treatment.
- Building integration is not final material/art PASS.

## Mobile HUD
- Dedicated mobile control stylesheet/runtime is active.
- Movement joystick uses a larger left thumb zone.
- Right action cluster uses larger, more widely spaced staggered gamepad-style buttons; Jump is the dominant target.
- Context interaction and crop watering use separate context-action positions.
- Bottom build catalog stays in the center safe lane instead of extending under thumb zones.
- Short-height landscape phones receive a compact fallback layout.
- Controls are classified by role (`movement`, `primary-action`, `context-action`, `build-action`, `menu`) for future tool/run/fishing actions.

## Character / animal visual pass
- Farm-life chibi child model has additional face, hair, clothing, sock and shoe detail.
- Clothing/shoe polish is attached to animated arm/leg joints so details move with the articulated body instead of floating independently.
- Dog/cat have stronger species-specific muzzle/ear/body/paw/tail silhouettes.
- Cow/sheep/chicken have additional anatomy and articulated-leg detail.
- Art remains intermediate and requires concentrated iPhone visual validation before PASS.

## Collision hot path — runtime31
- Static `Box3.setFromObject()` cache uses O(1) transform/geometry revision validation for normal hits rather than scanning child geometry on every movement collision test.
- Geometry replacement has explicit invalidation support (`invalidateGeometry`) and a geometry revision token.
- Stairs explicitly invalidate their collision cache when cube geometry is replaced with stepped geometry.
- Core `solidAt()` now reuses one `Vector3` and one `Box3` scratch object instead of allocating new ones for every collision candidate check.

## Follow-camera hot path — runtime32
- `app-v043.js` now owns a persistent `cameraTargets` registry for static solid meshes.
- Blocks and solid objects register once when created/loaded and unregister only when removed.
- Third-person/Farm View `safeCamera()` no longer rebuilds a temporary target array, filters every object, and traverses every solid object on every rendered frame.
- `safeCamera()` reuses persistent camera delta/hit vectors.
- Main frame loop also reuses movement, eye, desired-camera, farm-ray origin and look-target vectors instead of creating new Three.js vectors every frame.
- Pets are kept in a dedicated live array, so the animation loop no longer performs `objects.filter(o=>o.userData.pet)` every frame.
- `raycast-budget-runtime.js` keeps its distance culling but now reuses one `nearby` candidate buffer instead of allocating another array per follow-camera ray.
- `globalThis.__AGCB_WORLD_HOTPATH` exposes camera-target and pet counts for later device/performance diagnostics.
- Aim/build ray behavior remains separate and unchanged.

## Weather
- Admin weather selector includes `⛈️ 雷雨` directly.
- Rain/snow/fog/cloud/thunderstorm visuals are lightweight screen-space effects following the live render performance tier.
- Thunderstorm uses denser angled rain, darker haze and gentle brief lightning; no destructive lightning/building/crop damage.
- Saved thunderstorm selection is restored after bootstrap.

## Automated validation
- JavaScript workflow parses every root `.js` module and validates relative named imports.
- Daily-rule smoke tests cover normal/watered/thunderstorm crop growth, season pause, winter orange/apple behavior, sheep readiness and shipping settlement.
- Direct-core daily authority, shop buildability, restored building catalog and mobile thumb-zone HUD are locked by CI.
- Building-extension workflow also locks stairs/tile/ceramic, collision geometry invalidation, articulated polish, gentle thunderstorm, persistent camera-target registry, reusable collision/frame scratch objects, dedicated pet loop and reusable raycast buffer.
- Runtime32 push JavaScript syntax/import/rule/HUD checks: SUCCESS.
- Runtime32 push building/collision/camera invariant checks: SUCCESS.
- Runtime32 Pages deployment must be observed to completion before calling this exact deployment PASS.

## Explicitly NOT PASS yet
- V0.4.5 as a whole still needs a concentrated iPhone real-device validation batch.
- Final character/pet/livestock/wildlife art quality is still intermediate.
- Subjective movement/render smoothness after runtime31/32 optimization needs device evidence.
- Furniture safe exit, heading boundary behavior and thunderstorm visual quality still need concentrated device validation.
- Current persistence remains local-device; six-player shared persistent cloud world is not implemented.
- Full world/chunk streaming is not implemented; persistent camera targets and cheaper collision/raycast paths are preparation for larger worlds, not a replacement for chunk streaming.

## NEXT
1. Observe runtime32 Pages deployment and fix any deployment/runtime regression before device validation.
2. Continue reducing world-scale O(n) movement collision scans; next architectural target is spatial partitioning/indexing for static solids while preserving exact collision behavior.
3. Continue character/animal art and locomotion refinement without touching the locked multitouch input path.
4. Add gentle wet-ground/puddle response only if it stays within the mobile performance budget.
5. Group enough stable changes before requesting the next concentrated iPhone validation.
