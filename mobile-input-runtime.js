// Mobile multi-touch input bridge.
// iOS browsers may defer/suppress a normal click while another finger keeps the joystick active.
// Fire gameplay actions on pointer-down instead, while preserving the app's existing click pipeline.

const ACTION_SELECTORS=['#jump','#add','#del','#rot','#lifeInteract','#cam','#lifeBtn','#runToggle'];
const DIRECT_ACTION_IDS=new Set(['jump','add','del','rot']);
const bound=new WeakSet();
let movementPointer=null;

function invokeImmediateAction(el){
  const bridge=globalThis.__AGCB_GAME_ACTIONS;
  if(DIRECT_ACTION_IDS.has(el.id)&&bridge?.invoke?.(el.id))return;
  el.click();
}

function bindImmediatePress(el){
  if(!el||bound.has(el))return;
  bound.add(el);
  el.style.touchAction='none';
  let suppressUntil=0;
  el.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'&&event.button!==0)return;
    event.preventDefault();
    event.stopPropagation();
    suppressUntil=performance.now()+650;
    // Programmatic click keeps capture/bubble click listeners (crop/orchard guards, etc.) working.
    invokeImmediateAction(el);
  },{passive:false});
  el.addEventListener('click',event=>{
    // Programmatic .click() has detail 0; suppress only the delayed physical compatibility click.
    if(event.isTrusted&&performance.now()<suppressUntil){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);
}

function dispatchMovementCancel(joy,pointerId){
  try{joy.dispatchEvent(new PointerEvent('pointercancel',{pointerId,pointerType:'touch'}))}catch{}
}
function cancelMovementPointer(){
  const joy=document.querySelector('#joy');
  if(!joy||movementPointer===null)return;
  const pointerId=movementPointer;movementPointer=null;dispatchMovementCancel(joy,pointerId);
}

function install(){
  for(const selector of ACTION_SELECTORS)bindImmediatePress(document.querySelector(selector));
  const joy=document.querySelector('#joy');
  if(joy&&!joy.dataset.agcbMultitouch){
    joy.dataset.agcbMultitouch='1';
    joy.style.touchAction='none';
    joy.style.webkitUserSelect='none';
    joy.addEventListener('pointerdown',event=>{movementPointer=event.pointerId},{passive:true});
    joy.addEventListener('pointerup',event=>{if(event.pointerId===movementPointer)movementPointer=null},{passive:true});
    joy.addEventListener('pointercancel',event=>{if(event.pointerId===movementPointer)movementPointer=null},{passive:true});
    joy.addEventListener('lostpointercapture',event=>{
      if(event.pointerId!==movementPointer)return;
      const pointerId=movementPointer;movementPointer=null;dispatchMovementCancel(joy,pointerId);
    },{passive:true});
  }
}

install();
// Life UI is created by the main module; keep a short retry path for slow devices.
let retries=0;const timer=setInterval(()=>{install();if(++retries>30||ACTION_SELECTORS.every(s=>document.querySelector(s)))clearInterval(timer)},100);
addEventListener('blur',cancelMovementPointer);
addEventListener('pagehide',cancelMovementPointer);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelMovementPointer()});

globalThis.__AGCB_MOBILE_INPUT={mode:'direct-game-actions-v3',actions:ACTION_SELECTORS,directActions:[...DIRECT_ACTION_IDS],cancelMovementPointer};
