// AG Cute Blocks V0.4.90 — resilient character asset fetch layer.
// Applies only to same-origin character asset GET requests; gameplay/network requests are untouched.
const nativeFetch=globalThis.fetch.bind(globalThis);
const RETRY_DELAYS=[220,650];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const OFFLINE_GROUPS={
  special2:{base:'./assets/characters/special2/model.v051.b64.',count:17},
  special3:{base:'./assets/characters/special3/model.v051.b64.',count:13},
  manus5:{base:'./assets/characters/manus5/chibi_8_variants_rigged.glb.part',count:16},
  boy:{base:'./assets/characters/general/boy.v052.glb.part',count:2},
  girl:{base:'./assets/characters/general/girl.v052.glb.part',count:2}
};
const offlineReady={},verifyTimers=new Map();
const resolvedBase=g=>new URL(g.base,location.href);
function isCharacterAsset(input){
  try{
    const request=input instanceof Request?input:null;
    const method=(request?.method||'GET').toUpperCase();
    if(method!=='GET')return false;
    const url=new URL(request?.url||String(input),location.href);
    return url.origin===location.origin&&url.pathname.includes('/assets/characters/');
  }catch{return false}
}
function groupFor(input){
  try{
    const url=new URL(input instanceof Request?input.url:String(input),location.href);
    return Object.entries(OFFLINE_GROUPS).find(([,g])=>url.origin===location.origin&&url.pathname.startsWith(resolvedBase(g).pathname))?.[0]||null;
  }catch{return null}
}
async function verifyOfflineGroup(key){
  const group=OFFLINE_GROUPS[key];if(!group||!('caches'in globalThis))return false;
  const checks=await Promise.all(Array.from({length:group.count},(_,i)=>caches.match(new URL(group.base+String(i).padStart(3,'0'),location.href).href,{ignoreSearch:true})));
  const ready=checks.every(Boolean);offlineReady[key]=ready;
  globalThis.__AGCB_CHARACTER_OFFLINE_READY={version:'V0.4.90',groups:{...offlineReady},verifiedAt:Date.now()};
  return ready;
}
function scheduleOfflineVerify(input){
  const key=groupFor(input);if(!key)return;
  clearTimeout(verifyTimers.get(key));
  verifyTimers.set(key,setTimeout(()=>{verifyTimers.delete(key);verifyOfflineGroup(key).catch(()=>{})},180));
}
async function resilientFetch(input,init){
  if(!isCharacterAsset(input))return nativeFetch(input,init);
  let lastError=null,lastResponse=null;
  for(let attempt=0;attempt<=RETRY_DELAYS.length;attempt++){
    try{
      const retryInit=attempt===0?init:{...(init||{}),cache:'reload'};
      const response=await nativeFetch(input,retryInit);
      lastResponse=response;
      if(response.ok){scheduleOfflineVerify(input);return response}
      if(response.status<500&&response.status!==408&&response.status!==429)return response;
    }catch(error){
      lastError=error;
      const signal=(input instanceof Request?input.signal:init?.signal);
      if(signal?.aborted)throw error;
    }
    if(attempt<RETRY_DELAYS.length)await sleep(RETRY_DELAYS[attempt]);
  }
  if(lastResponse)return lastResponse;
  throw lastError||new Error('Character asset fetch failed after retries');
}
if(!globalThis.__AGCB_NATIVE_FETCH){
  globalThis.__AGCB_NATIVE_FETCH=nativeFetch;
  globalThis.fetch=resilientFetch;
}
globalThis.__AGCB_VERIFY_CHARACTER_OFFLINE=verifyOfflineGroup;
globalThis.__AGCB_ASSET_FETCH_RESILIENCE={version:'V0.4.90',characterOnly:true,retryCount:RETRY_DELAYS.length,cacheReloadOnRetry:true,offlineIntegrity:true,scopeAwareUrls:true};
