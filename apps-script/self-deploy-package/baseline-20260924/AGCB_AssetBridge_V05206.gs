// AG Cute Blocks V0.5.206 — TEST-only Asset Bridge incremental module
// Add as a NEW .gs file in existing "AG Cute Blocks TEST". Do NOT replace Code.gs.
const AGCB_ASSET_BRIDGE_VERSION='0.5.206';
const AGCB_ASSET_FIXTURES_V05206=Object.freeze({boy005:'1PumNgfL_cr12kG9wIBwu_XKUaOgAIpt9'});

function agcbAssetSha256BytesV05206_(bytes){
  const d=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,bytes);
  return d.map(function(b){const n=b<0?b+256:b;return('0'+n.toString(16)).slice(-2)}).join('');
}

function agcbReadAssetV05206_(payload){
  const key=String((payload&&payload.assetKey)||'');
  const fileId=AGCB_ASSET_FIXTURES_V05206[key];
  if(!fileId)throw new Error('asset-not-allowlisted');
  if(Object.prototype.hasOwnProperty.call(payload||{},'fileId'))throw new Error('client-file-id-forbidden');
  const file=DriveApp.getFileById(fileId);
  const name=file.getName(), mime=file.getMimeType();
  if(mime!=='model/gltf-binary'&&!/\.glb$/i.test(name))throw new Error('asset-mime-mismatch');
  const bytes=file.getBlob().getBytes();
  if(!bytes||bytes.length<20)throw new Error('asset-empty');
  return {ok:true,environment:'TEST',assetKey:key,fileName:name,mimeType:'model/gltf-binary',
    size:bytes.length,sha256:agcbAssetSha256BytesV05206_(bytes),encoding:'base64',
    data:Utilities.base64Encode(bytes)};
}

function agcbAssetPreflight_(){
  const token=String(PropertiesService.getScriptProperties().getProperty('AGCB_BRIDGE_TOKEN')||'');
  const file=DriveApp.getFileById(AGCB_ASSET_FIXTURES_V05206.boy005);
  const bytes=file.getBlob().getBytes();
  return {ok:token.length>=32&&bytes.length>20,project:'AG Cute Blocks',
    version:AGCB_ASSET_BRIDGE_VERSION,environment:'TEST',tokenConfigured:token.length>=32,
    assetKey:'boy005',fileName:file.getName(),mimeType:file.getMimeType(),size:bytes.length,
    sha256:agcbAssetSha256BytesV05206_(bytes),prodReadEnabled:false,prodWriteEnabled:false,
    restoreEnabled:false,deleteEnabled:false,arbitraryFileIdReadEnabled:false};
}

/*
FIRST GATE:
1. Save this as a NEW script file named AGCB_AssetBridge_V05206.gs.
2. Do not replace Code.gs and do not deploy yet.
3. Select agcbAssetPreflight_ and run it once.
*/
// V05206 SAVED
function AGCB_ASSET_PREFLIGHT() {
  return agcbAssetPreflight_();
}