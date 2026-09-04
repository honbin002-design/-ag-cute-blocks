// AG Cute Blocks V0.4.87 — resilient character asset fetch layer.
// Applies only to same-origin character asset GET requests; gameplay/network requests are untouched.
const nativeFetch=globalThis.fetch.bind(globalThis);
const RETRY_DELAYS=[220,650];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function isCharacterAsset(input){
  try{
    const request=input instanceof Request?input:null;
    const method=(request?.method||'GET').toUpperCase();
    if(method!=='GET')return false;
    const url=new URL(request?.url||String(input),location.href);
    return url.origin===location.origin&&url.pathname.includes('/assets/characters/');
  }catch{return false}
}
async function resilientFetch(input,init){
  if(!isCharacterAsset(input))return nativeFetch(input,init);
  let lastError=null,lastResponse=null;
  for(let attempt=0;attempt<=RETRY_DELAYS.length;attempt++){
    try{
      const retryInit=attempt===0?init:{...(init||{}),cache:'reload'};
      const response=await nativeFetch(input,retryInit);
      lastResponse=response;
      if(response.ok)return response;
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
globalThis.__AGCB_ASSET_FETCH_RESILIENCE={version:'V0.4.87',characterOnly:true,retryCount:RETRY_DELAYS.length,cacheReloadOnRetry:true};
