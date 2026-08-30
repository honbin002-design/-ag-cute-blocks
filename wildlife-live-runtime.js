import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createDeer,createRabbit,createFox,animateWildlife} from './wildlife-models.js';
import {createWildlifePopulation,updateWildlifeEntity} from './wildlife-runtime-system.js';
import {performanceBudget,creatureUpdateAllowed,shouldCastCreatureShadow} from './mobile-performance-system.js';

let cachedAvatar=null;
function liveAvatar(){
  if(cachedAvatar?.parent?.isGroup)return cachedAvatar;
  const set=globalThis.__AGCB_LIVE_AVATARS||[];for(const a of set)if(a?.parent?.isGroup)cachedAvatar=a;
  return cachedAvatar;
}
function modelFor(type){return type==='deer'?createDeer():type==='fox'?createFox():createRabbit()}
function turnToward(holder,dx,dz){if(Math.abs(dx)+Math.abs(dz)<.001)return;const wanted=Math.atan2(-dx,-dz),delta=Math.atan2(Math.sin(wanted-holder.rotation.y),Math.cos(wanted-holder.rotation.y));holder.rotation.y+=delta*.12}

const population=createWildlifePopulation('ag-cute-blocks-world-1');
const models=new Map();
let world=null,last=performance.now(),frame=0,ready=false;

function ensureWorld(){if(world)return true;const a=liveAvatar();if(!a?.parent)return false;world=a.parent;return true}
function spawn(){
  for(const entity of population){
    const holder=new THREE.Group(),model=modelFor(entity.type);holder.position.set(entity.x,0,entity.z);holder.userData={kind:'wildlife',id:entity.id,type:entity.type,solid:false};holder.add(model);world.add(holder);models.set(entity.id,{holder,model,entity,shadow:null});
  }
  globalThis.__AGCB_WILDLIFE_RUNTIME={population,models,get qualityTier(){return globalThis.__AGCB_PERF_TIER||'normal'}};ready=true;last=performance.now();requestAnimationFrame(loop);
}
function init(){const wait=()=>{if(!ensureWorld())return requestAnimationFrame(wait);spawn()};wait()}

function loop(now){
  requestAnimationFrame(loop);if(!ready)return;frame++;const frameMs=Math.max(1,now-last),dt=Math.min(2.2,frameMs/16.67);last=now;const tier=globalThis.__AGCB_PERF_TIER||'normal',budget=performanceBudget(tier),avatar=liveAvatar();if(!avatar)return;const p=avatar.position;
  let shown=0;
  for(const rec of models.values()){
    const {holder,model,entity}=rec,distance=Math.hypot(holder.position.x-p.x,holder.position.z-p.z);
    if(shown>=budget.maxWildlife){holder.visible=false;continue}
    if(distance>budget.creatureCullDistance){holder.visible=false;entity.lod={visible:false,animate:false,detail:'hidden'};continue}
    if(creatureUpdateAllowed(frame,distance,tier))updateWildlifeEntity(entity,{playerX:p.x,playerZ:p.z,timeSeconds:now/1000,dt,quality:tier});
    holder.visible=entity.lod?.visible!==false;if(!holder.visible)continue;shown++;holder.position.x=entity.x;holder.position.z=entity.z;
    if(entity.state==='walk')turnToward(holder,entity.moveX||0,entity.moveZ||-1);
    const animate=entity.lod?.animate!==false;animateWildlife(model,now,animate&&entity.state==='walk'?.006:0,entity.state);
    const shadow=shouldCastCreatureShadow(distance,tier);if(rec.shadow!==shadow){rec.shadow=shadow;model.traverse(m=>{if(m.isMesh)m.castShadow=shadow})}
  }
}
init();
