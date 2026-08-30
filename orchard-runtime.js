import {createFruitTreeModel,treeCanFruit} from './crop-models.js';

const SAVE_KEY='ag_cute_blocks_world_v04',SETTINGS_KEY='ag_cute_blocks_settings_v03';
const liveTrees=()=>[...(globalThis.__AGCB_LIVE_TREES||[])].filter(m=>m?.parent?.userData?.treeKind);
const liveAvatars=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(a=>a?.parent);
const read=(k,f={})=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const seasonNow=()=>document.querySelector('#season')?.value||read(SETTINGS_KEY,{}).season||'spring';
const player=()=>{const a=liveAvatars();return a.length?a[a.length-1]:null};
function directObjects(){const a=player();return a?.parent?.children?.filter(x=>x?.userData?.kind==='object')||[]}
function actionable(o){const u=o.userData||{},type=u.type;if(['chair','sofa','bed','starBed','table','swingGarden'].includes(type))return true;if(u.crop&&u.growth>=.95)return true;if(u.treeKind&&u.growth>=.95)return true;if(u.shippingBox||u.pet)return true;if(u.ranch&&u.productReady)return true;return false}
function nearestAction(){const p=player();if(!p)return null;let best=null,dist=2.5;for(const o of directObjects()){if(!actionable(o))continue;const d=Math.hypot(o.position.x-p.position.x,o.position.z-p.position.z);if(d<dist){best=o;dist=d}}return best}
function modelOf(holder){return holder?.userData?.model||liveTrees().find(m=>m.parent===holder)||null}
function visuallyReady(holder){const model=modelOf(holder),kind=holder?.userData?.treeKind,stage=Number(holder?.userData?.growth||0),season=seasonNow();return !!(model?.userData?.fruitReady&&treeCanFruit(kind,season,stage))}
function persistGrowth(holder){const w=read(SAVE_KEY,{objects:[]}),o=(w.objects||[]).find(x=>x.id===holder.userData.id);if(!o)return;o.growth=holder.userData.growth;w.savedAt=Date.now();write(SAVE_KEY,w)}
function rebuild(holder){const old=modelOf(holder);if(old)holder.remove(old);const next=createFruitTreeModel(holder.userData.treeKind,holder.userData.growth,seasonNow());holder.add(next);holder.userData.model=next}

// If fruit is already visible at the model's fruit-ready threshold, align the holder to the
// interaction threshold so the player never sees ripe fruit that cannot be picked.
function alignVisibleFruit(){for(const model of liveTrees()){const holder=model.parent;if(!holder)continue;if(model.userData.fruitReady&&holder.userData.growth<.95){holder.userData.growth=.95;persistGrowth(holder)}}}

// Orange trees are a winter-bearing species. The base runtime pauses generic tree growth in
// winter, so give only oranges their normal gentle daily growth and rebuild the visible model.
let lastDay=Number(read(SETTINGS_KEY,{}).worldDay||1);
function winterOrangeGrowth(){const s=read(SETTINGS_KEY,{}),day=Number(s.worldDay||1);if(day===lastDay)return;lastDay=day;if(seasonNow()!=='winter')return;for(const holder of directObjects().filter(o=>o.userData?.treeKind==='orange'&&o.userData.growth<1)){holder.userData.growth=Math.min(1,Number(holder.userData.growth||.2)+.09);rebuild(holder);persistGrowth(holder)}}

function installHarvestGuard(){const btn=document.querySelector('#lifeInteract');if(!btn)return setTimeout(installHarvestGuard,120);btn.addEventListener('click',e=>{const o=nearestAction();if(!o?.userData?.treeKind)return;if(visuallyReady(o))return;e.preventDefault();e.stopImmediatePropagation();const status=document.querySelector('#status'),kind=o.userData.treeKind,label=kind==='apple'?'蘋果':kind==='orange'?'橘子':'桃子';if(status)status.textContent=`${label}現在還沒有成熟果實 🌿`;},true)}

installHarvestGuard();setInterval(()=>{alignVisibleFruit();winterOrangeGrowth()},520);
globalThis.__AGCB_ORCHARD_RUNTIME={visuallyReady,alignVisibleFruit,winterOrangeGrowth};
