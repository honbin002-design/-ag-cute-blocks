# AG Cute Blocks — V0.4.2 Integrated + V0.4.3 Art Refinement Checkpoint

Date: 2026-08-30
Branch: `dev-v0.1`

## Locked art direction
- Character direction is an original cozy farm-life chibi style: attractive, rounded, readable on mobile, with farm clothing cues. Farm-life games may be studied for broad appeal and usability, but recognizable protected character/costume/model/UI designs are not copied.
- Dog, cat, cow, sheep, chicken and future wildlife must have believable species anatomy while retaining a soft child-friendly stylization. Generic balls/boxes are not an acceptable final art bar.

## Camera and movement
- Three modes are active: First Person -> Third Person -> Farm View.
- Third Person keeps free-look while the character turns toward the actual movement vector.
- Farm View uses an elevated fixed-angle follow camera with screen-relative joystick movement.
- The former backward-walking orientation error is corrected.
- Pet/livestock heading follows actual travel direction.
- Initial third-person/farm-camera obstacle avoidance is integrated.

## V0.4.2 integrated life loop
- Dedicated context-sensitive interaction button exists.
- Mature crops can be harvested into inventory.
- Fruit trees can be harvested when fruit is seasonally ready.
- Chicken/cow/sheep products can be collected into inventory.
- Dog/cat petting interaction exists with a small affection value.
- Shipping box accepts sellable inventory and settles the next morning into coins.
- Life panel displays coins, pending shipment value, inventory and a small optional coin shop.
- Shop purchases unlock selected decorative/buildable objects in a shop catalogue.
- There is no debt, interest, login streak, daily-task pressure or required economy grind.
- V0.3/V0.4 world-save continuity remains supported.

## Crop / orchard visuals
- Distinct visual crop models exist for carrot, corn, pumpkin, tomato, strawberry, cabbage and potato.
- Growth stages visibly change plant scale/structure and mature produce.
- Apple, orange and peach trees have different leaf palettes, blossom treatment and fruit appearance.
- Fruit availability is season-aware; winter appearance differs by tree type.

## V0.4.3 art-refinement batch now committed
- Child avatar silhouette was refined with a less spherical face read, ears/nose, layered hair/fringe, farm overalls details, socks/shoes and smoother third-person proportions.
- Dog/cat models were rebuilt with clearer torso, shoulder, haunch, neck/head transitions, articulated front/hind leg structure, paws, improved muzzle/eyes/ears and multi-segment tails.
- Character/pet movement hooks now include subtler head movement, diagonal quadruped gait and ear/tail motion while preserving compatibility with the current runtime.
- Deer, rabbit and fox procedural wildlife models are now available as an original future-world module with species-specific silhouettes and locomotion hooks.
- PWA cache was bumped so Home Screen installations can receive the refined model files rather than remaining on old cached assets.

## Explicitly not PASS yet
- Final character/pet/livestock/wildlife art quality still requires real-device visual validation and further refinement.
- Watering is not yet a dedicated child-controlled interaction; rain/current growth logic still handles most crop growth.
- Animal sleep/eat/drink/rest/pet response states are not yet fully wired into the live world state machine.
- Wildlife module is not yet spawned into the active world runtime.
- Shop catalogue remains small and needs expansion.
- Multiplayer/shared cloud persistence is not implemented.
- Current integrated build still requires concentrated iPhone runtime validation before a milestone PASS.

## NEXT
1. Add optional watering interaction with clear wet/ready feedback; watering should speed growth, not become a punishing requirement.
2. Wire animal states: idle / walk / eat / drink / sleep / pet-response with species-specific movement.
3. Integrate deer/rabbit/fox into natural areas using distance/LOD limits for mobile performance.
4. Continue character hair/clothing variants and pet/livestock anatomy refinement.
5. Expand orchard lifecycle and harvesting feedback.
6. Expand optional coin shop and decorative rewards without locking core building freedom.
7. Continue third-person camera collision and mobile performance tuning.
