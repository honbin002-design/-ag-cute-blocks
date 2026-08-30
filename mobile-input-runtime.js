// Mobile multi-touch input bridge.
// iOS browsers may defer/suppress a normal click while another finger keeps the joystick active.
// Fire gameplay actions on pointer-down instead, while preserving the app's existing click pipeline.

const ACTION_SELECTORS=['#jump','#add','#del','#rot','#lifeInteract'];
const bound=new WeakSet();

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
    el.click();
  },{passive:false});
  el.addEventListener('click',event=>{
    // Programmatic .click() has detail 0; suppress only the delayed physical compatibility click.
    if(event.detail>0&&performance.now()<suppressUntil){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);
}

function install(){
  for(const selector of ACTION_SELECTORS)bindImmediatePress(document.querySelector(selector));
  const joy=document.querySelector('#joy');
  if(joy){
    joy.style.touchAction='none';
    joy.style.webkitUserSelect='none';
  }
}

install();
// life UI is created by the main module, but keep one short observer-safe retry path for slow devices.
let retries=0;const timer=setInterval(()=>{install();if(++retries>20||ACTION_SELECTORS.every(s=>document.querySelector(s)))clearInterval(timer)},100);
globalThis.__AGCB_MOBILE_INPUT={mode:'pointerdown-multitouch',actions:ACTION_SELECTORS};
