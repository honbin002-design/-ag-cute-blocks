import './collision-cache-runtime.js';
import './render-performance-runtime.js';
import './mobile-input-runtime.js';
import './wildlife-live-runtime.js';
import {decideAnimalState} from './animal-state-system.js';
import {setAnimalVisualState} from './animal-models.js';
import {setCutePetState} from './character-models.js';

const livestock=()=>[...(globalThis.__AGCB_LIVE_LIVESTOCK||[])].filter(m=>m?.parent?.parent);
const pets=()=>[...(globalThis.__AGCB_LIVE_PETS||[])].filter(m=>m?.parent?.parent);
const lastPos=new WeakMap();
const seedOf=m=>{const s=String(m?.parent?.userData?.id||m?.uuid||'1');let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h||1};
function hour(){const t=document.querySelector('#clock')?.textContent||'12:00',m=t.match(/(\d{1,2}):(\d{2})/);return m?Number(m[1])+Number(m[2])/60:12}
function nearWater(x,z){const riverX=-38+z*.1,dx=(x-42)/1.35,dz=(z+38)/.78;return Math.abs(x-riverX)<9||dx*dx+dz*dz<24*24}
function movedEnough(model){const p=model.parent?.position;if(!p)return false;const old=lastPos.get(model);lastPos.set(model,{x:p.x,z:p.z});return !!old&&Math.hypot(p.x-old.x,p.z-old.z)>.55}

function updateLivestock(now){
  const h=hour(),seconds=now/1000;
  for(const model of livestock()){
    const p=model.parent.position,type=model.userData.animalType,existing=model.userData.state||'idle';
    const state=decideAnimalState({type,hour:h,moving:movedEnough(model),nearWater:nearWater(p.x,p.z),nearFood:true,petted:existing==='petResponse'&&now-(model.userData.stateChangedAt||0)<1600,entitySeed:seedOf(model),timeSeconds:seconds});
    if(state!==existing)setAnimalVisualState(model,state,now);
  }
}
function updatePets(now){
  const h=hour();
  for(const model of pets()){
    const type=model.userData.petType,parent=model.parent,petting=Number(parent?.userData?.pettedUntil||0)>now;
    if(petting){setCutePetState(model,'petResponse',now+1300);continue}
    const sleeping=type==='cat'?(h<6.4||h>=21.2):(h<6.2||h>=21.6),next=sleeping?'sleep':'idle';if(model.userData.petState!==next)setCutePetState(model,next,0);
  }
}

let last=0;
function tick(now){requestAnimationFrame(tick);if(now-last<720)return;last=now;updateLivestock(now);updatePets(now)}
requestAnimationFrame(tick);
