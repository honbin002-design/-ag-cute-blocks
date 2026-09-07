import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const VERSION='V0.5.30';
function live(){return [...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(x=>x?.parent).at(-1)||null}
function world(){return live()?.parent||null}
function castle(){return globalThis.__AGCB_LUXURY_CASTLE||null}
function status(t){const s=document.getElementById('status');if(s)s.textContent=t}
function addSlab(w,x,y,z,sx,sz,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,.16,sz),mat);m.position.set(x,y,z);m.userData={kind:'block',solid:true,castleId:'agcb-luxury-castle-v0530',shape:'castle-floor',stairwellSafe:true};w.add(m);globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(m);return m}
function upgradeFloorOpenings(){const c=castle(),w=world(),a=c?.state?.anchor;if(!c||!w||!a)return false;const candidates=w.children.filter(o=>o?.isMesh&&o.userData?.castleId&&Math.abs(o.position.x-a.x)<.05&&Math.abs(o.position.z-a.z)<.05&&[3.12,6.32].some(y=>Math.abs(o.position.y-y)<.12));for(const o of candidates){const p=o.geometry?.parameters;if(p&&Math.abs((p.width||0)-14)<.2&&Math.abs((p.depth||0)-11)<.2){o.parent?.remove(o);o.geometry?.dispose?.()}}
 const mat=new THREE.MeshStandardMaterial({color:0xb69b72,roughness:.75});
 // 2F: stair arrives on left/rear quadrant; leave a real 2.4 x 3.0 m opening.
 addSlab(w,a.x+2.2,3.12,a.z,9.6,11,mat);addSlab(w,a.x-5.8,3.12,a.z-2.15,2.0,6.7,mat);addSlab(w,a.x-5.8,3.12,a.z+4.0,2.0,3.0,mat);
 // 3F: stair arrives on right/centre quadrant; opening mirrored to keep the next flight usable.
 addSlab(w,a.x-2.2,6.32,a.z,9.6,11,mat);addSlab(w,a.x+5.8,6.32,a.z-3.55,2.0,3.9,mat);addSlab(w,a.x+5.8,6.32,a.z+3.45,2.0,4.1,mat);
 c.state.stairwellSafe=true;return true}
function buildEnhanced(){const c=castle(),p=live();if(!c||!p){status('城堡系統尚未準備完成');return false}const v=new THREE.Vector3();p.getWorldPosition(v);const ok=c.buildAt({x:Math.round(v.x),z:Math.round(v.z-18)});if(!ok)return false;upgradeFloorOpenings();status('🏰 V0.5.30 豪華三層城堡完成・樓梯通道已開孔・雙門可開關');return true}
function bind(){const old=document.getElementById('generateCastle');if(old){old.textContent='🏰 一鍵生成豪華大城堡';old.onclick=e=>{e.preventDefault();e.stopPropagation();buildEnhanced()}}
 const extra=document.getElementById('agLuxuryCastleBtn');if(extra){extra.textContent='🏰 一鍵生成豪華大城堡';extra.onclick=e=>{e.preventDefault();e.stopPropagation();buildEnhanced()}}
}
function install(){let n=0;const t=setInterval(()=>{bind();if(castle()&&++n>3)clearInterval(t)},250);setTimeout(()=>{bind();const c=castle();if(c?.state?.built)upgradeFloorOpenings()},1400)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
globalThis.__AGCB_CASTLE_V0530={version:VERSION,buildEnhanced,upgradeFloorOpenings};