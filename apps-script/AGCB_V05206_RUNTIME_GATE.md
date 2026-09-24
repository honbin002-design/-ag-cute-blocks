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


## Runtime deployment PASS — 2026-09-24
User-device evidence from AG Cute Blocks TEST Script Properties confirms P3.4 automated deployment completed:
- AGCB_DEPLOY_LAST_RELEASE = AGCB-AS-V05206-ASSET-BRIDGE-20260924
- AGCB_DEPLOY_LAST_VERSION = 7 (previous deployment version 6)
- AGCB_DEPLOY_LAST_ERROR = blank
- AGCB_DEPLOY_RUNNER_STATUS = NO_CHANGE after successful release application
- AGCB_DEPLOY_LAST_DEPLOYED_AT = 2026-09-24T04:52:55.390Z
- AGCB_DEPLOY_LAST_CHECK_AT = 2026-09-24T05:17:49.682Z

Verdict: V0.5.206 TEST Apps Script self-deploy runtime Gate PASS. Do not redo manual source editing/deployment for this release. PROD remains out of scope and disabled.
