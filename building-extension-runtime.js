import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Incremental V0.4.5 building extensions. The legacy core still owns save/remove placement;
// this runtime upgrades the just-created block and persisted shape/material IDs stay in the normal snapshot.
const STATE={shape:null,material:null,lastCategory:null};
const liveAvatars=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(a=>a?.parent);
function world(){const a=liveAvatars();return a.length?a[a.length-1].parent:null}
function blocks(){const w=world();return w?w.children.filter(x=>x?.userData?.kind==='block'):[]}
function stairsGeometry(){
  const s=new THREE.Shape();
  s.moveTo(-.5,-.5);s.lineTo(.5,-.5);s.lineTo(.5,.5);s.lineTo(.25,.5);s.lineTo(.25,.25);s.lineTo(0,.25);s.lineTo(0,0);s.lineTo(-.25,0);s.lineTo(-.25,-.25);s.lineTo(-.5,-.25);s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth:1,bevelEnabled:false});g.translate(0,0,-.5);g.computeVertexNormals();return g;
}
function upgradeStairs(mesh){
  if(!mesh?.isMesh||mesh.userData?.kind!=='block'||mesh.userData.shape!=='stairs'||mesh.userData.stairsGeometry)return false;
  mesh.geometry?.dispose?.();mesh.geometry=stairsGeometry();mesh.userData.stairsGeometry=true;
  globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(mesh);
  globalThis.__AGCB_WORLD_HOTPATH?.reindexSolid?.(mesh);
  return true;
}
function selectionButton(value,icon,label){const b=document.createElement('button');b.className='item agcbExtensionItem';b.dataset.agcbBuildValue=value;b.innerHTML=`${icon}<small>${label}</small>`;return b}
function categoryName(){return document.querySelector('#cats .cat.on')?.textContent?.trim()||''}
function activeExtension(){return STATE.shape||STATE.material}
function syncSelectionStyles(){const active=activeExtension();if(active)document.querySelectorAll('#items .item:not(.agcbExtensionItem)').forEach(b=>b.classList.remove('on'));document.querySelectorAll('.agcbExtensionItem').forEach(b=>b.classList.toggle('on',b.dataset.agcbBuildValue===active))}
function choose(kind,value){if(kind==='shape'){STATE.shape=value;STATE.material=null}else{STATE.material=value;STATE.shape=null}syncSelectionStyles()}
function inject(){
  const items=document.querySelector('#items');if(!items)return;const cat=categoryName();STATE.lastCategory=cat;
  if(cat==='形狀'&&!items.querySelector('[data-agcb-build-value="stairs"]')){const b=selectionButton('stairs','🪜','樓梯');b.onclick=e=>{e.stopPropagation();choose('shape','stairs')};items.appendChild(b)}
  if(cat==='建材'){
    if(!items.querySelector('[data-agcb-build-value="tile"]')){const b=selectionButton('tile','▦','磁磚');b.onclick=e=>{e.stopPropagation();choose('material','tile')};items.appendChild(b)}
    if(!items.querySelector('[data-agcb-build-value="ceramic"]')){const b=selectionButton('ceramic','◫','陶瓷');b.onclick=e=>{e.stopPropagation();choose('material','ceramic')};items.appendChild(b)}
  }
  syncSelectionStyles();
}
function resetIfCoreSelection(e){if(e.target.closest('.agcbExtensionItem'))return;const item=e.target.closest('#items .item');if(item){STATE.shape=null;STATE.material=null}const cat=e.target.closest('#cats .cat');if(cat){STATE.shape=null;STATE.material=null}}
document.addEventListener('click',resetIfCoreSelection,true);
const mo=new MutationObserver(()=>queueMicrotask(inject));mo.observe(document.body,{subtree:true,childList:true});inject();

const add=document.querySelector('#add');
if(add)add.addEventListener('click',()=>{
  if(!STATE.shape&&!STATE.material)return;const before=new Set(blocks());
  queueMicrotask(()=>{
    const created=blocks().find(b=>!before.has(b));if(!created)return;
    if(STATE.shape==='stairs'){created.userData.shape='stairs';created.userData.stairsGeometry=false;upgradeStairs(created)}
    if(STATE.material){created.userData.mat=STATE.material;created.userData.proceduralMaterialKind=null;globalThis.__AGCB_PROCEDURAL_MATERIALS?.scan?.()}
    document.querySelector('#saveNow')?.click();
  });
});

function restore(){let n=0;for(const b of blocks())if(upgradeStairs(b))n++;return n}
let scans=0;function loop(){requestAnimationFrame(loop);if(++scans%90===0)restore()}
restore();requestAnimationFrame(loop);
globalThis.__AGCB_BUILD_EXTENSIONS={schema:4,state:STATE,inject,restore,stairsGeometry,observer:mo};
