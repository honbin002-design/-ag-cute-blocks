# AG Cute Blocks — V0.4.4 Life Detail Checkpoint

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

## V0.4.3 furniture interaction integrated
- Chair and sofa can be sat on; beds can be lain on.
- Character snaps to a defined furniture anchor and faces the furniture-defined direction.
- Moving or jumping exits the furniture state safely.
- First-person furniture use temporarily moves to a visible-character camera and restores the previous mode after standing.
- Furniture being actively used cannot be removed until the character leaves it.
- Save snapshots deliberately do not persist a stuck seated/lying runtime state.

## V0.4.4 life detail batch now committed
- Furniture definitions now expose seat kind and supported secondary life actions: chair/dining, sofa/relax, bed/sleep, garden swing/swing.
- Character pose engine now has dedicated pose hooks for `sit`, `lie`, `sleep`, `dine` and `swing` in addition to normal locomotion.
- Lying has subtle breathing; sleep has slower breathing; dining has small arm-to-mouth motion; swing pose has gentle body/leg pendulum motion hooks.
- A bed sleep-to-morning routine is active as a separate safe layer: when lying on a bed the player can choose `睡到早上`.
- Sleep first triggers the existing world save, then advances one day to 06:00, settles pending shipping income, advances gentle crop/tree growth, restores livestock product readiness where applicable and writes the updated persistent state before reload.
- After sleeping, the saved player position is moved beside the nearest bed rather than reopening inside the bed collider.
- PWA cache is bumped to include the V0.4.4 sleep routine and revised furniture/character modules.

## Crop / animal systems already available as modules
- Crop-care module supports optional watering as a growth bonus only; rain also helps. Missing one day never kills a crop.
- Animal-state module defines idle/walk/eat/drink/sleep/pet-response selection.
- Deer/rabbit/fox wildlife models and species-specific locomotion hooks exist.

## Explicitly not PASS yet
- Final character/pet/livestock/wildlife art quality still requires real-device visual validation and further refinement.
- Dining and swing pose hooks are prepared but are not yet fully wired end-to-end into the active V0.4.4 world interaction flow.
- Crop watering module is not yet wired to the live interaction button and visible wet-soil feedback.
- Animal sleep/eat/drink/rest state module is not yet fully wired into the active world runtime.
- Wildlife is not yet spawned into natural zones in the active runtime.
- Multiplayer/shared cloud persistence is not implemented.
- V0.4.4 still requires concentrated iPhone runtime validation before milestone PASS.

## NEXT
1. Wire dining chairs near tables -> `用餐` and garden swing -> actual `swing` pose/state.
2. Wire optional watering -> wet-soil/water-drop feedback -> growth bonus.
3. Wire ranch/pet idle/eat/drink/sleep/pet-response states into active animation.
4. Spawn deer/rabbit/fox in natural zones with distance/LOD limits for mobile performance.
5. Continue character hair/clothing variants and animal anatomy refinement.
6. Expand orchard lifecycle and optional coin-shop rewards.
7. Continue third-person camera collision and mobile performance tuning.
