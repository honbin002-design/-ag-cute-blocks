import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const VERSION='V0.5.33',ID='agcb-castle-v0533';const made=[];
const live=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(x=>x?.parent).at(-1)||null,world=()=>live()?.parent||null,castle=()=>globalThis.__AGCB_LUXURY_CASTLE||null;
function mesh(w,g,m,x,y,z,solid=false,shape='castle-detail'){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.userData={kind:solid?'block':'decoration',solid,castleId:ID,shape};w.add(o);made.push(o);if(solid){globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(o);globalThis.__AGCB_WORLD_HOTPATH?.reindexSolid?.(o)}return o}
function clear(){for(const o of made.splice(0)){o.parent?.remove(o);o.geometry?.dispose?.();if(o.isLight)o.dispose?.()}}
function enhance(){const c=castle(),w=world(),a=c?.state?.anchor;if(!c||!w||!a)return false;clear();globalThis.__AGCB_CASTLE_V0532?.enhance?.();const stone=new THREE.MeshStandardMaterial({color:0xe8dfcf,roughness:.78}),trim=new THREE.MeshStandardMaterial({color:0xc8aa76,roughness:.62}),roof=new THREE.MeshStandardMaterial({color:0x4c5c78,roughness:.65}),warm=new THREE.MeshStandardMaterial({color:0xffd47b,emissive:0xffb43c,emissiveIntensity:.65,roughness:.4});
 // Grand entrance frame and triangular pediment make the front read as a palace rather than a box.
 for(const x of [-2.25,2.25])mesh(w,new THREE.CylinderGeometry(.28,.34,5.2,14),stone,a.x+x,2.6,a.z-5.68,false,'facade-column');
 const ped=mesh(w,new THREE.ConeGeometry(3.25,1.55,3),roof,a.x,6.15,a.z-5.62,false,'facade-pediment');ped.rotation.x=Math.PI/2;ped.rotation.z=Math.PI/2;
 mesh(w,new THREE.BoxGeometry(5.3,.3,.42),trim,a.x,5.35,a.z-5.62,false,'facade-cornice');
 // Window crowns and warm lamps across all three storeys.
 for(const y of [2.15,5.35,8.55])for(const x of [-4,-1.8,1.8,4]){const crown=mesh(w,new THREE.BoxGeometry(1.0,.14,.22),trim,a.x+x,y+.72,a.z+5.58,false,'window-crown');crown.rotation.z=0;const lamp=mesh(w,new THREE.SphereGeometry(.09,10,8),warm,a.x+x,y-.62,a.z+5.7,false,'castle-lamp');const light=new THREE.PointLight(0xffc56a,.32,5.2,2);light.position.copy(lamp.position);w.add(light);made.push(light)}
 // Four entrance lanterns, deliberately low intensity for mobile performance.
 for(const x of [-2.8,-1.3,1.3,2.8]){const lamp=mesh(w,new THREE.SphereGeometry(.11,10,8),warm,a.x+x,2.15,a.z-5.78,false,'entrance-lamp');const light=new THREE.PointLight(0xffbf63,.42,4.5,2);light.position.copy(lamp.position);w.add(light);made.push(light)}
 // Roof flag mast and simple banner.
 mesh(w,new THREE.CylinderGeometry(.035,.035,2.4,8),trim,a.x,10.8,a.z,false,'flag-mast');const flag=mesh(w,new THREE.PlaneGeometry(1.15,.62),new THREE.MeshStandardMaterial({color:0x9f3446,side:THREE.DoubleSide}),a.x+.58,11.45,a.z,false,'castle-flag');flag.rotation.y=Math.PI/2;
 c.state.grandFacade=true;c.state.lighting=true;return true}
function install(){let n=0;const t=setInterval(()=>{const c=castle();if(c?.state?.built){enhance();clearInterval(t)}else if(++n>40)clearInterval(t)},250);const prev=globalThis.__AGCB_CASTLE_V0530?.buildEnhanced;if(prev&&!globalThis.__AGCB_CASTLE_V0530.__v533){globalThis.__AGCB_CASTLE_V0530.buildEnhanced=(...args)=>{const ok=prev(...args);if(ok)setTimeout(enhance,0);return ok};globalThis.__AGCB_CASTLE_V0530.__v533=true}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();globalThis.__AGCB_CASTLE_V0533={version:VERSION,enhance,clear};