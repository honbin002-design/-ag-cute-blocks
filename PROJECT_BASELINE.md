# AG Cute Blocks — Formal Product Baseline

Status: Active development baseline

## Product goal
AG Cute Blocks is a child-friendly, long-lived creative world. The primary experience is playful building, exploration, farming, pets and private family multiplayer. It is not an educational assignment and should not feel like work.

## Platforms
- iPhone / iOS PWA is required.
- Android / Chrome PWA is required.
- iPhone and Android must be able to join the same future private world.
- Zero/low recurring cost is preferred. Avoid paid APIs/servers as a hard dependency for the core game.

## World persistence
- The world is persistent. Closing the game or ending a multiplayer session must never reset normal progress.
- Buildings, placed objects, farms, trees, crops, pets, world settings and player state must survive sessions.
- World data must use stable IDs and incremental records rather than destructive full-world overwrites.
- Local autosave is required; the multiplayer phase must add a shared durable world save plus backup/restore.

## World design
- Large map, substantially larger than the original prototype.
- Natural areas: rivers, lakes, hills, forests/trees and wildlife.
- Six large private estate zones, one per player, each large enough for a luxury-sized house plus private farm/pasture/garden.
- Shared natural/public areas between estates.
- Maximum planned players per private world: 6.

## Building philosophy
The first complete edition remains child-readable and object-based. Children should be able to understand building by selecting a shape/material and placing it directly.

Base geometric pieces:
- cube
- rectangular prism
- sphere / round form
- cylinder
- triangle / triangular prism
- later: slopes, stairs and roof pieces

Materials should include original or safely licensed textures/styles such as wood grain, dark wood, stone, marble, brick, concrete, glass, tile, metal and roof materials.

A later enhanced building mode may add walls, doors, windows, automatic roofs and other polished architectural tools. Both modes should eventually coexist so players can freely mix simple blocks with refined building pieces. Existing worlds must not be invalidated by the enhanced mode.

## Characters
- Characters must not be block-shaped.
- Cute child-like original visual style.
- At minimum choose boy or girl; later add hair, clothes and other safe cosmetic choices.
- First-person and third-person camera switching is required.
- Player collision is required: no walking through walls, buildings or solid placed objects.

## Furniture and appliances
The catalogue expands toward a rich household set. Examples include chairs, tables, sofas, beds, cabinets, lighting, refrigerators, stoves, washing machines, televisions and later bathroom/kitchen/decorative items.

## Farm/life systems
The farm/life loop may learn from genre conventions but must not copy protected characters, art, maps, music, UI, names or distinctive assets from existing games.

Target systems:
- tilling/planting/watering/growth/harvest
- fruit trees
- farm animals
- pets
- fishing and gathering later
- cooking later
- relaxed progression; absence should not punish children by destroying months of work

## Seasons, weather and time
Core world systems:
- spring, summer, autumn, winter
- sunny, cloudy, rain, fog, snow; later storms if child-friendly
- day/night cycle
- visual seasonal changes
- farming and nature may react to season/weather
- weather should add atmosphere and play, not destructive punishment

## World administrator
One world administrator controls all world-level elements. Admin tools should remain understandable and visual rather than developer-like.

Planned controls include:
- current season
- current weather
- time speed / pause
- world save and backup/restore
- spawn positions
- player/estate assignment
- build permissions
- protected areas / lock important structures
- teleport players home
- future wildlife/farm growth controls

## Copyright / originality rule
- Learn from gameplay patterns, not protected expression.
- Do not copy characters, texture packs, maps, UI layouts, icons, music, sound, story, names, dialogue or recognizable proprietary designs from Minecraft, Story of Seasons / Bokujou Monogatari, or any other game.
- Use original procedural art, original assets or assets with a clearly compatible license.
- Keep AG Cute Blocks visually and mechanically identifiable as its own project.

## Development / validation policy
- Do not restart or re-collect requirements.
- Do not redo already-PASS work without a regression reason.
- Continue development autonomously in substantial batches.
- Minimize user validation interruptions; prefer integrated milestone builds over tiny check-by-check requests.
- Only stop for user action when real-device validation, authentication/account setup, or a major product decision cannot be resolved safely without the user.
- Never claim unverified multiplayer/cloud capabilities as complete.
- Keep development work off `main` until a milestone is sufficiently validated.
