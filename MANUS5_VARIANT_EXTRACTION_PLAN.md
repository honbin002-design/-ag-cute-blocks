# Manus5 Per-Variant Extraction Feasibility

Generated: 2026-09-09T01:07:54.241401+00:00

> Analysis only. No runtime activation and no replacement of the current v052 characters.

- Source bundle: 59.31 MiB
- Shared skeleton: 49 joints (from candidate baseline)
- Shared animation clips: Idle_Breathing, Wave, Walk_Cycle
- Missing production locomotion: Run, Jump

## Variant containers

| Variant | Descendant nodes | Meshes | Materials | Approx referenced geometry bytes | Mesh parts |
|---|---:|---:|---:|---:|---|
| CHARACTER_01_01_Ruby_Ranger | 6 | 6 | 6 | 21436616 | 01_Ruby_Ranger__body_base, 01_Ruby_Ranger__head_hair, 01_Ruby_Ranger__top_outfit, 01_Ruby_Ranger__arms_outfit, 01_Ruby_Ranger__bottom_outfit, 01_Ruby_Ranger__shoes |
| CHARACTER_02_02_Emerald_Alchemist | 6 | 6 | 6 | 21436616 | 02_Emerald_Alchemist__body_base, 02_Emerald_Alchemist__head_hair, 02_Emerald_Alchemist__top_outfit, 02_Emerald_Alchemist__arms_outfit, 02_Emerald_Alchemist__bottom_outfit, 02_Emerald_Alchemist__shoes |
| CHARACTER_03_03_Azure_Mage | 6 | 6 | 6 | 21436616 | 03_Azure_Mage__body_base, 03_Azure_Mage__head_hair, 03_Azure_Mage__top_outfit, 03_Azure_Mage__arms_outfit, 03_Azure_Mage__bottom_outfit, 03_Azure_Mage__shoes |
| CHARACTER_04_04_Sunlit_Knight | 6 | 6 | 6 | 21436616 | 04_Sunlit_Knight__body_base, 04_Sunlit_Knight__head_hair, 04_Sunlit_Knight__top_outfit, 04_Sunlit_Knight__arms_outfit, 04_Sunlit_Knight__bottom_outfit, 04_Sunlit_Knight__shoes |
| CHARACTER_05_05_Violet_Rogue | 6 | 6 | 6 | 21436616 | 05_Violet_Rogue__body_base, 05_Violet_Rogue__head_hair, 05_Violet_Rogue__top_outfit, 05_Violet_Rogue__arms_outfit, 05_Violet_Rogue__bottom_outfit, 05_Violet_Rogue__shoes |
| CHARACTER_06_06_Rose_Healer | 6 | 6 | 6 | 21436616 | 06_Rose_Healer__body_base, 06_Rose_Healer__head_hair, 06_Rose_Healer__top_outfit, 06_Rose_Healer__arms_outfit, 06_Rose_Healer__bottom_outfit, 06_Rose_Healer__shoes |
| CHARACTER_07_07_Obsidian_Guard | 6 | 6 | 6 | 21436616 | 07_Obsidian_Guard__body_base, 07_Obsidian_Guard__head_hair, 07_Obsidian_Guard__top_outfit, 07_Obsidian_Guard__arms_outfit, 07_Obsidian_Guard__bottom_outfit, 07_Obsidian_Guard__shoes |
| CHARACTER_08_08_Ivory_Sage | 6 | 6 | 6 | 21436616 | 08_Ivory_Sage__body_base, 08_Ivory_Sage__head_hair, 08_Ivory_Sage__top_outfit, 08_Ivory_Sage__arms_outfit, 08_Ivory_Sage__bottom_outfit, 08_Ivory_Sage__shoes |

## Separation assessment

EXTRACTION STRUCTURE: GOOD

- Exactly 8 named top-level character containers were found.
- Their character mesh sets do not overlap, so per-variant visual extraction is structurally clean.
- All variants can continue to reference the one shared 49-joint skeleton and a shared animation library.
- Do not ship the original 59.31 MiB showcase bundle to iPhone runtime. Build per-variant files and deduplicate/shared-compress textures/animations instead.

## Production recommendation

1. Preserve current V0.5.88 runtime and v052 characters as rollback.
2. Extract one Manus5 variant first as a candidate, not all eight at once.
3. Retarget or add Run and Jump to the shared 49-joint rig before gameplay promotion.
4. Measure the extracted candidate size and iPhone load/memory behavior.
5. Only after one variant passes visual + locomotion + mobile performance validation should the remaining seven be batch-extracted.

FINAL CHARACTER ART: NOT CLAIMED.
