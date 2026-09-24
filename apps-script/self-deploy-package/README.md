# AG Cute Blocks Apps Script Self-Deploy Package

Status: PREPARED / NOT ARMED
Environment: TEST only
Runner: P3.4 RAW_CONTROL_IMMUTABLE_CDN

Safety gate:
- Do not create or publish agcb-self-deploy-control.json until the complete current Apps Script project package is preserved.
- PUT /projects/{scriptId}/content replaces the complete Apps Script project.
- Required preserved files include Code.gs, DeployRunner.gs, and appsscript.json.
- PROD read/write, restore, and delete remain disabled.

Current target:
- V0.5.206 integrated TEST bridge source: apps-script/agcb-save-bridge-v05206-test.gs
- Existing TEST deployment is preserved.
- No PROD deployment is permitted.

Reason control is intentionally absent:
The current DeployRunner.gs exists only in the live Apps Script project and must be exported losslessly before an immutable deployment package is armed.
