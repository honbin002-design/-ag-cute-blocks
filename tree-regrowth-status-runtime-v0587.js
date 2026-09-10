// AG Cute Blocks V0.5.90 — read-only realtime forest regrowth status.
// Reads the existing authoritative world save only. Creates no second world store.
const WORLD_KEY='ag_cute_blocks_world_v04';
const PANEL_ID='agcbForestStatus';
function readJson(key,fallback={}){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
function snapshot(now=Date.now()){const world=readJson(WORLD_KEY,{}),objects=Array.isArray(world.objects)?world.objects:[];const stumps=objects.filter(o=>o?.type==='tree'&&o?.treeState==='stump').map(o=>({id:o.id,regrowAt:Number(o.regrowAt||0),remainingMs:Math.max(0,Number(o.regrowAt||0)-now)}));stumps.sort((a,b)=>a.remainingMs-b.remainingMs);return{stumpCount:stumps.length,stumps,nextMs:stumps[0]?.remainingMs??null}}
function ensurePanel(){const inventory=document.querySelector('#inventoryList');if(!inventory)return null;let box=document.getElementById(PANEL_ID);if(box)return box;box=document.createElement('div');box.id=PANEL_ID;box.className='lifeSection';box.style.marginTop='9px';box.innerHTML='<h3>🌲 森林</h3><div data-agcb-forest-status style="font-size:12px;line-height:1.55"></div>';inventory.parentElement?.insertAdjacentElement('afterend',box);return box}
function formatRemaining(ms){const total=Math.max(0,Math.ceil(ms/1000)),m=Math.floor(total/60),s=total%60;return m?`${m} 分 ${s} 秒`:`${s} 秒`}
function render(){const box=ensurePanel();if(!box)return;const s=snapshot(),out=box.querySelector('[data-agcb-forest-status]');if(!out)return;if(!s.stumpCount){out.textContent='目前沒有等待再生的樹樁。';return}out.textContent=`樹樁 ${s.stumpCount} 個・最近約 ${formatRemaining(s.nextMs)}後長回來`}
const api={version:'0.5.90',status:'READ_ONLY_REALTIME_EXISTING_WORLD_SAVE',worldKey:WORLD_KEY,statusSnapshot:snapshot,render};globalThis.__AGCB_TREE_REGROWTH_STATUS=api;render();setInterval(render,1000);document.addEventListener('click',e=>{if(e.target?.closest?.('#lifeBtn,#lifeInteract,#add'))setTimeout(render,60)},true);
