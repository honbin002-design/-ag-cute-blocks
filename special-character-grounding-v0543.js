import * as THREE from 'three';
const VERSION='V0.5.43',IDS=new Set(['special2','special5']),YAW_PREFIX='agcb.specialYaw.';
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function install(){const rt=globalThis.__AGCB_TEST_CHARACTER_RUNTIME;if(!rt||rt.__groundingV543)return false;const base=rt.create.bind(rt);rt.create=async id=>{const c=await base(id);if(!IDS.has(id)||!c?.root||!c?.visual||!c?.poseRoot)return c;const baseUpdate=c.update?.bind(c)||(()=>{}),basePlay=c.play?.bind(c)||(()=>{}),box=new THREE.Box3(),world=new THREE.Vector3();let action='idle',lastCorrection=0;
 c.forwardYaw=Number(localStorage.getItem(YAW_PREFIX+id)??c.forwardYaw??0)||0;
 c.play=name=>{action=name||'idle';basePlay(action)};
 c.update=dt=>{baseUpdate(dt);if(action==='sleep'||c.root.userData?.agSleeping)return;c.root.getWorldPosition(world);box.setFromObject(c.visual);if(!Number.isFinite(box.min.y))return;const error=world.y-box.min.y;if(Math.abs(error)<.002)return;const step=clamp(error,-.028,.028)*.42;c.poseRoot.position.y+=step;lastCorrection=step;c.root.userData.agGrounding={version:VERSION,error,step,lastCorrection,action}};
 c.setForwardYaw=yaw=>{const n=Number(yaw)||0;c.forwardYaw=n;localStorage.setItem(YAW_PREFIX+id,String(n));return n};
 c.root.userData.agGroundingVersion=VERSION;return c};rt.__groundingV543=true;globalThis.__AGCB_SPECIAL_GROUNDING={version:VERSION,setYaw(id,yaw){if(!IDS.has(id))return false;localStorage.setItem(YAW_PREFIX+id,String(Number(yaw)||0));return true},clearYaw(id){localStorage.removeItem(YAW_PREFIX+id)}};return true}
let tries=0;const t=setInterval(()=>{if(install()||++tries>80)clearInterval(t)},50);install();
