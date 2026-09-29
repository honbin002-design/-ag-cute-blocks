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

const worldApi=()=>globalThis.__AGCB_WORLD_TASK_API;
const savedWildlife=()=>worldApi()?.readWildlifeSnapshot?.()||[];
const population=createWildlifePopulation('ag-cute-blocks-world-1',savedWildlife());
const models=new Map();
let world=null,last=performance.now(),frame=0,ready=false,lastPersist=performance.now(),dirty=false;
function wildlifeSnapshot(){return population.map(e=>({schema:e.schema,id:e.id,type:e.type,zoneId:e.zoneId,x:e.x,z:e.z,homeX:e.homeX,homeZ:e.homeZ,moveX:e.moveX,moveZ:e.moveZ,phase:e.phase,state:e.state}))}
function wildlifeRadius(type){return type==='deer'?.72:type==='fox'?.56:.42}
function restoreSafePosition(entity){const api=worldApi(),radius=wildlifeRadius(entity.type),blocked=(x,z)=>api?.wildlifeMoveBlocked?.(x,z,radius)===true;if(!blocked(entity.x,entity.z))return;const hx=Number.isFinite(Number(entity.homeX))?Number(entity.homeX):entity.x,hz=Number.isFinite(Number(entity.homeZ))?Number(entity.homeZ):entity.z;if(!blocked(hx,hz)){entity.x=hx;entity.z=hz;dirty=true;return}for(const rr of [2,4,6,8])for(let i=0;i<12;i++){const a=i*Math.PI/6,x=hx+Math.cos(a)*rr,z=hz+Math.sin(a)*rr;if(!blocked(x,z)){entity.x=x;entity.z=z;entity.homeX=x;entity.homeZ=z;dirty=true;return}}entity.x=hx;entity.z=hz;entity.state='idle'}

function ensureWorld(){if(world)return true;const a=liveAvatar();if(!a?.parent)return false;world=a.parent;return true}
function spawn(){
  for(const entity of population){
    restoreSafePosition(entity);
    const holder=new THREE.Group(),model=modelFor(entity.type);holder.position.set(entity.x,0,entity.z);holder.userData={kind:'wildlife',id:entity.id,type:entity.type,solid:false};holder.add(model);world.add(holder);models.set(entity.id,{holder,model,entity,shadow:null});
  }
  globalThis.__AGCB_WILDLIFE_RUNTIME={population,models,snapshot:wildlifeSnapshot,get qualityTier(){return globalThis.__AGCB_PERF_TIER||'normal'}};ready=true;last=performance.now();requestAnimationFrame(loop);
}
function init(){const wait=()=>{if(!ensureWorld())return requestAnimationFrame(wait);spawn()};wait()}

function loop(now){
  requestAnimationFrame(loop);if(!ready)return;frame++;const frameMs=Math.max(1,now-last),dt=Math.min(2.2,frameMs/16.67);last=now;const tier=globalThis.__AGCB_PERF_TIER||'normal',budget=performanceBudget(tier),avatar=liveAvatar();if(!avatar)return;const p=avatar.position;
  let shown=0;
  for(const rec of models.values()){
    const {holder,model,entity}=rec,distance=Math.hypot(holder.position.x-p.x,holder.position.z-p.z);
    if(shown>=budget.maxWildlife){holder.visible=false;continue}
    if(distance>budget.creatureCullDistance){holder.visible=false;entity.lod={visible:false,animate:false,detail:'hidden'};continue}
    if(creatureUpdateAllowed(frame,distance,tier)){const ox=entity.x,oz=entity.z;updateWildlifeEntity(entity,{playerX:p.x,playerZ:p.z,timeSeconds:now/1000,dt,quality:tier});if((entity.x!==ox||entity.z!==oz)&&worldApi()?.wildlifeMoveBlocked?.(entity.x,entity.z,wildlifeRadius(entity.type))){entity.x=ox;entity.z=oz;entity.state='idle'}else if(entity.x!==ox||entity.z!==oz)dirty=true}
    holder.visible=entity.lod?.visible!==false;if(!holder.visible)continue;shown++;holder.position.x=entity.x;holder.position.z=entity.z;
    if(entity.state==='walk')turnToward(holder,entity.moveX||0,entity.moveZ||-1);
    const animate=entity.lod?.animate!==false;animateWildlife(model,now,animate&&entity.state==='walk'?.006:0,entity.state);
    const shadow=shouldCastCreatureShadow(distance,tier);if(rec.shadow!==shadow){rec.shadow=shadow;model.traverse(m=>{if(m.isMesh)m.castShadow=shadow})}
  }
  if(dirty&&now-lastPersist>=10000){worldApi()?.saveWorldNow?.();dirty=false;lastPersist=now}
}
init();
