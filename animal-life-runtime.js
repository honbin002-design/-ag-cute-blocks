import {decideAnimalState} from './animal-state-system.js';
import {setAnimalVisualState} from './animal-models.js';
import {setCutePetState} from './character-models.js';

// Runtime activation is owned by bootstrap-v045.js. This module only owns animal-life decisions.
const SETTINGS_KEY='ag_cute_blocks_settings_v03',WORLD_KEY='ag_cute_blocks_world_v04';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch{return f}};
const livestock=()=>[...(globalThis.__AGCB_LIVE_LIVESTOCK||[])].filter(m=>m?.parent?.parent);
const pets=()=>[...(globalThis.__AGCB_LIVE_PETS||[])].filter(m=>m?.parent?.parent);
const lastPos=new WeakMap(),productState=new WeakMap(),petAffection=new WeakMap();
const seedOf=m=>{const s=String(m?.parent?.userData?.id||m?.uuid||'1');let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h||1};
function hour(){const t=document.querySelector('#clock')?.textContent||'12:00',m=t.match(/(\d{1,2}):(\d{2})/);return m?Number(m[1])+Number(m[2])/60:12}
function worldDay(){return Number(read(SETTINGS_KEY,{}).worldDay||1)}
function nearWater(x,z){const riverX=-38+z*.1,dx=(x-42)/1.35,dz=(z+38)/.78;return Math.abs(x-riverX)<9||dx*dx+dz*dz<24*24}
function movedEnough(model){const p=model.parent?.position;if(!p)return false;const old=lastPos.get(model);lastPos.set(model,{x:p.x,z:p.z});return !!old&&Math.hypot(p.x-old.x,p.z-old.z)>.06}
function persistCollection(parent,day){
  parent.userData.lastProductDay=day;const saved=read(WORLD_KEY,null);if(!saved?.objects)return;const row=saved.objects.find(o=>o.id===parent.userData.id);if(!row)return;row.lastProductDay=day;row.productReady=false;saved.savedAt=Date.now();localStorage.setItem(WORLD_KEY,JSON.stringify(saved));
}

function updateLivestock(now){
  const h=hour(),seconds=now/1000,day=worldDay();
  for(const model of livestock()){
    const p=model.parent.position,parent=model.parent,type=model.userData.animalType,existing=model.userData.state||'idle',ready=parent.userData.productReady;
    const previous=productState.get(parent);if(previous===true&&ready===false)persistCollection(parent,day);productState.set(parent,ready);
    const state=decideAnimalState({type,hour:h,moving:movedEnough(model),nearWater:nearWater(p.x,p.z),nearFood:true,petted:existing==='petResponse'&&now-(model.userData.stateChangedAt||0)<1600,entitySeed:seedOf(model),timeSeconds:seconds});
    if(state!==existing)setAnimalVisualState(model,state,now);
  }
}
function updatePets(now){
  const h=hour();
  for(const model of pets()){
    const type=model.userData.petType,parent=model.parent,affection=Number(parent?.userData?.affection||0),previous=petAffection.get(parent);petAffection.set(parent,affection);
    if(previous!==undefined&&affection>previous){setCutePetState(model,'petResponse',now+1300);continue}
    if(model.userData.petState==='petResponse'&&Number(model.userData.stateUntil||0)>now)continue;
    const sleeping=type==='cat'?(h<6.4||h>=21.2):(h<6.2||h>=21.6),next=sleeping?'sleep':'idle';if(model.userData.petState!==next)setCutePetState(model,next,0);
  }
}

let last=0;
function tick(now){requestAnimationFrame(tick);if(now-last<720)return;last=now;updateLivestock(now);updatePets(now)}
requestAnimationFrame(tick);
