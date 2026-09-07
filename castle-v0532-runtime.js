import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const VERSION='V0.5.32',ID='agcb-castle-v0532';const made=[];
const live=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(x=>x?.parent).at(-1)||null,world=()=>live()?.parent||null,castle=()=>globalThis.__AGCB_LUXURY_CASTLE||null;
function add(w,x,y,z,sx,sy,sz,mat,solid=true,shape='castle-interior'){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);o.position.set(x,y,z);o.userData={kind:solid?'block':'decoration',solid,castleId:ID,shape};w.add(o);made.push(o);if(solid){globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(o);globalThis.__AGCB_WORLD_HOTPATH?.reindexSolid?.(o)}return o}
function clear(){for(const o of made.splice(0)){o.parent?.remove(o);o.geometry?.dispose?.()}}
function enhance(){const c=castle(),w=world(),a=c?.state?.anchor;if(!c||!w||!a)return false;clear();globalThis.__AGCB_CASTLE_V0531?.enhance?.();const wall=new THREE.MeshStandardMaterial({color:0xeee7da,roughness:.82}),wood=new THREE.MeshStandardMaterial({color:0x81553b,roughness:.72}),gold=new THREE.MeshStandardMaterial({color:0xd5ad4e,roughness:.42,metalness:.16});
 // Interior partitions: central hall stays open; side rooms use real door gaps.
 for(const y of [1.55,4.75]){add(w,a.x-3.25,y,a.z+1.7,.24,3.0,3.4,wall);add(w,a.x-3.25,y,a.z-3.5,.24,3.0,2.0,wall);add(w,a.x+3.25,y,a.z+1.7,.24,3.0,3.4,wall);add(w,a.x+3.25,y,a.z-3.5,.24,3.0,2.0,wall)}
 // Grand-hall decorative beams and a raised throne/dais at the rear; non-blocking trim kept decorative.
 add(w,a.x,2.85,a.z+4.7,7.0,.18,.28,wood,false,'castle-beam');add(w,a.x,.18,a.z+4.35,3.2,.28,1.4,gold,true,'castle-dais');
 // Balcony rail segments with a central passage back into the castle.
 for(const x of [-1.9,-1.2,1.2,1.9])add(w,a.x+x,4.65,a.z-5.65,.14,.9,.14,gold,false,'castle-balcony-rail');
 c.state.interiorRooms=true;return true}
function polishDoorButton(){const d=document.getElementById('agCastleDoorBtn');if(!d)return;d.style.minWidth='92px';d.style.boxShadow='0 4px 14px #0003';d.style.border='2px solid #fff';d.setAttribute('aria-label','城堡大門開關')}
function install(){let n=0;const t=setInterval(()=>{polishDoorButton();const c=castle();if(c?.state?.built){enhance();clearInterval(t)}else if(++n>40)clearInterval(t)},250);const prev=globalThis.__AGCB_CASTLE_V0530?.buildEnhanced;if(prev&&!globalThis.__AGCB_CASTLE_V0530.__v532){globalThis.__AGCB_CASTLE_V0530.buildEnhanced=(...args)=>{const ok=prev(...args);if(ok)setTimeout(enhance,0);return ok};globalThis.__AGCB_CASTLE_V0530.__v532=true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();globalThis.__AGCB_CASTLE_V0532={version:VERSION,enhance,clear};