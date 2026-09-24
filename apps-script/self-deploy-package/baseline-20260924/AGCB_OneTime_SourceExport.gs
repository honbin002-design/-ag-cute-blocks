/**
 * AG Cute Blocks TEST — ONE-TIME LOSSLESS SOURCE EXPORT
 * Purpose: export the CURRENT Apps Script project content to AG Drive folder.
 * Safety: READS Apps Script source only; does not update content/version/deployment.
 * Delete this helper from live TEST after the immutable baseline is captured.
 */
function AGCB_EXPORT_CURRENT_PROJECT_ONCE() {
  const PROJECT = 'AG Cute Blocks';
  const ENV = 'TEST';
  const TARGET_FOLDER_ID = '1m7bO8WF0ilYhaRMxDi_PnS9cDl_ShSwo';
  const scriptId = ScriptApp.getScriptId();
  const token = ScriptApp.getOAuthToken();
  const url = 'https://script.googleapis.com/v1/projects/' + encodeURIComponent(scriptId) + '/content';

  const res = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });

  const status = res.getResponseCode();
  const body = res.getContentText();
  if (status < 200 || status >= 300) {
    throw new Error('Apps Script source export failed HTTP ' + status + ': ' + body.slice(0, 1000));
  }

  const parsed = JSON.parse(body);
  if (!parsed || !Array.isArray(parsed.files) || !parsed.files.length) {
    throw new Error('Apps Script API returned no project files.');
  }

  const payload = {
    project: PROJECT,
    environment: ENV,
    exportedAt: new Date().toISOString(),
    scriptId: scriptId,
    fileCount: parsed.files.length,
    files: parsed.files
  };

  const name = 'AGCB_TEST_APPS_SCRIPT_BASELINE_' +
    Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyyMMdd_HHmmss') + '.json';
  const folder = DriveApp.getFolderById(TARGET_FOLDER_ID);
  const file = folder.createFile(name, JSON.stringify(payload, null, 2), MimeType.PLAIN_TEXT);

  const result = {
    ok: true,
    project: PROJECT,
    environment: ENV,
    fileName: name,
    driveFileId: file.getId(),
    fileCount: parsed.files.length,
    appsScriptWritePerformed: false,
    deploymentChanged: false,
    prodTouched: false
  };
  console.log(JSON.stringify(result));
  return result;
}