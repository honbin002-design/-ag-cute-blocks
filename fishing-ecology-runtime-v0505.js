import {chooseFish,fishRollForLegacyThreshold,getFishingWeights,fishingTimeBand,FISHING_ECOLOGY_SCHEMA} from './fishing-ecology-system.js';

// V0.5.05 additive bridge: the V0.5.04 core still owns aiming, water/range checks,
// inventory, shipping and UI. This runtime only supplies the catch roll for the one
// fishing timeout created by the current cast action.
const $=s=>document.querySelector(s);
const nativeSetTimeout=globalThis.setTimeout.bind(globalThis);
let injecting=false;

function selectedFishingRod(){const item=$('#items .item.on');return !!item&&item.textContent.includes('釣魚竿')}
function context(){const clock=($('#clock')?.textContent||'12:00').match(/(\d{1,2}):(\d{2})/),minute=clock?(Number(clock[1])*60+Number(clock[2])):720;return{season:$('#season')?.value||'spring',weather:$('#weather')?.value||'sunny',minute}}
function withEcology(delegate){if(injecting||!selectedFishingRod())return delegate();injecting=true;const ctx=context(),fish=chooseFish(ctx),roll=fishRollForLegacyThreshold(fish),originalSetTimeout=globalThis.setTimeout;let captured=false;globalThis.setTimeout=function(fn,delay,...args){const fishingDelay=Number(delay)>=850&&Number(delay)<=2200;if(!captured&&fishingDelay&&typeof fn==='function'){captured=true;return nativeSetTimeout(function(...cbArgs){const originalRandom=Math.random;let first=true;Math.random=function(){if(first){first=false;return roll}return originalRandom()};try{return fn(...cbArgs)}finally{Math.random=originalRandom}},delay,...args)}return nativeSetTimeout(fn,delay,...args)};try{return delegate()}finally{globalThis.setTimeout=originalSetTimeout;injecting=false}}

const add=$('#add');if(add&&typeof add.onclick==='function'){const original=add.onclick;add.onclick=function(...args){return withEcology(()=>original.apply(this,args))}}
const actions=globalThis.__AGCB_GAME_ACTIONS;if(actions&&typeof actions.invoke==='function'){const originalInvoke=actions.invoke.bind(actions);actions.invoke=function(name){return name==='add'?withEcology(()=>originalInvoke(name)):originalInvoke(name)}}

globalThis.__AGCB_FISHING_ECOLOGY={version:'0.5.05',schema:FISHING_ECOLOGY_SCHEMA,active:true,get context(){return context()},get weights(){return getFishingWeights(context())},get timeBand(){return fishingTimeBand(context().minute)}};
