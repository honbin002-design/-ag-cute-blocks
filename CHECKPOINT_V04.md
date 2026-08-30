# AG Cute Blocks — V0.4.1 Integrated Checkpoint

Date: 2026-08-30
Branch: `dev-v0.1`

## Art direction correction
- Character direction is now an original cozy farm-life chibi style: attractive, rounded, readable on mobile, with farm clothing cues. It may use the general appeal of farm-life games as a gameplay/art-direction reference, but must not copy any recognizable character, costume, model, UI or protected visual design from Story of Seasons / Harvest Moon or another game.
- Dog, cat, cow, sheep and chicken are being pushed toward believable animal anatomy while retaining a soft child-friendly stylization. Species must be immediately recognizable and must not look like generic balls/boxes.

## Camera and movement modes
- Camera control is now three-mode: First Person -> Third Person -> Farm View.
- Third Person: free look remains available; the visible character turns toward the actual movement vector.
- Farm View: elevated fixed-angle follow camera with screen-relative joystick movement; the character turns toward the actual movement vector.
- The previous `yaw + PI` orientation error that made the avatar appear to walk backward has been removed.
- Pet and livestock heading calculations were corrected for models whose forward axis is -Z, so animals no longer intentionally travel backward while facing away from their movement.

## Integrated V0.4 foundation retained
- Recognizable crop models for carrot, corn, pumpkin, tomato, strawberry, cabbage and potato with growth stages.
- Orchard models: apple, orange and peach trees with seasonal crown changes.
- Primitive building includes slope and roof pieces; architecture includes doors/windows/fences.
- Gentle economy foundation and shipping-box object exist.
- V0.3 save migration remains supported, including furniture and appliances.
- PWA cache bumped to V0.4.1 so Home Screen installations can receive corrected controls/models without replacing the shortcut.

## Explicitly not complete yet
- Final character and animal art quality is not PASS; procedural models remain an intermediate implementation and need further visual refinement after real-device viewing.
- Harvest -> inventory -> shipping box -> settlement -> shop is not yet wired end-to-end.
- Watering/harvest interaction, orchard blossom/harvest states, animal idle/eat/sleep/pet states remain pending.
- Third-person camera wall avoidance still needs improvement.
- Multiplayer/shared cloud persistence is not implemented.
- V0.4.1 requires real-device runtime validation before PASS.

## NEXT
1. Continue character silhouette/clothing/hair refinement without copying protected game assets.
2. Continue pet/livestock anatomy, paws/hooves/faces/tails and animation refinement.
3. Add dedicated interact/action control.
4. Wire harvest -> inventory -> shipping box -> coin settlement -> shop purchase end-to-end.
5. Add watering, mature/harvest feedback and orchard blossom/fruit/harvest states.
6. Add animal idle/eat/sleep/pet states.
7. Improve third-person camera collision and mobile performance.
