# AG Cute Blocks — CURRENT CHECKPOINT

Date: 2026-09-18
Branch: `dev-v0.1`
Runtime version: `V0.5.140`
Project folder: `AG專用`
PROJECT_FOLDER_ID: `1m7bO8WF0ilYhaRMxDi_PnS9cDl_ShSwo`
Status: `SAFE_STOP / READY_FOR_CHARACTER_TEST_RUNTIME`

## Authority
- This file remains the single GitHub Checkpoint mechanism. Do not create model-, mode-, or window-specific checkpoints.
- Google Drive `AG Cute Blocks｜CURRENT` is the single CURRENT/handoff state.
- Project-local ACTIVE behavior file is the sole day-to-day behavior authority.
- PROJECT_RULES_FILE_ID: `1zGFlGqUUedL25AcPLN29eDg05St4rpxClFSFNp9Rg8Y`.

## Locked PASS — do not rerun without a changed dependency
- V0.5.129 real two-Chromium WebRTC PASS.
- Real three-browser Host Relay PASS.
- V0.5.132 three independent Chromium world convergence PASS.
- V0.5.135 real three-browser remote-avatar + world convergence PASS.
- iPhone simultaneous movement + Jump PASS unless the input path/dependency changes.
- TEST Drive Backup/Readback/Environment isolation/SHA/History/Restore/Rollback PASS.
- Apps Script P2.3/P3/P3.1/P3.2/P3.3/P3.4 PASS.
- V0.5.137 Save Drive Server Gate PASS; the Drive CI contract repair is closed.

## Formal release scope remains locked
1. At least one acceptable adult male and one adult female formal character with normal idle/walk/run/jump/interaction.
2. Stable building + planting continuous play.
3. True 2–3 real players in the same world.

Content expansion must not block the first formal release unless the formal roadmap is explicitly changed.

## Formal character provenance — V0.5.140
Historical `05_q_adult_male.glb` / `06_q_adult_female_repaired.glb` remain TEST/HOLD. Their filenames are not provenance evidence and they must not be promoted to PROD.

Approved zero-cost replacement route: Quaternius `Universal Base Characters[Standard].zip`, exact AG-acquired archive.
- bytes: `128968391`
- SHA-256: `fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40`
- embedded `License_Standard.txt`: CC0 1.0 / public-domain dedication.
- exact inspected archive contains Superhero adult male/female bases. Do not claim Regular/Teen are present in this acquired ZIP.
- adult male and female each: 69 nodes / 3 meshes / 1 skin / 0 embedded animations.

Formal provenance record: `assets/characters/formal-cc0/PROVENANCE.md`.
V0.5.140 provenance/Drive-preservation commit: `5f6ac19e8179d9d468db7bfe4f46a195db9ce4d4`.

## AG Drive source preservation
The exact source archive exceeds the connector's single-file limit, so it is preserved as raw sequential byte parts in `AG專用`:
- part001 Drive ID: `1En1yMUwJNEVOQ9of5po7-q-vo3bXW71F`
- part002 Drive ID: `1Y7msXyMiiOAvMwXk3opTs_RsDXJo0V7I`
- part003 Drive ID: `1u3l-nIJKXbawt7ILfZPQmofUIhFHs5im`
- split manifest Drive ID: `18TmqLi0JlcZlUaV706XplXoS019Gmj8o`

Reassembly is only valid as `part001 + part002 + part003` with no transformation. Result must be exactly 128,968,391 bytes and SHA-256 `fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40` before extraction/use.

Adult source component integrity:
- Female glTF SHA-256: `adedf28000a0716f689b009a70314506fc62f827498f77ba852acb5610f3f3f4`
- Female BIN SHA-256: `3a8220a485b33d05d879115a50697728b45a151781106033afb8b8c243fca208`
- Male glTF SHA-256: `e7fcea214ecf8855afbf910b50de6f9c7d1decfb71ca28bad8a4481452dafeb4`
- Male BIN SHA-256: `459003f9745853ae562a85506a2b94dd56515c1f37728f9fa3d2ce1a3e4cd92f`

## Current gate / work method
Current node: first formal release → adult formal-character gate.
Sequence is locked to: provenance/license → exact source integrity/Drive preservation → TEST-only candidate → runtime geometry/skeleton → existing animation retarget compatibility → AG visual gate → only then consider PROD.

Adult male/female provenance and source integrity are PASS. Runtime/animation/visual gates remain PENDING. Child-role sourcing is HOLD because the acquired Standard ZIP does not prove a Teen base; child content must not be invented from product-page claims.

New Quaternius-derived candidates must remain TEST-only and `prodEligible:false` until all applicable gates pass.

## Known rejected / prohibited routes
- Do not infer Quaternius provenance from `05_q` / `06_q` filenames.
- Do not attach another asset's CC0 evidence to unknown GLBs.
- Do not claim Regular/Teen are present in the exact acquired archive.
- Do not use paid Pro/Source packages or trial-after-payment routes.
- Do not rerun unrelated locked PASS gates.
- Do not change PROD/TEST isolation or roll back to an older failure SHA.

## AGPB
AGPB `MonitorRegistry` currently identifies `AG_CUTE_BLOCKS` as `ACTIVE_READONLY`, with `FORMAL_TOUCH_ALLOWED=FALSE`. A current Directives scan found no AG Cute Blocks pending directive/TASK_ID requiring insertion into this work node. AGPB must not write into this formal character work unless authority changes.

## Safe-stop / resume
Safe stop is V0.5.140 after provenance and split-archive preservation. No new adult TEST Runtime candidate has been wired into the game yet.

Resume procedure:
1. Read project-local ACTIVE rules, Drive CURRENT, then this checkpoint.
2. Confirm `dev-v0.1` HEAD is not older than the V0.5.140 record and read `assets/characters/formal-cc0/PROVENANCE.md`.
3. Recover/reassemble the source only from the recorded Drive parts when needed and verify exact SHA before extraction.
4. Build adult male/female TEST-only candidates; do not touch PROD.
5. Validate glTF/BIN dependencies, skin/skeleton loading, then existing Idle/Walk/Run/Jump retarget compatibility.
6. Keep technical/runtime PASS separate from AG visual approval.

Rollback: if a new TEST candidate or retarget fails, remove/disable only that new TEST candidate/reference and return here. Preserve the source archive, provenance evidence, historical TEST/HOLD candidates, PROD, and all locked PASS functionality.
