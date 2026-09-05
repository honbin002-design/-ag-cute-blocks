import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// AG Cute Blocks V0.5.02 — additive fishing runtime.
// Keeps the V0.5.01 movement/build/collision core untouched and reads only the published hot-path registry.
const VERSION='V0.5.02';
const STORE_KEY='ag_cute_blocks_fishing_v1';
const CAST_RANGE=7.5;
const MOVE_CANCEL_DISTANCE=1.35;

const FISH={
  river:[
    {id:'ayu',name:'香魚',icon:'🐟',min:.18,max:.42},
    {id:'trout',name:'鱒魚',icon:'🐟',min:.35,max:.9},
    {id:'carp',name:'鯉魚',icon:'🐠',min:.7,max:2.4}
  ],
  lake:[
    {id:'bass',name:'鱸魚',icon:'🐟',min:.45,max:1.6},
    {id:'crucian',name:'鯽魚',icon:'🐠',min:.25,max:.85},
    {id:'eel',name:'鰻魚',icon:'〰️',min:.35,max:1.2}
  ]
};

let store={schema:1,catches:[],inventory:{}};
try{const saved=JSON.parse(localStorage.getItem(STORE_KEY)||'{}');if(saved&&typeof saved==='object')store={schema:1,catches:Array.isArray(saved.catches)?saved.catches:[],inventory:saved.inventory&&typeof saved.inventory==='object'?saved.inventory:{}}}catch{}
const persist=()=>localStorage.setItem(STORE_KEY,JSON.stringify(store));
const totalFish=()=>Object.values(store.inventory).reduce((a,b)=>a+(Number(b)||0),0);
const status=msg=>{const el=document.querySelector('#status');if(el)el.textContent=msg};
const rand=(a,b)=>a+Math.random()*(b-a);

function installVersion(){
  const meta=document.querySelector('meta[name="ag-runtime-version"]');if(meta)meta.content=VERSION;
  document.querySelectorAll('.title small').forEach(el=>el.textContent=VERSION);
  const note=document.querySelector('.note');if(note&&!note.textContent.includes(VERSION))note.textContent=`${VERSION}：新增完整釣魚流程（釣竿、靠近水域、拋竿、咬鉤、收線、魚簍紀錄）。`;
}

function loadHotpath(){return globalThis.__AGCB_WORLD_HOTPATH||null}
function playerRecord(h){return h?.worldIndex?.entities?.['player-local']||null}
function waterTargets(h){return (h?.buildAimTargets||[]).filter(o=>/^terrain-(river|lake)$/.test(o?.userData?.entityId||''))}
const box=new THREE.Box3(),point=new THREE.Vector3(),closest=new THREE.Vector3();
function nearestWater(h){
  const p=playerRecord(h);if(!p)return null;point.set(p.x,0,p.z);let best=null;
  for(const mesh of waterTargets(h)){
    box.setFromObject(mesh);box.clampPoint(point,closest);const d=Math.hypot(closest.x-p.x,closest.z-p.z);
    if(!best||d<best.distance)best={mesh,distance:d,point:closest.clone(),kind:(mesh.userData.entityId||'').includes('lake')?'lake':'river'};
  }
  return best;
}

let root=null,button=null,panel=null,list=null,bobber=null,line=null,timer=null,state='idle',castOrigin=null,activeWater=null,biteDeadline=0;
function clearTimer(){if(timer){clearTimeout(timer);timer=null}}
function removeCastVisual(){if(bobber?.parent)bobber.parent.remove(bobber);if(line?.parent)line.parent.remove(line);bobber=null;line=null}
function resetFishing(msg){clearTimer();removeCastVisual();state='idle';castOrigin=null;activeWater=null;biteDeadline=0;renderButton();if(msg)status(msg)}
function renderButton(){if(!button)return;const count=totalFish();button.classList.toggle('bite',state==='bite');button.textContent=state==='casting'?'🎣 等待…':state==='bite'?'❗ 收線！':`🎣 釣魚${count?` · ${count}`:''}`}
function renderBag(){if(!list)return;const rows=Object.entries(store.inventory).filter(([,n])=>n>0);list.innerHTML=rows.length?rows.map(([id,n])=>{const fish=[...FISH.river,...FISH.lake].find(x=>x.id===id);return `<div class="agFishRow"><span>${fish?.icon||'🐟'} ${fish?.name||id}</span><b>× ${n}</b></div>`}).join(''):'<div class="agFishEmpty">還沒有釣到魚</div>'}

function installUI(){
  if(document.querySelector('#agFishingBtn'))return;
  const style=document.createElement('style');style.textContent=`
  #agFishingBtn{position:fixed;z-index:86;right:max(10px,env(safe-area-inset-right));top:max(120px,calc(env(safe-area-inset-top) + 112px));min-width:76px;height:36px;border:3px solid #ffffffde;border-radius:18px;background:#fffde8e8;color:#42565c;box-shadow:0 4px 14px #0003;font-size:11px;font-weight:900;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
  #agFishingBtn.bite{background:#ffe36e;transform:scale(1.08)}
  .agFishSection{background:#fff;border-radius:13px;padding:9px;margin:7px 0}.agFishSection h3{margin:0 0 5px}.agFishRow{display:grid;grid-template-columns:1fr auto;gap:8px;padding:6px 0;border-bottom:1px solid #0001;font-size:12px}.agFishEmpty{font-size:12px;opacity:.65;padding:6px 0}
  @media(max-height:430px){#agFishingBtn{top:max(112px,calc(env(safe-area-inset-top) + 104px));height:32px;min-width:70px;font-size:10px}}
  `;document.head.appendChild(style);
  button=document.createElement('button');button.id='agFishingBtn';button.setAttribute('aria-label','釣魚');document.body.appendChild(button);
  const life=document.querySelector('#lifePanel');if(life){panel=document.createElement('section');panel.className='agFishSection';panel.innerHTML='<h3>🎣 魚簍</h3><div id="agFishList"></div>';life.appendChild(panel);list=panel.querySelector('#agFishList')}
  button.addEventListener('click',onFishingButton,{passive:true});renderBag();renderButton();
}

function createCastVisual(hit){
  const h=loadHotpath(),p=playerRecord(h);if(!p||!hit?.mesh?.parent)return;
  const world=hit.mesh.parent;const target=hit.point.clone();
  // Move the float slightly inside the water footprint so it does not sit on the bank edge.
  target.lerp(hit.mesh.position,.13);target.y=Math.max(.09,hit.mesh.position.y+.08);
  bobber=new THREE.Group();const floatMat=new THREE.MeshPhongMaterial({color:0xff6b65,shininess:80});const whiteMat=new THREE.MeshPhongMaterial({color:0xffffff,shininess:70});const top=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),floatMat),bottom=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),whiteMat);top.position.y=.06;bottom.position.y=-.06;bobber.add(top,bottom);bobber.position.copy(target);bobber.userData={solid:false,fishingFloat:true};world.add(bobber);
  const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p.x,1.2,p.z),target.clone()]);line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x4d5960,transparent:true,opacity:.75}));world.add(line);
}

function cast(){
  const h=loadHotpath(),p=playerRecord(h),water=nearestWater(h);
  if(!p||!water)return status('世界還在載入，稍後再試釣魚');
  if(water.distance>CAST_RANGE)return status('🎣 請先靠近河岸或湖邊再拋竿');
  state='casting';activeWater=water;castOrigin={x:p.x,z:p.z};createCastVisual(water);renderButton();status('🎣 已拋竿，看到「收線！」時再按一次');
  const biteDelay=Math.round(rand(1400,2700));timer=setTimeout(()=>{state='bite';biteDeadline=Date.now()+3600;renderButton();status('❗ 魚咬鉤了！現在按「收線！」');timer=setTimeout(()=>resetFishing('魚跑掉了，再拋一次吧'),3600)},biteDelay);
}

function catchFish(){
  if(Date.now()>biteDeadline)return resetFishing('收線太慢，魚跑掉了');
  const pool=FISH[activeWater?.kind]||FISH.river,fish=pool[Math.floor(Math.random()*pool.length)],weight=Math.round(rand(fish.min,fish.max)*100)/100;
  store.inventory[fish.id]=(store.inventory[fish.id]||0)+1;store.catches.push({id:fish.id,name:fish.name,weight,water:activeWater?.kind||'river',caughtAt:Date.now()});if(store.catches.length>120)store.catches=store.catches.slice(-120);persist();renderBag();resetFishing(`🎣 釣到 ${fish.name}・${weight.toFixed(2)} kg ✓`);
}
function onFishingButton(){if(state==='idle')cast();else if(state==='bite')catchFish();else status('🎣 正在等魚咬鉤…')}

function watchMovement(){setInterval(()=>{if(state==='idle'||!castOrigin)return;const p=playerRecord(loadHotpath());if(!p)return;if(Math.hypot(p.x-castOrigin.x,p.z-castOrigin.z)>MOVE_CANCEL_DISTANCE)resetFishing('移動太遠，已收回釣竿')},350)}

function boot(){const h=loadHotpath();if(!h||!playerRecord(h)){setTimeout(boot,120);return}installVersion();installUI();watchMovement();globalThis.__AGCB_FISHING={version:VERSION,get state(){return state},get total(){return totalFish()},get catches(){return [...store.catches]}}}
boot();
