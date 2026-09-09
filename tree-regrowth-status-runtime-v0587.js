// AG Cute Blocks V0.5.87 — read-only forest regrowth status.
// Reads the existing authoritative world/settings saves only. Creates no second world store.
const WORLD_KEY='ag_cute_blocks_world_v04';
const SETTINGS_KEY='ag_cute_blocks_settings_v048_special_models_r2';
const PANEL_ID='agcbForestStatus';

function readJson(key,fallback={}){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
function snapshot(){
  const world=readJson(WORLD_KEY,{}),settings=readJson(SETTINGS_KEY,{}),day=Math.max(1,Number(settings.worldDay||1));
  const objects=Array.isArray(world.objects)?world.objects:[];
  const stumps=objects.filter(o=>o?.type==='tree'&&o?.treeState==='stump').map(o=>({id:o.id,regrowDay:Number(o.regrowDay||0),daysRemaining:Math.max(0,Number(o.regrowDay||0)-day)}));
  stumps.sort((a,b)=>a.daysRemaining-b.daysRemaining);
  return{worldDay:day,stumpCount:stumps.length,stumps,nextDays:stumps[0]?.daysRemaining??null};
}
function ensurePanel(){
  const inventory=document.querySelector('#inventoryList');if(!inventory)return null;
  let box=document.getElementById(PANEL_ID);if(box)return box;
  box=document.createElement('div');box.id=PANEL_ID;box.className='lifeSection';box.style.marginTop='9px';box.innerHTML='<h3>🌲 森林</h3><div data-agcb-forest-status style="font-size:12px;line-height:1.55"></div>';
  inventory.parentElement?.insertAdjacentElement('afterend',box);return box;
}
function render(){
  const box=ensurePanel();if(!box)return;
  const s=snapshot(),out=box.querySelector('[data-agcb-forest-status]');if(!out)return;
  if(!s.stumpCount){out.textContent='目前沒有等待再生的樹樁。';return}
  const next=s.nextDays===0?'今天會長回來':`最近 ${s.nextDays} 個遊戲日後長回來`;
  out.textContent=`樹樁 ${s.stumpCount} 個・${next}`;
}
function status(){return snapshot()}
const api={version:'0.5.87',status:'READ_ONLY_EXISTING_WORLD_SAVE',worldKey:WORLD_KEY,settingsKey:SETTINGS_KEY,statusSnapshot:status,render};
globalThis.__AGCB_TREE_REGROWTH_STATUS=api;
render();
setInterval(render,2500);
document.addEventListener('click',e=>{if(e.target?.closest?.('#lifeBtn,#lifeInteract,#add'))setTimeout(render,60)},true);
