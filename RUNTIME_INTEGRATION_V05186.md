# AG Cute Blocks — Runtime Integration V0.5.186

Status: TEST / isolated candidate

## Proven upstream evidence
- V0.5.185 adult male/female textured visual gate: PASS.
- Required animation states: Idle, Walk, Jog, Jump.

## Integration contract
V0.5.186 may replace only adult male/female visual animation presentation. It must not alter:
- joystick / multitouch input
- heading and movement direction
- movement speed calculation
- jump physics / collision
- camera modes
- building placement/removal/rotation
- life systems or multiplayer state
- child character variants

## Adapter behaviour
`runtime-character-integration-v05186.js` maps existing gameplay motion facts to animation states only:
- airborne => Jump
- stopped => Idle
- moving normally => Walk
- run enabled / high normalized speed => Jog

If GLTF/root/clips are unavailable, adapter enters `fallback` mode and delegates to the existing character runtime. This prevents an asset-loading failure from breaking gameplay.

## Promotion gate
Do not promote to PROD merely because this adapter exists. Candidate must pass syntax/static contract checks and then an actual game-runtime integration check. Final iPhone validation remains required before PROD promotion.
