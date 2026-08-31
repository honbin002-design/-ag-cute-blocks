# AG Cute Blocks — V0.4.5 Checkpoint

Date: 2026-08-31
Branch: `dev-v0.1`

## Locked direction
- Original cozy farm-life chibi identity; do not copy recognizable protected characters, models, costumes, UI, maps, names, music or other protected expression.
- Three camera modes remain: First Person / Third Person / Farm View.
- Visible character faces actual movement direction.
- Character, pets, livestock and wildlife still require higher-quality believable cute 3D art before final PASS.
- Life systems remain gentle: no crop death for missed watering, no forced hunger/sleep grind, no debt/login-streak punishment.

## Real-device PASS already locked
- iPhone simultaneous movement + Jump: PASS on 2026-08-31.
- One finger may keep the movement joystick active while a second finger presses Jump.
- Do not re-test this specific behavior unless future input changes can affect it.

## Runtime architecture
- `bootstrap-v045.js` remains the single live module entrypoint.
- Renderer/collision/raycast governance loads before the base world.
- Base world then loads heading/furniture-safety, procedural building surfaces and mobile/life/wildlife/weather extensions in deterministic order.
- Cache presence alone is never treated as proof that a runtime is active.

## Daily progression — direct core migration COMPLETE
- `daily-progression-system.js` is the single rule authority for crop daily growth, seasonal eligibility, watering/rain/thunderstorm bonuses, fruit-tree daily growth, livestock product readiness and snapshot next-day settlement.
- `app-v043.js` imports `advanceDailyRecord` directly and its midnight `growDay()` uses the central rules instead of the former hard-coded growth logic.
- The live core reads persisted crop-care data for each crop before calculating the new day.
- `sleep-routine.js` routes sleep-to-morning through `advanceDailySnapshot`, so normal midnight and sleep-to-morning share the same progression authority.
- The temporary `daily-progression-runtime.js` reconciliation bridge has been deleted.
- Livestock collection stamps `lastProductDay=worldDay` immediately when milk/egg/wool is collected.
- `orchard-runtime.js` remains visual/interaction-only for daily growth, preventing double growth.
- `farming-system.js` and crop-care both treat thunderstorm as natural rain.

## Shop unlock -> build catalog COMPLETE at integration level
- Every current shop reward has a build mapping:
  - `sapling-peach` -> `peachTree`
  - `pet-bed-round` -> `petBedRound`
  - `lamp-cloud` -> `cloudLamp`
  - `arch-flower` -> `flowerArch`
  - `swing-garden` -> `swingGarden`
  - `bed-star` -> `starBed`
- Purchased rewards appear in a dynamic `收藏` build category instead of being silently owned but unusable.
- A successful purchase switches to `收藏` and selects the newly purchased build item.
- Round pet bed, cloud lamp, flower arch and star bed now have distinct original procedural geometry; garden swing already had a dedicated model.
- This is integration-complete, not final visual-art PASS.

## V0.4.2 -> V0.4.5 building regression restoration
- Historical `app-v042.js` was compared against the active core and confirmed that the V0.4.3 rewrite had dropped a meaningful amount of building content.
- Active `app-v043.js` now restores the richer building set while preserving the newer V0.4.5 life/mobile systems.
- Shape catalog now includes cube, rectangular prism, sphere, cylinder, triangular prism, slope and roof piece.
- Building materials restored: wood, dark wood, stone, marble, brick, concrete, glass, roof tile color and pink accent.
- Building objects restored: door, window and fence.
- Furniture/appliance set restored/expanded: chair, table, sofa, bed, lamp, fridge, stove, washer, TV and cabinet.
- Six homestead-area pads are again present as non-colliding world markers.
- Material selection and shape selection are separate: choosing a building material updates the active block material; choosing a shape keeps that active material.
- Remaining primitive gap: dedicated stairs are still not implemented.
- Remaining material gap: a dedicated tile/ceramic material selection is still not implemented.

## Original procedural building surfaces
- `procedural-material-runtime.js` generates its own tiny CanvasTexture surfaces at runtime; no downloaded texture packs or copied game assets are used.
- Wood/dark wood receive lightweight grain/knot variation.
- Brick receives staggered mortar lines and subtle surface variation.
- Concrete receives fine speckle variation.
- Stone receives irregular mottled patches.
- Marble receives restrained procedural vein lines.
- Roof and pink accent materials receive lightweight surface patterning.
- Textures are generated once per material and shared; the runtime periodically scans only for newly added block meshes.
- Glass and metal keep their existing material path rather than being flattened into the procedural texture set.
- This is a visual-quality improvement, not final material-art PASS; dedicated ceramic/tile and more advanced UV/material behavior remain future work.

## Automated validation / deployment
- JavaScript syntax checks parse every root `.js` file as an ES module and validate relative named imports.
- Deterministic daily-rule tests cover normal/watered/thunderstorm crop growth, season pause, winter orange/apple behavior, sheep readiness and shipping settlement.
- Direct-core daily architecture and shop-reward buildability are locked by CI assertions.
- Restored V0.4.2 building invariants are locked by CI: triangle/roof primitives, material/building/appliance categories, core object models, homestead pads and material-selection behavior.
- Building-restoration head `3cf29f32dfe82322514842aa9d1fe39ac78d4b26` completed JavaScript/import/rule/shop/build-regression validation SUCCESS and GitHub Pages deployment SUCCESS.
- Procedural-material runtime is now activated by bootstrap and included in PWA cache `ag-cute-blocks-v045-runtime20`; its newest CI/Pages run must complete before this newest visual batch is called deployment-complete.

## Other integrated V0.4.5 systems
- Crop watering UI and persisted daily care state.
- Original deer/rabbit/fox wildlife with species-specific states and mobile LOD/culling.
- Cow/sheep/chicken and dog/cat life-state runtime.
- Fruit visibility/harvest readiness guard.
- Chair/sofa/bed/garden-swing interactions and sleep-to-morning.
- Furniture safe-exit fallback candidates.
- Thunderstorm weather option and lightweight rain/snow/fog/cloud/lightning visuals.
- Adaptive renderer pixel ratio and shadow refresh cadence.
- Static collision bounds cache and camera-raycast budget.
- Shortest-turn heading correction.

## Explicitly NOT PASS yet
- V0.4.5 as a whole still requires a later concentrated iPhone validation batch.
- Final character/pet/livestock/wildlife visual quality is still intermediate.
- Subjective movement/render smoothness needs later device confirmation beyond the already-PASS walk+Jump case.
- Furniture exit safety, thunderstorm visual quality and other simultaneous action combinations still need concentrated device validation.
- Current persistence remains local-device; six-player shared persistent cloud world is not implemented yet.
- Dedicated stairs and dedicated tile/ceramic building material are still missing.
- Procedural building textures improve legibility/appearance but are not yet the final high-quality material system.

## NEXT
1. Observe newest procedural-material CI and Pages deployment; fix failures before relying on the live batch.
2. Add a dedicated stairs primitive and dedicated ceramic/tile material without regressing the restored catalog.
3. Continue reducing camera/world collision per-frame allocations while preserving the already-PASS multitouch path.
4. Continue character face/hair/clothing/shoes and animal anatomy/locomotion refinement.
5. Request the next iPhone validation only after enough new stable behavior is grouped into one concentrated test batch.
