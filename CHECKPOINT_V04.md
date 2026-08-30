# AG Cute Blocks — V0.4.5 Live Life + Wildlife Checkpoint

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
- One watering bonus per game day; rain counts as natural watering.
- Watering accelerates growth but is never required for crop survival.

## V0.4.5 animal life
- Cow/sheep/chicken visual states support idle / walk / eat / drink / sleep / petResponse.
- Pet dog/cat support idle / sleep / petResponse.
- Animal life runtime selects states from time/environment and is loaded by the active page.
- Sleep/rest states hold position so animals do not slide while sleeping.

## V0.4.5 wildlife + mobile LOD
- Deer/rabbit/fox have separate original models and locomotion hooks.
- Deterministic natural zones avoid the six homestead areas.
- `wildlife-live-runtime.js` now instantiates wildlife into the active world through the live avatar/world bridge.
- The animal-life layer imports the wildlife runtime, so no extra HTML loader is required.
- Wildlife uses hard active-count budgets plus distance culling and full/medium/low/hidden LOD.
- Far wildlife stops high-cost animation; beyond the active distance it is hidden.
- Wildlife facing now follows its actual movement vector rather than pointing toward its home point.
- Hidden LOD state is now written back to the live entity instead of returning an unused copy.
- Creature shadow changes are only traversed when the shadow state changes, reducing repeated per-frame traversal.

## PWA / validation
- PWA cache `ag-cute-blocks-v045-runtime1` now explicitly precaches the active crop-care, animal-life and wildlife-live runtimes as well as their supporting modules.
- A package-free GitHub Actions JavaScript syntax-check workflow has been added. It parses every root `.js` file as an ES module using Node 22; workflow execution still needs to be observed before counting syntax validation as PASS.
- Previous Pages deployment for wildlife module commit `4ee34edd...` completed successfully. Newer V0.4.5 integration commits require a fresh Pages status check.

## Explicitly not PASS yet
- Static deployment success does not prove browser runtime behavior.
- V0.4.5 still needs concentrated iPhone real-device validation before milestone PASS.
- Final character/pet/livestock/wildlife art quality is still intermediate.
- Wildlife eat/drink/rest visual animation needs more species-specific refinement.
- Adaptive performance governor currently controls wildlife budgets; renderer pixel ratio, weather particles and global shadow map are not yet dynamically governed.
- Orchard harvest/runtime logic still needs full consistency with season-specific visible fruit readiness.
- Current world persistence is local-device; six-player shared cloud persistence is not implemented.

## NEXT
1. Observe syntax-check and latest Pages runs; fix any failure before adding more runtime code.
2. Make wildlife idle/eat/drink/rest animation species-specific and keep locomotion/facing foot-safe.
3. Apply adaptive performance budget to renderer pixel ratio, weather particles and global shadows without altering saved content.
4. Fix orchard harvest so only visibly fruit-ready trees can be harvested, including orange winter behavior.
5. Continue character hair/clothing/shoe/face refinement and animal anatomy refinement.
6. Continue camera collision and mobile performance tuning.
7. Only after a stable concentrated checkpoint, request iPhone real-device validation.
