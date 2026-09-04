const WORLD_KEY='ag_cute_blocks_world_v04';
const $=s=>document.querySelector(s);
const readWorld=()=>{try{return JSON.parse(localStorage.getItem(WORLD_KEY)||'null')}catch{return null}};

const style=document.createElement('style');
style.textContent=`.furnitureExtra{position:fixed;z-index:86;left:auto;right:max(190px,calc(env(safe-area-inset-right) + 182px));bottom:max(108px,calc(env(safe-area-inset-bottom) + 98px));transform:none;border:0;border-radius:15px;padding:10px 14px;background:#fff7cceb;color:#42565c;font-size:12px;font-weight:900;box-shadow:0 3px 12px #0003;display:none;pointer-events:auto}.furnitureExtra.show{display:block}`;
document.head.appendChild(style);
const extra=document.createElement('button');extra.className='furnitureExtra';document.body.appendChild(extra);
let currentKind=null,dineTimer=null;

function nearestSavedObject(types,maxDist=2.1){const w=readWorld(),p=w?.player;if(!p)return null;let best=null,bestD=maxDist;for(const o of w.objects||[]){if(!types.includes(o.type))continue;const d=Math.hypot((o.x||0)-(p.x||0),(o.z||0)-(p.z||0));if(d<bestD){best=o;bestD=d}}return best}
function hasNearbyTable(seat){const w=readWorld();if(!w||!seat)return false;return (w.objects||[]).some(o=>o.type==='table'&&Math.hypot((o.x||0)-(seat.x||0),(o.z||0)-(seat.z||0))<2.35)}
function hideExtra(){currentKind=null;extra.classList.remove('show');clearTimeout(dineTimer)}
function showExtra(label,kind){currentKind=kind;extra.textContent=label;extra.setAttribute('aria-label',label);extra.classList.add('show')}
function inspectSeat(){
  const seat=nearestSavedObject(['chair','sofa','swingGarden'],2.0);if(!seat)return hideExtra();
  if(seat.type==='swingGarden'){globalThis.AGCBCharacterPose?.('swing');showExtra('🌿 輕輕盪鞦韆','swing');return}
  if(seat.type==='chair'&&hasNearbyTable(seat)){showExtra('🍽️ 用餐','dine');return}
  if(seat.type==='sofa'){showExtra('☕ 舒服坐一會','relax');return}
  hideExtra();
}

extra.onclick=()=>{
  if(currentKind==='dine'){
    globalThis.AGCBCharacterPose?.('dine');extra.textContent='🍽️ 用餐中…';clearTimeout(dineTimer);dineTimer=setTimeout(()=>{globalThis.AGCBCharacterPose?.('sit');extra.textContent='🍽️ 再吃一會'},2600);
  }else if(currentKind==='swing'){
    globalThis.AGCBCharacterPose?.('swing');extra.textContent='🌿 搖呀搖～';
  }else if(currentKind==='relax'){
    globalThis.AGCBCharacterPose?.('sit');extra.textContent='☕ 放鬆中';
  }
};

const interact=$('#lifeInteract');
interact?.addEventListener('click',()=>{
  const before=interact.textContent||'';
  if(before.includes('起身')){hideExtra();return}
  if(before.includes('坐鞦韆')){setTimeout(()=>globalThis.AGCBCharacterPose?.('swing'),40);setTimeout(()=>{ $('#saveNow')?.click();setTimeout(inspectSeat,35)},70);return}
  if(before.includes('坐下'))setTimeout(()=>{ $('#saveNow')?.click();setTimeout(inspectSeat,35)},70);
},true);

setInterval(()=>{
  const text=interact?.textContent||'',status=$('#status')?.textContent||'';
  if(!text.includes('起身')&&!status.includes('休息中')&&!status.includes('坐下休息'))hideExtra();
},650);
