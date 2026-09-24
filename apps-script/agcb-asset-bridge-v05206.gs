// AG Cute Blocks V0.5.206 — TEST-only, allowlisted, read-only GLB asset bridge.
// Derived incrementally from historical V0.5.103 Bridge auth policy.
// Does NOT enable PROD read/write, restore, delete, arbitrary Drive reads, or token disclosure.
const AGCB_ASSET_VERSION='0.5.206';
const AGCB_ASSET_PROJECT='AG Cute Blocks';
const AGCB_ASSET_TOKEN_PROPERTY='AGCB_BRIDGE_TOKEN';
const AGCB_ASSET_FIXTURES=Object.freeze({
  'boy005':'1PumNgfL_cr12kG9wIBwu_XKUaOgAIpt9'
});
function agcbAssetJson_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)}
function agcbAssetFail_(reason){return{ok:false,reason:String(reason||'rejected')}}
function agcbAssetToken_(){return String(PropertiesService.getScriptProperties().getProperty(AGCB_ASSET_TOKEN_PROPERTY)||'')}
function agcbAssetAuth_(payload){const expected=agcbAssetToken_();if(expected.length<32)throw new Error('server-token-not-configured');if(String(payload&&payload.authToken||'')!==expected)throw new Error('unauthorized')}
function agcbAssetSha256Bytes_(bytes){const digest=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,bytes);return digest.map(function(b){const n=b<0?b+256:b;return('0'+n.toString(16)).slice(-2)}).join('')}
function agcbAssetRead_(payload){
  const key=String(payload.assetKey||'');
  const fileId=AGCB_ASSET_FIXTURES[key];
  if(!fileId)throw new Error('asset-not-allowlisted');
  const file=DriveApp.getFileById(fileId);
  if(file.getMimeType()!=='model/gltf-binary'&&!/\.glb$/i.test(file.getName()))throw new Error('asset-mime-mismatch');
  const blob=file.getBlob();
  const bytes=blob.getBytes();
  if(!bytes||bytes.length<20)throw new Error('asset-empty');
  const base64=Utilities.base64Encode(bytes);
  return{ok:true,environment:'TEST',assetKey:key,fileName:file.getName(),mimeType:'model/gltf-binary',size:bytes.length,sha256:agcbAssetSha256Bytes_(bytes),encoding:'base64',data:base64};
}
function agcbAssetDoPost_(e){try{const payload=JSON.parse(String(e&&e.postData&&e.postData.contents||'{}'));agcbAssetAuth_(payload);if(String(payload.action||'').toUpperCase()!=='READ_ASSET')return agcbAssetJson_(agcbAssetFail_('unsupported-action'));return agcbAssetJson_(agcbAssetRead_(payload))}catch(err){return agcbAssetJson_(agcbAssetFail_(err&&err.message||err))}}
// Integration note: in the existing TEST Bridge doPost, route READ_ASSET to agcbAssetRead_(payload)
// after the existing agcbAuth_(payload) check. Keep BACKUP/READBACK unchanged.
function agcbAssetPreflight_(){
  const token=agcbAssetToken_();
  const f=DriveApp.getFileById(AGCB_ASSET_FIXTURES.boy005);
  const b=f.getBlob();
  return{ok:token.length>=32,project:AGCB_ASSET_PROJECT,version:AGCB_ASSET_VERSION,environment:'TEST',tokenConfigured:token.length>=32,assetKey:'boy005',fileId:AGCB_ASSET_FIXTURES.boy005,fileName:f.getName(),mimeType:f.getMimeType(),size:b.getBytes().length,prodReadEnabled:false,prodWriteEnabled:false,restoreEnabled:false,deleteEnabled:false,arbitraryFileIdReadEnabled:false};
}
