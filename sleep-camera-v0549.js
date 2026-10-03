// AG Cute Blocks V0.5.49 — sleeping camera interaction guard.
const VERSION='V0.5.49';
const STYLE_ID='agcb-sleep-camera-style';
function installStyle(){if(document.getElementById(STYLE_ID))return;const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`body.agcbSleeping canvas{pointer-events:auto!important;touch-action:none!important}body.agcbSleeping #joy{pointer-events:none!important;opacity:.35!important}body.agcbSleeping #jump,body.agcbSleeping #runToggle{pointer-events:none!important;opacity:.45!important}body.agcbSleeping #lifeInteract,body.agcbSleeping .sleepMorning{pointer-events:auto!important}body.agcbSleeping #status{pointer-events:none!important}`;document.head.appendChild(s)}
function cancelMove(){globalThis.__AGCB_MOBILE_INPUT?.cancelMovementPointer?.()}
function apply(sleeping){installStyle();document.body.classList.toggle('agcbSleeping',!!sleeping);if(sleeping)cancelMove();const canvas=document.querySelector('canvas');if(canvas){canvas.style.pointerEvents='auto';canvas.style.touchAction='none';canvas.dataset.agcbSleepCamera=String(!!sleeping)}return !!canvas}
function sync(){const routine=globalThis.__AGCB_SLEEP_ROUTINE;const sleeping=!!routine?.isLying?.();apply(sleeping)}
window.addEventListener('agcb:sleep-state',e=>apply(!!e.detail?.sleeping));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(sync,0)});
let tries=0;const timer=setInterval(()=>{sync();if(++tries>80)clearInterval(timer)},125);sync();
globalThis.__AGCB_SLEEP_CAMERA={version:VERSION,apply,sync};