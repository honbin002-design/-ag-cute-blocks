# AG Cute Blocks — V0.4.5 Life / Wildlife / Orchard Checkpoint

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
- Watering state is persisted separately from the lossy base world snapshot so a reload does not silently forget today's watering.

## V0.4.5 animal life
- Cow/sheep/chicken visual states support idle / walk / eat / drink / sleep / petResponse.
- Pet dog/cat support idle / sleep / petResponse.
- Animal life runtime selects states from time/environment and is loaded by the active page.
- Sleep/rest states hold position so animals do not slide while sleeping.

## V0.4.5 wildlife + mobile LOD
- Deer/rabbit/fox have separate original models and locomotion hooks.
- Deterministic natural zones avoid the six homestead areas.
- `wildlife-live-runtime.js` instantiates wildlife into the active world through the live avatar/world bridge.
- Wildlife uses hard active-count budgets plus distance culling and full/medium/low/hidden LOD.
- Far wildlife stops high-cost animation; beyond the active distance it is hidden.
- Wildlife facing follows its actual movement vector.
- Deer, rabbit and fox now receive distinct walk / idle / eat / drink / sleep poses instead of sharing one generic idle motion.
- Rabbit hopping, deer head-lowering and fox resting are kept species-specific while remaining lightweight procedural animation.
- Creature shadow changes are traversed only when the shadow state changes.

## V0.4.5 orchard consistency
- `orchard-runtime.js` is now loaded by the active page.
- Fruit harvesting is guarded by the same visible fruit readiness supplied by `crop-models.js`; a mature-looking but season-ineligible tree can no longer silently yield invisible fruit.
- When the visual fruit-ready threshold is reached, the holder is aligned to the interaction threshold so visible ripe fruit is immediately pickable.
- Orange keeps autumn/winter fruiting behavior and receives gentle winter daily growth even though the older generic tree loop pauses trees in winter.
- Orchard growth corrections are persisted back to the local world snapshot.

## PWA / validation
- PWA cache is now `ag-cute-blocks-v045-runtime2` and explicitly includes crop care, animal life, wildlife live runtime, orchard runtime and supporting modules.
- GitHub Actions parses every root `.js` file as an ES module and validates relative named imports.
- Syntax/import checks completed successfully for the wildlife pose commit and the orchard runtime commit.
- The latest Pages deployment for cache/head `8237b7b...` was queued at the last check; do not count the latest integration as deployed PASS until that run completes.

## Explicitly not PASS yet
- Static deployment success does not prove browser runtime behavior.
- V0.4.5 still needs concentrated iPhone real-device validation before milestone PASS.
- Final character/pet/livestock/wildlife art quality is still intermediate.
- Adaptive performance governor controls wildlife budgets, but the base renderer pixel ratio and global shadow map are not yet dynamically governed.
- Weather currently has state/UI but does not yet have a full adaptive particle system worth tuning.
- Current world persistence is local-device; six-player shared cloud persistence is not implemented.

## NEXT
1. Observe syntax/import checks and latest Pages run; fix any failure before milestone validation.
2. Integrate adaptive quality into the base renderer pixel ratio and global shadow policy without changing saved world content.
3. Continue character hair/clothing/shoe/face refinement and pet/livestock/wildlife anatomy refinement.
4. Improve camera collision and cache collision bounds so movement does not allocate new Box3 objects every frame.
5. Add gentle visual weather effects with performance budgets after renderer governance is stable.
6. Only after a stable concentrated checkpoint, request iPhone real-device validation.
