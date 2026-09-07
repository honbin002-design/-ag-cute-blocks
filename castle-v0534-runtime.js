import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const VERSION='V0.5.34',ID='agcb-castle-v0534';const made=[];
const live=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(x=>x?.parent).at(-1)||null,world=()=>live()?.parent||null,castle=()=>globalThis.__AGCB_LUXURY_CASTLE||null;
function add(w,g,m,x,y,z,solid=true,shape='castle-approach'){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.userData={kind:solid?'block':'decoration',solid,castleId:ID,shape,walkable:solid};w.add(o);made.push(o);if(solid){globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(o);globalThis.__AGCB_WORLD_HOTPATH?.reindexSolid?.(o)}return o}
function clear(){for(const o of made.splice(0)){o.parent?.remove(o);o.geometry?.dispose?.()}}
function enhance(){const c=castle(),w=world(),a=c?.state?.anchor;if(!c||!w||!a)return false;clear();globalThis.__AGCB_CASTLE_V0533?.enhance?.();const stone=new THREE.MeshStandardMaterial({color:0xc8b38e,roughness:.82}),dark=new THREE.MeshStandardMaterial({color:0x7d7468,roughness:.9}),water=new THREE.MeshStandardMaterial({color:0x5da9c7,roughness:.25,transparent:true,opacity:.72}),green=new THREE.MeshStandardMaterial({color:0x5f8c55,roughness:.9});
 // Broad front approach and bridge aligned with the real double door.
 add(w,new THREE.BoxGeometry(5.2,.18,7.4),stone,a.x,.08,a.z-9.1,true,'castle-bridge');
 // Shallow decorative moat strips leave the bridge as the obvious walkable route.
 for(const x of [-5.1,5.1])add(w,new THREE.BoxGeometry(4.7,.08,5.8),water,a.x+x,-.03,a.z-8.6,false,'castle-moat');
 // Courtyard apron and side lawns create breathing room around the facade.
 add(w,new THREE.BoxGeometry(12,.12,4.0),dark,a.x,.03,a.z-13.7,true,'castle-courtyard');
 for(const x of [-5.2,5.2])add(w,new THREE.BoxGeometry(3.2,.08,6.2),green,a.x+x,.02,a.z-12.4,true,'castle-lawn');
 // Low bridge posts/rails: center remains unobstructed for player movement.
 for(const x of [-2.45,2.45])for(const z of [-11.8,-9.8,-7.8,-6.2])add(w,new THREE.BoxGeometry(.18,.72,.18),stone,a.x+x,.42,a.z+z,false,'bridge-post');
 // Two entrance statues as simple low-poly silhouettes, decorative only.
 for(const x of [-3.5,3.5]){add(w,new THREE.CylinderGeometry(.55,.72,.5,10),stone,a.x+x,.25,a.z-6.3,false,'statue-base');add(w,new THREE.CylinderGeometry(.28,.4,1.5,8),dark,a.x+x,1.2,a.z-6.3,false,'statue')}
 c.state.grandApproach=true;return true}
function install(){let n=0;const t=setInterval(()=>{const c=castle();if(c?.state?.built){enhance();clearInterval(t)}else if(++n>40)clearInterval(t)},250);const prev=globalThis.__AGCB_CASTLE_V0530?.buildEnhanced;if(prev&&!globalThis.__AGCB_CASTLE_V0530.__v534){globalThis.__AGCB_CASTLE_V0530.buildEnhanced=(...args)=>{const ok=prev(...args);if(ok)setTimeout(enhance,0);return ok};globalThis.__AGCB_CASTLE_V0530.__v534=true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();globalThis.__AGCB_CASTLE_V0534={version:VERSION,enhance,clear};