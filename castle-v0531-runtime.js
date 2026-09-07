import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const VERSION='V0.5.31';
const ID='agcb-castle-v0531';
const created=[];
const live=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(x=>x?.parent).at(-1)||null;
const world=()=>live()?.parent||null;
const castle=()=>globalThis.__AGCB_LUXURY_CASTLE||null;
function addBox(w,x,y,z,sx,sy,sz,mat,tag='castle-landing'){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);o.position.set(x,y,z);o.userData={kind:'block',solid:true,castleId:ID,shape:tag,walkable:true};w.add(o);created.push(o);globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(o);globalThis.__AGCB_WORLD_HOTPATH?.reindexSolid?.(o);return o}
function clear(){for(const o of created.splice(0)){o.parent?.remove(o);o.geometry?.dispose?.()}}
function enhance(){const c=castle(),w=world(),a=c?.state?.anchor;if(!c||!w||!a)return false;clear();globalThis.__AGCB_CASTLE_V0530?.upgradeFloorOpenings?.();const mat=new THREE.MeshStandardMaterial({color:0xb69b72,roughness:.75});
 // Broad landing pads bridge each flight to the usable floor while preserving the stairwell opening.
 addBox(w,a.x-3.15,3.18,a.z+2.8,2.7,.12,2.2,mat);addBox(w,a.x+3.15,6.38,a.z+1.2,2.7,.12,2.2,mat);
 // Low threshold ramps at both landing transitions prevent the avatar collider catching on a floor lip.
 for(const [x,y,z,ry] of [[a.x-3.9,3.10,a.z+2.8,0],[a.x+3.9,6.30,a.z+1.2,0]]){const g=new THREE.BoxGeometry(1.2,.12,1.4),o=new THREE.Mesh(g,mat);o.position.set(x,y,z);o.rotation.y=ry;o.rotation.z=(x<a.x?-.055:.055);o.userData={kind:'block',solid:true,castleId:ID,shape:'castle-threshold',walkable:true};w.add(o);created.push(o);globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(o)}
 c.state.stairLandingSafe=true;return true}
function install(){let n=0;const t=setInterval(()=>{const c=castle();if(c?.state?.built){enhance();clearInterval(t)}else if(++n>40)clearInterval(t)},250);const oldBuild=globalThis.__AGCB_CASTLE_V0530?.buildEnhanced;if(oldBuild&&!globalThis.__AGCB_CASTLE_V0530.__v531){globalThis.__AGCB_CASTLE_V0530.buildEnhanced=(...args)=>{const ok=oldBuild(...args);if(ok)setTimeout(enhance,0);return ok};globalThis.__AGCB_CASTLE_V0530.__v531=true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
globalThis.__AGCB_CASTLE_V0531={version:VERSION,enhance,clear};