// AG Cute Blocks V0.5.74 — iPhone document-level third-person pinch bridge.
// Safari can split two touches across canvas/HUD layers. Convert a background
// two-finger pinch into the core's guarded third-person wheel zoom path.
const CONTROL_SELECTOR='#joy,#jump,#add,#del,#rot,#lifeInteract,#cam,#lifeBtn,#runToggle,#agWardrobeBtn,#agWardrobe,.item,.cat,.panel,.lifePanel,.waterCropBtn,.sleepMorning,.sleepWake,#agC3Dock';
let lastSpan=0,active=false;
const span=touches=>touches?.length<2?0:Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
const isControl=t=>!!t?.target?.closest?.(CONTROL_SELECTOR);
const canvas=()=>document.querySelector('canvas');
function reset(){lastSpan=0;active=false}
document.addEventListener('touchstart',e=>{
  if(e.touches?.length!==2)return reset();
  const ts=[...e.touches];if(ts.some(isControl))return reset();
  lastSpan=span(e.touches);active=lastSpan>0;
  if(active&&e.cancelable)e.preventDefault();
},{capture:true,passive:false});
document.addEventListener('touchmove',e=>{
  if(!active||e.touches?.length!==2)return;
  const ts=[...e.touches];if(ts.some(isControl))return reset();
  const next=span(e.touches);if(!next||!lastSpan)return reset();
  const delta=next-lastSpan;lastSpan=next;
  if(Math.abs(delta)<.3)return;
  const wheelDelta=-delta*3.8;
  canvas()?.dispatchEvent(new WheelEvent('wheel',{deltaY:wheelDelta,bubbles:false,cancelable:true}));
  if(e.cancelable)e.preventDefault();
},{capture:true,passive:false});
document.addEventListener('touchend',e=>{if(e.touches?.length<2)reset()},{capture:true,passive:true});
document.addEventListener('touchcancel',reset,{capture:true,passive:true});
globalThis.__AGCB_THIRD_TOUCH_ZOOM={version:'0.5.74',documentLevel:true,bridge:'touch-to-core-wheel',sensitivity:3.8,controlsExcluded:true};