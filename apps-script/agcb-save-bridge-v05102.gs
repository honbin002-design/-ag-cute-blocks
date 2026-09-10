// AG Cute Blocks V0.5.102 — TEST-only Google Apps Script Drive backup endpoint.
// PROD write, restore and delete are intentionally disabled in this milestone.
const AGCB_VERSION='0.5.102';
const AGCB_PROJECT='AG Cute Blocks';
const AGCB_CONTRACT='AG_CUTE_BLOCKS_DRIVE_BACKUP_V1';
const AGCB_FORMAT='AG_CUTE_BLOCKS_SAVE_ENVELOPE';
const AGCB_TEST_FOLDER_ID='1XTOj_YbpfehI4hIjhaKBPw3oI_L3HEpZ';
const AGCB_PROD_FOLDER_ID='19YNP7hM7O0XevxiCvLsuiy65woggBs3R';
const AGCB_TEST_PATH='AG Cute Blocks/SAVE/TEST';
const AGCB_PROD_PATH='AG Cute Blocks/SAVE/PROD';
const AGCB_TEST_WRITE_ENABLED=true;
const AGCB_PROD_WRITE_ENABLED=false;
const AGCB_TOKEN_PROPERTY='AGCB_BRIDGE_TOKEN';

function agcbJson_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)}
function doGet(){return agcbJson_({ok:true,project:AGCB_PROJECT,version:AGCB_VERSION,status:'TEST_BRIDGE_READY',prodWriteEnabled:false,restoreEnabled:false})}
function agcbFail_(reason){return{ok:false,reason:String(reason||'rejected')}}
function agcbToken_(){return String(PropertiesService.getScriptProperties().getProperty(AGCB_TOKEN_PROPERTY)||'')}
function agcbAuth_(payload){const expected=agcbToken_();if(expected.length<32)throw new Error('server-token-not-configured');if(String(payload&&payload.authToken||'')!==expected)throw new Error('unauthorized')}
function agcbCanonical_(b){return JSON.stringify({project:b.project,format:b.format,schema:b.schema,saveSchema:b.saveSchema,environment:b.environment,gameVersion:b.gameVersion,createdAt:b.createdAt,source:b.source,requiredKeys:b.requiredKeys,missingRequired:b.missingRequired,records:b.records})}
function agcbSha256_(text){const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(text),Utilities.Charset.UTF_8);return bytes.map(function(b){const n=(b<0?b+256:b);return('0'+n.toString(16)).slice(-2)}).join('')}
function agcbValidateEnvelope_(bundle,env){if(!bundle||bundle.project!==AGCB_PROJECT||bundle.format!==AGCB_FORMAT)throw new Error('invalid-save-envelope');if(String(bundle.environment||'').toUpperCase()!==env)throw new Error('envelope-environment-mismatch');if(!bundle.integrity||bundle.integrity.algorithm!=='SHA-256'||!bundle.integrity.sha256)throw new Error('integrity-missing');const actual=agcbSha256_(agcbCanonical_(bundle));if(actual!==bundle.integrity.sha256)throw new Error('integrity-mismatch');return actual}
function agcbSafeFileName_(name,env){const value=String(name||'');if(!value||value.indexOf('/')>=0||value.indexOf('\\')>=0||!value.endsWith('.json'))throw new Error('invalid-file-name');if(value.indexOf(AGCB_PROJECT+'_'+env+'_')!==0)throw new Error('file-name-environment-mismatch');return value}
function agcbFolderContains_(folder,file){const parents=file.getParents();while(parents.hasNext())if(parents.next().getId()===folder.getId())return true;return false}
function agcbBackup_(payload){const request=payload.request||{};if(request.contract!==AGCB_CONTRACT||request.project!==AGCB_PROJECT)throw new Error('invalid-contract');const env=String(request.environment||'').toUpperCase();if(env!=='TEST')throw new Error(env==='PROD'?'prod-write-disabled':'invalid-save-environment');if(!AGCB_TEST_WRITE_ENABLED||AGCB_PROD_WRITE_ENABLED)throw new Error('unsafe-server-write-policy');if(request.destinationPath!==AGCB_TEST_PATH)throw new Error('destination-path-mismatch');if(['LATEST','HISTORY','PRE_UPDATE'].indexOf(String(request.role||''))<0)throw new Error('invalid-backup-role');const name=agcbSafeFileName_(request.fileName,env);const sha=agcbValidateEnvelope_(request.envelope,env);const folder=DriveApp.getFolderById(AGCB_TEST_FOLDER_ID);const file=folder.createFile(name,JSON.stringify(request.envelope),MimeType.PLAIN_TEXT);try{const saved=JSON.parse(file.getBlob().getDataAsString('UTF-8'));const readSha=agcbValidateEnvelope_(saved,'TEST');if(readSha!==sha)throw new Error('remote-sha256-mismatch');return{ok:true,fileId:file.getId(),receiptId:file.getId(),environment:'TEST',sha256:sha}}catch(err){file.setTrashed(true);throw err}}
function agcbReadback_(payload){const env=String(payload.environment||'').toUpperCase();if(env!=='TEST')throw new Error(env==='PROD'?'prod-read-disabled':'invalid-save-environment');const id=String(payload.fileId||payload.receiptId||'');if(!id)throw new Error('file-id-required');const folder=DriveApp.getFolderById(AGCB_TEST_FOLDER_ID);const file=DriveApp.getFileById(id);if(!agcbFolderContains_(folder,file))throw new Error('file-outside-test-folder');const envelope=JSON.parse(file.getBlob().getDataAsString('UTF-8'));const sha=agcbValidateEnvelope_(envelope,'TEST');return{ok:true,fileId:id,receiptId:id,environment:'TEST',sha256:sha,envelope:envelope}}
function doPost(e){try{const payload=JSON.parse(String(e&&e.postData&&e.postData.contents||'{}'));agcbAuth_(payload);const action=String(payload.action||'').toUpperCase();if(action==='BACKUP')return agcbJson_(agcbBackup_(payload));if(action==='READBACK')return agcbJson_(agcbReadback_(payload));return agcbJson_(agcbFail_('unsupported-action'))}catch(err){return agcbJson_(agcbFail_(err&&err.message||err))}}
