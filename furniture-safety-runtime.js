import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {isFurnitureInteractable,furnitureExitCandidates} from './furniture-interaction.js';

let cachedAvatar=null,entryPosition=null,lastAnchor=null;
function avatar(){if(cachedAvatar?.parent)return cachedAvatar;for(const a of globalThis.__AGCB_LIVE_AVATARS||[])if(a?.parent)cachedAvatar=a;return cachedAvatar}
function inWater(x,z){const riverX=-38+z*.1,dx=(x-42)/1.35,dz=(z+38)/.78;return Math.abs(x-riverX)<7||dx*dx+dz*dz<324}
function nearestFurniture(p){
  const world=p?.parent;if(!world)return null;let best=null,dist=2.2;
  for(const o of world.children){if(!isFurnitureInteractable(o?.userData?.type))continue;const d=Math.hypot(o.position.x-p.position.x,o.position.z-p.position.z);if(d<dist){best=o;dist=d}}
  return best;
}
function safe(p,anchor){
  if(!p||Math.abs(p.x)>88||Math.abs(p.z)>88||inWater(p.x,p.z))return false;const point=new THREE.Vector3(p.x,1,p.z),world=avatar()?.parent;if(!world)return true;
  for(const o of world.children){if(o===anchor)continue;const u=o?.userData||{};if(!(u.kind==='block'||(u.kind==='object'&&u.solid===true)))continue;const b=new THREE.Box3().setFromObject(o).expandByScalar(.22);if(b.containsPoint(point))return false}
  return true;
}
function settleExit(anchor){
  const p=avatar();if(!p||!anchor)return;if(safe(p.position,anchor)){entryPosition=null;lastAnchor=null;return}
  const choices=furnitureExitCandidates(anchor);if(entryPosition)choices.push(entryPosition.clone());
  const pick=choices.find(c=>safe(c,anchor));if(pick){p.position.set(pick.x,0,pick.z);globalThis.__AGCB_FURNITURE_SAFETY.lastFallback={x:pick.x,z:pick.z,at:Date.now()}}
  entryPosition=null;lastAnchor=null;
}
function install(){
  const button=document.querySelector('#lifeInteract');if(!button)return requestAnimationFrame(install);
  button.addEventListener('click',()=>{
    const p=avatar();if(!p)return;const label=button.querySelector('small')?.textContent||'';
    if(label==='坐下'||label==='躺下'||label==='坐鞦韆'){entryPosition=p.position.clone();return}
    if(label!=='起身')return;lastAnchor=nearestFurniture(p);const anchor=lastAnchor;setTimeout(()=>settleExit(anchor),0);
  },true);
}

globalThis.__AGCB_FURNITURE_SAFETY={get entryPosition(){return entryPosition?.clone()||null},lastFallback:null};
install();
