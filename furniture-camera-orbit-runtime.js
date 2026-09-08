// AG Cute Blocks V0.5.77 - furniture camera orbit for iPhone.
// Character movement remains locked by the core furniture state; camera remains freely orbitable/zoomable.
import * as THREE from 'three';
const VERSION='V0.5.77',WORLD_KEY='ag_cute_blocks_world_v04';
const BLOCK='#joy,#jump,#add,#del,#rot,#lifeInteract,#cam,#lifeBtn,#runToggle,#agWardrobeBtn,#agWardrobe,.item,.cat,.panel,.lifePanel,.waterCropBtn,.sleepMorning,.sleepWake,#agC3Dock,button,input,select';
let yaw=-.45,pitch=.25,distance=4.2,dragId=null,lastX=0,lastY=0,lastSpan=0,active=false;
const target=new THREE.Vector3(),desired=new THREE.Vector3();
function integration(){return globalThis.__AGCB_TEST_CHARACTER_INTEGRATION}
function mode(){const life=document.getElementById('lifeInteract')?.textContent||'',status=document.getElementById('status')?.textContent||'';if(!life.includes('起身'))return'';if(/躺下|睡/.test(status)||/躺下休息/.test(status))return'sleep';if(/坐下休息|放鬆中|舒服坐|休息中/.test(status))return'sit';return''}
function canvas(){return document.querySelector('canvas')}
function blocked(el){return !!el?.closest?.(BLOCK)}
function span(ts){return ts?.length<2?0:Math.hypot(ts[0].clientX-ts[1].clientX,ts[0].clientY-ts[1].clientY)}
function player(){return integration()?.player||null}
function onPointerDown(e){if(!mode()||blocked(e.target)||e.clientX<=innerWidth*.29)return;dragId=e.pointerId;lastX=e.clientX;lastY=e.clientY;e.target?.setPointerCapture?.(e.pointerId);active=true}
function onPointerMove(e){if(e.pointerId!==dragId||!mode())return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.0065;pitch=Math.max(-.62,Math.min(1.18,pitch+dy*.006));if(e.cancelable)e.preventDefault()}
function onPointerEnd(e){if(e.pointerId===dragId){dragId=null;active=false}}
function touchStart(e){if(!mode()||e.touches?.length!==2||[...e.touches].some(t=>blocked(t.target)))return;lastSpan=span(e.touches);if(lastSpan&&e.cancelable)e.preventDefault()}
function touchMove(e){if(!mode()||e.touches?.length!==2||!lastSpan)return;const s=span(e.touches);if(!s)return;distance=Math.max(.65,Math.min(11,distance*(lastSpan/s)));lastSpan=s;if(e.cancelable)e.preventDefault()}
function touchEnd(e){if(e.touches?.length<2)lastSpan=0}
function install(){const c=canvas();if(!c||c.dataset.agcbFurnitureOrbit==='1')return false;c.dataset.agcbFurnitureOrbit='1';c.addEventListener('pointerdown',onPointerDown,{capture:true,passive:false});c.addEventListener('pointermove',onPointerMove,{capture:true,passive:false});c.addEventListener('pointerup',onPointerEnd,{capture:true,passive:true});c.addEventListener('pointercancel',onPointerEnd,{capture:true,passive:true});document.addEventListener('touchstart',touchStart,{capture:true,passive:false});document.addEventListener('touchmove',touchMove,{capture:true,passive:false});document.addEventListener('touchend',touchEnd,{capture:true,passive:true});document.addEventListener('touchcancel',touchEnd,{capture:true,passive:true});return true}
function render(){requestAnimationFrame(render);install();const m=mode(),p=player(),c=globalThis.__AGCB_THREE_CAMERA||null;if(!m||!p)return;const cam=c||(()=>{let found=null;try{const canv=canvas();const r=canv?.__threeCamera;if(r?.isCamera)found=r}catch{}return found})();const camera=cam||globalThis.camera;if(!camera?.isCamera)return;target.copy(p.position);target.y+=m==='sleep'?.72:1.05;const cp=Math.cos(pitch),sp=Math.sin(pitch);desired.set(target.x+Math.sin(yaw)*cp*distance,target.y+sp*distance,target.z+Math.cos(yaw)*cp*distance);camera.position.copy(desired);camera.lookAt(target)}
// Resolve the core camera without changing core behaviour: intercept the renderer's current camera once available.
function discoverCamera(){const p=player();if(!p)return;const scene=p.parent;scene?.traverse?.(o=>{if(!globalThis.__AGCB_THREE_CAMERA&&o?.isCamera)globalThis.__AGCB_THREE_CAMERA=o})}
setInterval(discoverCamera,250);requestAnimationFrame(render);
globalThis.__AGCB_FURNITURE_CAMERA_ORBIT={version:VERSION,get active(){return !!mode()},get yaw(){return yaw},get pitch(){return pitch},get distance(){return distance},status:'MOVEMENT_LOCKED_CAMERA_FREE'};
