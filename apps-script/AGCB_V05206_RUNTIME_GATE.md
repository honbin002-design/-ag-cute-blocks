# AG Cute Blocks V0.5.206 — Apps Script Runtime Gate

Status: SAFE STOP / TEST ONLY

## Completed
- Boy 005 Drive fixture exists and is isolated from the source asset.
- V0.5.205 native 18-bone character adapter exists on TEST.
- V0.5.206 integrated TEST Save + Asset Bridge exists at `apps-script/agcb-save-bridge-v05206-test.gs`.
- `READ_ASSET` accepts only `assetKey=boy005`; client-supplied `fileId` is rejected.
- PROD read/write, restore, delete, and arbitrary Drive file reads remain disabled.

## Exact next runtime gate
Use the EXISTING AG TEST Apps Script project. Do not create a second project and do not touch PROD.

1. Replace/update the TEST server source with `apps-script/agcb-save-bridge-v05206-test.gs`.
2. Run editor-only `agcbSetupTestBridge_()` if the existing `AGCB_BRIDGE_TOKEN` is not already configured. Do not rotate a valid existing token.
3. Run `agcbAssetPreflight_()`.
4. PASS requires all of:
   - `ok === true`
   - `environment === "TEST"`
   - `tokenConfigured === true`
   - `assetKey === "boy005"`
   - `size > 20`
   - `mimeType` identifies the GLB
   - `prodReadEnabled === false`
   - `prodWriteEnabled === false`
   - `restoreEnabled === false`
   - `deleteEnabled === false`
   - `arbitraryFileIdReadEnabled === false`
5. Only after preflight PASS, deploy/update the existing TEST Web App deployment and POST `READ_ASSET` with the existing token and `assetKey=boy005`.
6. Verify returned SHA-256 and size match the preflight result before handing bytes to V0.5.205 adapter.
7. Then run Cute Boy Idle / Walk / Run / Jump WebGL visual capture.

## Fail-closed rules
- Any PROD access => FAIL/HOLD.
- Any arbitrary client Drive File ID => FAIL/HOLD.
- Missing/short token => FAIL/HOLD.
- Asset SHA/size mismatch => FAIL/HOLD.
- Do not promote to PROD based on CI/static success.

## Tool-state note
At the 2026-09-23 safe stop, the available Google Drive connector does not expose Apps Script project source update, function execution, or Web App deployment actions. Plugin-directory search also found no separate Apps Script execution connector. Therefore Apps Script runtime PASS has NOT been claimed.


## Self-deploy capability update — 2026-09-24
- Existing TEST Apps Script contains P3.4 self-deploy runner; do not create a second runner or second Apps Script project.
- Runner has Apps Script API content write/readback, version creation, existing deployment update/confirmation, immutable commit pinning, rollback/version checks, and TEST-only validation.
- The earlier Tool-state note above is historical and MUST NOT be used to force manual deployment.
- GitHub control file remains intentionally UNARMED until a lossless complete Apps Script project package is preserved.
- Apps Script projects.updateContent replaces the complete project file set. Never arm a package that omits the live DeployRunner.gs or manifest.
- PROD remains out of scope and disabled.

### Current exact gate
Preserve/export the live TEST project content losslessly (Code.gs, DeployRunner.gs, appsscript.json, and any required project files), commit that immutable package, then create the P3.4 control pinned to that commit. Do not reconstruct DeployRunner.gs from screenshots when a lossless source path is available.
