// AG Cute Blocks V0.5.207 — Boy005 Asset Bridge loader (TEST ONLY / PROD HOLD)
import {createFromUrl} from './ag-cute-character-adapter-v05205.js';

const VERSION='V0.5.207';
const ASSET_KEY='boy005';
const ENDPOINT_KEY='AGCB_TEST_ASSET_BRIDGE_URL';
const TOKEN_KEY='AGCB_TEST_ASSET_BRIDGE_TOKEN';

function cfg(){
  const c=globalThis.__AGCB_TEST_ASSET_BRIDGE||{};
  return {endpoint:String(c.endpoint||sessionStorage.getItem(ENDPOINT_KEY)||''),token:String(c.token||sessionStorage.getItem(TOKEN_KEY)||'')};
}
function decodeBase64(s){
  const raw=atob(s),bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
  return bytes;
}
async function sha256Hex(bytes){
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function fetchBoy005(){
  const {endpoint,token}=cfg();
  if(!/^https:\/\/script\.google\.com\/macros\/s\//.test(endpoint)) throw new Error('AGCB TEST bridge endpoint missing');
  if(token.length<32) throw new Error('AGCB TEST bridge token missing');
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({token,action:'READ_ASSET',payload:{environment:'TEST',assetKey:ASSET_KEY}}),redirect:'follow',cache:'no-store'});
  if(!response.ok) throw new Error('AGCB READ_ASSET HTTP '+response.status);
  const result=await response.json();
  if(!result?.ok||result.environment!=='TEST'||result.assetKey!==ASSET_KEY||result.encoding!=='base64'||typeof result.data!=='string') throw new Error('AGCB READ_ASSET invalid response');
  const bytes=decodeBase64(result.data);
  if(bytes.byteLength!==Number(result.size)||bytes.byteLength<20) throw new Error('AGCB Boy005 size mismatch');
  const digest=await sha256Hex(bytes);
  if(digest!==String(result.sha256||'').toLowerCase()) throw new Error('AGCB Boy005 SHA-256 mismatch');
  return {bytes,digest,fileName:result.fileName||'boy005.glb',mimeType:result.mimeType||'model/gltf-binary'};
}
async function createBoy005(options={}){
  const asset=await fetchBoy005(),blob=new Blob([asset.bytes],{type:asset.mimeType}),url=URL.createObjectURL(blob);
  try{
    const character=await createFromUrl(url,{...options,label:'Boy005'});
    return {...character,assetKey:ASSET_KEY,assetSha256:asset.digest,assetSize:asset.bytes.byteLength,source:'AGCB_TEST_ASSET_BRIDGE'};
  }finally{URL.revokeObjectURL(url)}
}
globalThis.__AGCB_BOY005_BRIDGE={version:207,release:VERSION,status:'TEST_READY',assetKey:ASSET_KEY,prodEnabled:false,arbitraryFileIdEnabled:false,fetchBoy005,createBoy005};
export {fetchBoy005,createBoy005};
