# AG Cute Blocks TEST V0.5.206 immutable Apps Script package

Release: AGCB-AS-V05206-ASSET-BRIDGE-20260924
Commit pin: 8706cae2790c76deab41887e17c0d55cf568c36a
Deployment target: existing TEST Web App only

Files deployed:
- Code / SERVER_JS -> Code.gs
- DeployRunner / SERVER_JS -> DeployRunner.gs
- appsscript / JSON -> appsscript.json

Intent:
- Preserve existing TEST BACKUP, READBACK, LIST_HISTORY behavior.
- Add allowlisted READ_ASSET for boy005.
- Preserve P3.4 self-deploy runner exactly from live baseline.
- Preserve manifest exactly from live baseline.
- Do not include temporary AGCB_OneTime_SourceExport helper in deployed content.
- PROD read/write, restore, delete remain disabled.

Runtime acceptance:
- AGCB_DEPLOY_LAST_RELEASE = AGCB-AS-V05206-ASSET-BRIDGE-20260924
- AGCB_DEPLOY_LAST_VERSION > 6
- AGCB_DEPLOY_LAST_ERROR is blank
- Web App doGet reports version 0.5.206 and assetReadEnabled=true
