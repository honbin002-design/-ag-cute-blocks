# AG Cute Blocks — Formal Character CC0 Provenance Gate

Release record: V0.5.140
Environment: TEST candidate preparation only
PROD promotion: NOT AUTHORIZED by this document alone

## Approved upstream base route

Source author: Quaternius
Pack: Universal Base Characters
Official pack page: https://quaternius.com/packs/universalbasecharacters.html
Official distribution page: https://quaternius.itch.io/universal-base-characters
License: Creative Commons Zero v1.0 Universal (CC0 1.0)
Commercial use: allowed.
Free Standard distribution: `Universal Base Characters[Standard].zip`

## Exact AG-acquired Standard archive

Acquired by AG project on: 2026-09-18
Exact filename: `Universal Base Characters[Standard].zip`
Exact byte size: 128,968,391 bytes
SHA-256: `fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40`
ZIP structure: readable; 128 entries observed.
Embedded license file: `Universal Base Characters[Standard]/License_Standard.txt`
Embedded license SHA-256: `0f4beaf0fe360a7732e58bbe3dbf60a2422367fbea60cb9ea4add968f383268e`
Embedded license explicitly states this is the standard FREE version and `CC0 1.0 Universal (CC0 1.0) / Public Domain Dedication`.

Important correction from inspecting the exact acquired archive: although the upstream pack family documentation describes additional proportions/variants, this exact free Standard ZIP contains only the Superhero male/female base-character binaries. Therefore Regular/Teen are NOT claimed as present in this acquired archive and cannot be used as AG child bases from this ZIP. Child-role sourcing remains unresolved and must use a separately provenance-proven free source or an AG-created derivative that does not invent unavailable upstream assets.

## Exact adult base files verified inside acquired ZIP

Female glTF: `Universal Base Characters[Standard]/Base Characters/Godot - UE/Superhero_Female_FullBody.gltf`
- bytes: 31,656
- SHA-256: `adedf28000a0716f689b009a70314506fc62f827498f77ba852acb5610f3f3f4`
- parsed structure: 69 nodes, 3 meshes, 1 skin, 0 embedded animations, 3 materials

Female BIN: `Universal Base Characters[Standard]/Base Characters/Godot - UE/Superhero_Female_FullBody.bin`
- bytes: 990,808
- SHA-256: `3a8220a485b33d05d879115a50697728b45a151781106033afb8b8c243fca208`

Male glTF: `Universal Base Characters[Standard]/Base Characters/Godot - UE/Superhero_Male_FullBody.gltf`
- bytes: 30,989
- SHA-256: `e7fcea214ecf8855afbf910b50de6f9c7d1decfb71ca28bad8a4481452dafeb4`
- parsed structure: 69 nodes, 3 meshes, 1 skin, 0 embedded animations, 3 materials

Male BIN: `Universal Base Characters[Standard]/Base Characters/Godot - UE/Superhero_Male_FullBody.bin`
- bytes: 720,076
- SHA-256: `459003f9745853ae562a85506a2b94dd56515c1f37728f9fa3d2ce1a3e4cd92f`

The Standard archive also contains hairstyles, textures and FBX variants. No claim is made yet that a specific hairstyle combination satisfies the AG visual gate.

## Drive preservation — split archive PASS

Because the exact 128,968,391-byte source ZIP exceeds the connector's 100 MiB single-file transfer limit, AG preserves the exact source as ordered binary parts in the project Drive folder instead of altering/recompressing the upstream archive.

PROJECT_FOLDER_ID: `1m7bO8WF0ilYhaRMxDi_PnS9cDl_ShSwo`

Stored parts:
1. `Universal_Base_Characters_Standard.zip.part001` — Drive ID `1En1yMUwJNEVOQ9of5po7-q-vo3bXW71F` — 48 MiB
2. `Universal_Base_Characters_Standard.zip.part002` — Drive ID `1Y7msXyMiiOAvMwXk3opTs_RsDXJo0V7I` — 48 MiB
3. `Universal_Base_Characters_Standard.zip.part003` — Drive ID `1u3l-nIJKXbawt7ILfZPQmofUIhFHs5im` — remaining bytes
4. `Universal_Base_Characters_Standard_SPLIT_MANIFEST.json` — Drive ID `18TmqLi0JlcZlUaV706XplXoS019Gmj8o`

Reassembly invariant: concatenate part001 + part002 + part003 in byte order, with no transformation. Reassembled byte size must equal 128,968,391 and SHA-256 must equal `fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40` before use. The split manifest records the original and per-part integrity data. Drive readback of part001 has also been confirmed, so this preservation route is readable by the connected AG workflow.

Do not treat an individual part as a ZIP archive. Always reassemble and verify the exact original SHA before extracting or deriving formal assets.

## Optional compatible animation route

Source author: Quaternius
Pack: Universal Animation Library
Official distribution page: https://quaternius.itch.io/universal-animation-library
License: CC0 1.0
Compatibility route: humanoid retargeting candidate only; exact AG animation compatibility must still be tested.
Only free Standard content may be used by the zero-cost AG route. Paid Pro/Source content is outside this project's permitted dependency path.

## AG ingestion rules

1. Historical `05_q_adult_male.glb` / `06_q_adult_female_repaired.glb` remain TEST/HOLD; do not infer provenance from filenames.
2. New formal candidates must derive from provenance-proven free assets such as the exact archive recorded above.
3. Preserve exact source path, archive SHA-256, component SHA-256, derived-asset SHA-256, role, modifications and license evidence.
4. New candidates remain TEST-only and `prodEligible:false` until source integrity, runtime geometry, animation compatibility, AG visual review and provenance gates all PASS.
5. Adult male/female compatibility is verified first.
6. Child roles are not sourced by this exact Standard archive; do not claim otherwise.
7. Do not replace existing PROD characters or remove historical test evidence during candidate preparation.
8. Do not use paid Quaternius Pro/Source packages, trials, Mixamo redistribution, or assets without permanent commercial/redistribution evidence.
9. When recovering the upstream ZIP from Drive, verify the reassembled SHA-256 before extraction; a mismatch is a hard stop.

## Gate status

- Official upstream identity: PASS
- Exact AG-acquired source archive integrity: PASS
- Embedded CC0 license evidence: PASS
- Permanent zero-cost route: PASS for this Standard archive
- Commercial-use license evidence: PASS (CC0 1.0)
- Exact adult male base integrity: PASS
- Exact adult female base integrity: PASS
- Adult humanoid skin present: PASS (1 skin each)
- Embedded adult animation availability: NONE (0 animations each; retarget/runtime animation work required)
- Raw source preservation in AG Google Drive: PASS_SPLIT_VERIFIED_READABLE
- Exact AG derived binary integrity: PENDING_BUILD
- Adult male runtime compatibility: PENDING
- Adult female runtime compatibility: PENDING
- Child male/female source route: HOLD_NOT_PRESENT_IN_ACQUIRED_STANDARD_ZIP
- AG four-role visual gate: PENDING
- PROD eligibility: HOLD

This record reflects inspection and preservation of the exact archive acquired for AG. It does not claim runtime/visual approval or PROD promotion.