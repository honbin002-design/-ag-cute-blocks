# AG Cute Blocks TEST — Last Manual Bootstrap

This is the final one-time manual bootstrap required to close the existing P3.4 self-deploy loop.

## Safety
- TEST Apps Script only.
- Do not edit Code.gs or DeployRunner.gs.
- Do not deploy a new Web App.
- Do not touch PROD.
- Add one temporary script file only.

## iPhone steps
1. Open the existing **AG Cute Blocks TEST** Apps Script project.
2. Tap **+** beside Files → **Script**.
3. Name it: `AGCB_OneTime_SourceExport`.
4. Paste the exact source from `AGCB_OneTime_SourceExport.gs` in this same folder and save.
5. From the function selector choose `AGCB_EXPORT_CURRENT_PROJECT_ONCE`.
6. Tap Run once. If Google asks for authorization, approve only the existing TEST project permissions.
7. PASS = execution completed and the log/result contains `"ok":true`, `"environment":"TEST"`, `"appsScriptWritePerformed":false`, `"deploymentChanged":false`, `"prodTouched":false`.
8. The exporter creates `AGCB_TEST_APPS_SCRIPT_BASELINE_yyyyMMdd_HHmmss.json` in the AG Drive folder.
9. Stop there. Do NOT delete the temporary helper until the baseline has been read back and committed immutably to GitHub.

After PASS, the automation work resumes from the exported baseline; no Code.gs/DeployRunner.gs screenshot transcription is needed.
