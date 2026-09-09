// AG Cute Blocks V0.5.88 — one-shot source preload guard.
// Purpose: close the free normal-tree -> chop -> wood loop without changing
// natural-tree chopping, persistent stump regrowth, fruit trees, saves, or economy.
// This intercepts only the single verified app-v0504.js source fetch, then restores fetch.
const nativeFetch=globalThis.fetch.bind(globalThis);
let intercepted=false;
const TARGET="'果樹':[['appleTree','🍎','蘋果樹'],['orangeTree','🍊','橘子樹'],['tree','🌳','樹木']]";
const REPLACEMENT="'果樹':[['appleTree','🍎','蘋果樹'],['orangeTree','🍊','橘子樹']]";

globalThis.fetch=async function agTreeResourceIntegrityFetch(input,init){
  const url=typeof input==='string'?input:String(input?.url||input||'');
  if(intercepted||!/(?:^|\/)app-v0504\.js(?:[?#]|$)/.test(url))return nativeFetch(input,init);
  intercepted=true;
  try{
    const response=await nativeFetch(input,init);
    if(!response.ok)return response;
    const source=await response.text();
    const count=source.split(TARGET).length-1;
    if(count!==1)throw new Error(`V0.5.88 tree catalog signature mismatch: expected 1, got ${count}`);
    const patched=source.replace(TARGET,REPLACEMENT);
    globalThis.__AGCB_TREE_RESOURCE_INTEGRITY={version:'0.5.88',status:'FREE_NORMAL_TREE_PLACEMENT_BLOCKED',intercepted:true,naturalTreeChopPreserved:true,fruitTreesPreserved:true,noNewStorage:true};
    return new Response(patched,{status:response.status,statusText:response.statusText,headers:new Headers(response.headers)});
  }finally{
    globalThis.fetch=nativeFetch;
  }
};
