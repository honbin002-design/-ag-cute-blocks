import {createDeer,createRabbit,createFox,animateWildlife} from './wildlife-models.js';
import {createWildlifePopulation,updateWildlifeEntity,WILDLIFE_MAX_ACTIVE} from './wildlife-runtime-system.js';
import {createPerformanceGovernor,samplePerformance,performanceBudget,creatureUpdateAllowed,shouldCastCreatureShadow} from './mobile-performance-system.js';

const liveAvatars=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(a=>a?.parent?.isGroup);
function liveAvatar(){const a=liveAvatars();return a.length?a[a.length-1]:null}
function modelFor(type){return type==='deer'?createDeer():type==='fox'?createFox():createRabbit()}

const population=createWildlifePopulation('ag-cute-blocks-world-1');
const models=new Map();
const perf=createPerformanceGovernor();
let world=null,last=performance.now(),frame=0,ready=false;

function ensureWorld(){
  if(world)return true;const a=liveAvatar();if(!a?.parent)return false;world=a.parent;
  for(const entity of population.slice(0,WILDLIFE_MAX_ACTIVE)){
    const holder=new THREE.Group();
  }
  return true;
}

// Import Three lazily through the same URL only after the main world exists.
let THREE=null;
async function init(){
  THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  const wait=()=>{if(!ensureWorld())return requestAnimationFrame(wait);for(const entity of population){const holder=new THREE.Group(),model=modelFor(entity.type);holder.position.set(entity.x,0,entity.z);holder.userData={kind:'wildlife',id:entity.id,type:entity.type,solid:false};holder.add(model);world.add(holder);models.set(entity.id,{holder,model,entity})}ready=true;last=performance.now();requestAnimationFrame(loop)};wait();
}

function loop(now){
  requestAnimationFrame(loop);if(!ready)return;frame++;const frameMs=Math.max(1,now-last),dt=Math.min(2.2,frameMs/16.67);last=now;samplePerformance(perf,frameMs);const budget=performanceBudget(perf.tier),avatar=liveAvatar();if(!avatar)return;const p=avatar.position;
  let shown=0;
  for(const rec of models.values()){
    const {holder,model,entity}=rec,distance=Math.hypot(holder.position.x-p.x,holder.position.z-p.z);
    if(shown>=budget.maxWildlife){holder.visible=false;continue}
    if(!creatureUpdateAllowed(frame,distance,perf.tier)){if(distance>budget.creatureCullDistance)holder.visible=false;continue}
    updateWildlifeEntity(entity,{playerX:p.x,playerZ:p.z,timeSeconds:now/1000,dt,quality:perf.tier});
    holder.visible=entity.lod?.visible!==false;if(!holder.visible)continue;shown++;holder.position.x=entity.x;holder.position.z=entity.z;
    if(entity.state==='walk'){const dx=entity.homeX-entity.x,dz=entity.homeZ-entity.z;if(Math.abs(dx)+Math.abs(dz)>.001){const wanted=Math.atan2(-dx,-dz);holder.rotation.y=THREE.MathUtils.lerp(holder.rotation.y,wanted,.06)}}
    const animate=entity.lod?.animate!==false;animateWildlife(model,now,animate&&entity.state==='walk'?.006:0);
    const shadow=shouldCastCreatureShadow(distance,perf.tier);model.traverse(m=>{if(m.isMesh)m.castShadow=shadow});
  }
}
init();
