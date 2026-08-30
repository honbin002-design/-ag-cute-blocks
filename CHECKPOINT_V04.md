# AG Cute Blocks — V0.4 Integrated Checkpoint

Date: 2026-08-30
Branch: `dev-v0.1`

## Integrated in the active V0.4 runtime
- Rounded child avatars with visible face, hair, clothes and alternating arm/leg gait.
- Dog and cat models with species-specific silhouettes, legs and tail motion.
- Ranch animals: chicken, cow and sheep with recognizable bodies and leg gait while wandering.
- Recognizable crop models for carrot, corn, pumpkin, tomato, strawberry, cabbage and potato.
- Crop visual growth stages advance with world days; rain gives a gentle growth bonus.
- Orchard models: apple, orange and peach trees with fruit and seasonal crown changes.
- Primitive building expanded with slope and roof pieces.
- Architecture objects now include doors and windows alongside fences.
- Gentle economy foundation is persistent; shipping-box object is available in the world catalogue.
- V0.3 save migration remains supported, including existing furniture and appliances.
- PWA cache upgraded to V0.4 module set so Home Screen installations can receive the new runtime.

## Explicitly not complete yet
- Harvest interaction, inventory, putting harvested goods into the shipping box, settlement animation and shop UI are not yet wired end-to-end.
- Crop watering/harvest interaction needs dedicated child-friendly controls rather than relying only on passive day growth.
- Orchard trees need fuller blossom/fruit lifecycle and harvesting interaction.
- Animal idle/eat/sleep/pet interactions need additional animation states.
- Third-person camera wall avoidance still needs improvement.
- Multiplayer/shared cloud persistence is not implemented.
- V0.4 still requires real-device runtime validation before PASS.

## NEXT
1. Add a dedicated interact/action control without crowding the mobile HUD.
2. Wire harvest -> inventory -> shipping box -> coin settlement -> shop purchase end-to-end.
3. Add crop watering feedback and mature/harvest feedback.
4. Add animal idle/eat/sleep/pet states and improve foot-contact timing.
5. Add orchard blossom/fruit/harvest states.
6. Improve third-person camera collision.
7. Continue catalogue expansion and mobile performance tuning.
