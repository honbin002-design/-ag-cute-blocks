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

## Furniture life interactions
- Chair and sofa can be sat on; beds can be lain on.
- Character snaps to a defined furniture anchor and faces the furniture-defined direction.
- Moving or jumping exits the furniture state safely.
- First-person furniture use temporarily moves to a visible-character camera and restores the previous mode after standing.
- Furniture being actively used cannot be removed until the character leaves it.
- Save snapshots deliberately do not persist a stuck seated/lying runtime state.
- Furniture metadata now distinguishes chair, sofa, bed and garden swing and advertises secondary life actions.

## V0.4.4 detail batch integrated
- Character pose engine supports `sit`, `lie`, `sleep`, `dine` and `swing` in addition to normal locomotion.
- Locked furniture poses now animate through the render lifecycle even while the normal walking animation loop is paused.
- Lying has subtle breathing; sleep uses slower breathing; dining uses a small arm-to-mouth motion; the garden swing uses a gentle body/leg pendulum motion.
- Chairs placed close to a table expose an optional `用餐` detail action after sitting. This is purely atmospheric and does not introduce hunger or forced meals.
- Garden swing seating switches to its own swing pose and gentle rocking motion.
- Sofa seating exposes a simple relax detail without creating a stamina requirement.
- Bed sleep-to-morning is active: while lying on a bed the player can choose `睡到早上`.
- Sleeping first invokes the existing world save, advances one day to 06:00, settles pending shipping income, advances gentle crop/tree growth, restores livestock product readiness where applicable, then writes the persistent state before reload.
- After sleeping, the saved player position is moved beside the nearest bed rather than reopening inside the bed collider.
- PWA cache now includes the sleep and furniture-life detail modules.

## Crop / animal systems already available as modules
- Crop-care module supports optional watering as a growth bonus only; rain also helps. Missing one day never kills a crop.
- Animal-state module defines idle/walk/eat/drink/sleep/pet-response selection.
- Deer/rabbit/fox wildlife models and species-specific locomotion hooks exist.

## Explicitly not PASS yet
- Final character/pet/livestock/wildlife art quality still requires real-device visual validation and further refinement.
- Dining/swing/sleep are integrated but still require real-device positioning and clipping validation before PASS.
- Crop watering module is not yet wired to the live interaction button and visible wet-soil feedback.
- Animal sleep/eat/drink/rest state module is not yet fully wired into the active world runtime.
- Wildlife is not yet spawned into natural zones in the active runtime.
- Multiplayer/shared cloud persistence is not implemented.
- V0.4.4 still requires concentrated iPhone runtime validation before milestone PASS.

## NEXT
1. Wire optional watering -> wet-soil/water-drop feedback -> growth bonus.
2. Wire ranch/pet idle/eat/drink/sleep/pet-response states into active animation.
3. Spawn deer/rabbit/fox in natural zones with distance/LOD limits for mobile performance.
4. Continue character hair/clothing variants and animal anatomy refinement.
5. Expand orchard lifecycle and optional coin-shop rewards.
6. Continue third-person camera collision and mobile performance tuning.
