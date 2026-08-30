# AG Cute Blocks — V0.4.4 Life Detail + Runtime Systems Checkpoint

Date: 2026-08-30
Branch: `dev-v0.1`

## Locked art direction
- Character direction remains an original cozy farm-life chibi style: attractive, rounded and readable on mobile, with farm-life clothing cues without copying protected character/costume/model/UI designs from another game.
- Dog, cat, cow, sheep, chicken and wildlife must have believable species anatomy while staying soft and child-friendly. Generic balls/boxes are not an acceptable final art bar.

## Camera and movement
- Three modes remain active: First Person -> Third Person -> Farm View.
- Third Person and Farm View turn the visible character toward the actual movement vector.
- Initial camera obstacle avoidance remains integrated.

## Integrated life loop retained
- Context-sensitive interaction button.
- Crop/fruit harvesting into inventory.
- Chicken/cow/sheep product collection.
- Dog/cat petting and affection value.
- Shipping box -> next-morning coin settlement.
- Optional coin shop with no debt, login streaks, daily-task pressure or required grind.
- V0.3/V0.4 save continuity remains supported.

## Furniture and sleep life details
- Chair and sofa can be sat on; beds can be lain on.
- Character snaps to a defined furniture anchor and faces the furniture-defined direction.
- Moving or jumping exits the furniture state safely.
- First-person furniture use temporarily moves to a visible-character camera and restores the previous mode after standing.
- Furniture being actively used cannot be removed until the character leaves it.
- Save snapshots deliberately do not persist a stuck seated/lying runtime state.
- Dining-chair, sofa-relax and garden-swing secondary actions are connected through the furniture life layer.
- Bed sleep-to-morning routine saves first, advances to 06:00 next day, settles shipping, advances gentle crops/trees/livestock readiness and places the player safely beside the bed after reload.
- Character pose engine supports `sit`, `lie`, `sleep`, `dine`, `swing` with locked-pose micro-animation.

## Crop / orchard systems
- Distinct crop models exist for carrot, corn, pumpkin, tomato, strawberry, cabbage and potato.
- Apple, orange and peach trees have different palettes/blossom/fruit behavior.
- Crop-care module supports optional watering as a growth bonus only; rain also helps. Missing one day never kills a crop.

## Livestock visual-state batch now committed
- Cow/sheep/chicken model animation now has explicit visual states for `idle`, `walk`, `eat`, `drink`, `sleep`, and `petResponse`.
- Sleep lowers body/head and folds legs instead of freezing a standing animal.
- Eat/drink lower the head with species-specific motion; chicken peck cadence remains distinct.
- Pet response gives a small head/body response; tail/wing behavior remains species-specific.
- Backward compatibility is preserved: before the live state selector is wired, current runtime movement speed still automatically selects the walk animation rather than accidentally freezing livestock.

## Wildlife runtime + mobile performance batch now committed
- `wildlife-runtime-system.js` defines deterministic natural zones, species preferences, roaming radius, player-avoidance behavior and a hard active-world budget.
- First wildlife set remains deer/rabbit/fox with separate model silhouettes and locomotion hooks.
- Wildlife LOD now has full / medium / low / hidden distance bands so far-away wildlife does not keep full animation cost on phones.
- `mobile-performance-system.js` adds an adaptive quality governor that can step between high / normal / low budgets from measured frame time without altering saved world content.
- Performance budgets cover pixel ratio, shadow size, wildlife count, creature animation/cull distance, weather-particle count and update stride.
- PWA cache now includes wildlife runtime and mobile performance modules.

## Explicitly not PASS yet
- Final character/pet/livestock/wildlife art quality still requires real-device visual validation and further refinement.
- Crop watering module is not yet wired to the live interaction button and true in-world wet-soil/water-drop feedback.
- Animal state selector exists and livestock visual state poses exist, but the active `app-v043.js` world loop still has to feed actual `eat/drink/sleep/petResponse` states into those model hooks.
- Wildlife spawn/LOD runtime exists as a module but deer/rabbit/fox are not yet instantiated in the active world scene.
- Adaptive performance governor exists as a module but the active renderer has not yet adopted its budgets.
- Multiplayer/shared cloud persistence is not implemented.
- V0.4.4 still requires concentrated iPhone runtime validation before milestone PASS.

## NEXT
1. Expose a small runtime bridge from the active world loop so care/animal/wildlife modules can be wired without rewriting unrelated gameplay code.
2. Wire optional watering -> crop care state -> visible wet-soil/water-drop feedback -> daily growth bonus.
3. Feed animal-state selection into cow/sheep/chicken animations and add pet sleep/rest/response states.
4. Instantiate deer/rabbit/fox in deterministic natural zones using wildlife LOD and hard active-count limits.
5. Apply adaptive performance budgets to pixel ratio, particles, shadows and creature update cadence.
6. Continue character hair/clothing variants and animal anatomy refinement.
7. Continue third-person camera collision and mobile performance tuning.
