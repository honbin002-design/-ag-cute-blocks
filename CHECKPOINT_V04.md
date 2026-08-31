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
- Base world then loads heading/furniture-safety and mobile/life/wildlife/weather extensions in deterministic order.
- Cache presence alone is never treated as proof that a runtime is active.

## Daily progression — direct core migration COMPLETE
- `daily-progression-system.js` is the single rule authority for crop daily growth, seasonal eligibility, watering/rain/thunderstorm bonuses, fruit-tree daily growth, livestock product readiness, and snapshot next-day settlement.
- `app-v043.js` now imports `advanceDailyRecord` directly and its midnight `growDay()` uses the central rules instead of the former hard-coded `.15/.23/.09` growth logic.
- The live core reads persisted crop-care data for each crop before calculating the new day.
- Core midnight progression now immediately saves the reconciled world/settings after the authoritative day change.
- `sleep-routine.js` already routes sleep-to-morning through `advanceDailySnapshot`, so normal midnight and sleep-to-morning now share the same progression authority.
- `daily-progression-runtime.js` reconciliation bridge has been deleted.
- `bootstrap-v045.js` and `sw.js` no longer reference the retired bridge.
- PWA cache advanced to `ag-cute-blocks-v045-runtime17`.
- Livestock collection in the core now records `lastProductDay=worldDay` at the moment milk/egg/wool is collected, so readiness timing no longer depends only on the overlay repair runtime.
- `orchard-runtime.js` remains visual/interaction-only for daily growth, avoiding double growth.
- `farming-system.js` and crop-care both treat thunderstorm as natural rain.

## Automated validation
- JavaScript syntax checks parse all root `.js` files as ES modules.
- Relative named imports are validated.
- Deterministic daily-rule tests cover normal/watered/thunderstorm crop growth, season pause, winter orange/apple behavior, sheep readiness and shipping settlement.
- CI now additionally locks the direct-core architecture: core must import `advanceDailyRecord`, must use the crop-care key, livestock collection must stamp `lastProductDay`, the deleted bridge file must stay deleted, and bootstrap/service-worker must not reference it.
- Latest head `185c6f4e0ff9e0f478b425bee747b6a10a79550d` passed JavaScript/import/rule/architecture validation.
- GitHub Pages deployment for that same head completed SUCCESS.

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
- Furniture exit safety, thunderstorm visual quality, and other simultaneous action combinations still need concentrated device validation.
- Current persistence remains local-device; six-player shared persistent cloud world is not implemented yet.
- Shop-owned special furniture/decor still needs full build-catalog/runtime audit so purchased items reliably become placeable with complete geometry.

## NEXT
1. Repair and lock shop unlock -> build catalog mapping, including complete geometry for round pet bed, cloud lamp and flower arch plus existing garden swing/star bed.
2. Audit V0.4.2 -> V0.4.5 catalog/material regressions and restore missing building/material features without disturbing PASS input behavior.
3. Continue reducing camera/world collision per-frame allocations.
4. Continue character face/hair/clothing/shoes and animal anatomy/locomotion refinement.
5. Request the next iPhone validation only after enough new stable behavior is grouped into one concentrated test batch.
