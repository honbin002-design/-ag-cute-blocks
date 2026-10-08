// AG Cute Blocks V0.5.81 - true UAL3 swim gameplay sync.
// Additive bridge only: does not alter walk/run direction, rig, skinning or world movement.
const VERSION='V0.5.81';
let lastPos=null,lastT=performance.now(),swimActive=false;
function api(){return globalThis.__AGCB_TEST_CHARACTER_INTEGRATION}
function swimmingSignal(player,speed){
  const motion=String(player?.userData?.motion||player?.userData?.assetMotion||player?.userData?.action||'').toLowerCase();
  if(/swim|swimming/.test(motion))return true;
  return !!(player?.userData?.swimming||player?.userData?.isSwimming)&&speed>.04;
}
function tick(now){
  requestAnimationFrame(tick);const a=api(),player=a?.player;if(!a||a.selected!=='ual3'||!player){lastPos=null;swimActive=false;lastT=now;return}
  const dt=Math.max((now-lastT)/1000,.001);lastT=now;const speed=lastPos?player.position.distanceTo(lastPos)/dt:0;if(!lastPos)lastPos=player.position.clone();else lastPos.copy(player.position);
  const on=swimmingSignal(player,speed);
  if(on){a.force?.('swim',320);swimActive=true}else if(swimActive){swimActive=false;a.force?.('idle',0)}
}
// Cover explicit swim controls/events too; validation buttons keep using the existing integration API.
document.addEventListener('click',e=>{const el=e.target?.closest?.('button,[role="button"],[data-action]');if(!el)return;const t=((el.id||'')+' '+(el.getAttribute?.('aria-label')||'')+' '+(el.title||'')+' '+(el.textContent||'')).toLowerCase();if(/swim|游泳/.test(t)&&api()?.selected==='ual3')api().force?.('swim',1800)},true);
requestAnimationFrame(tick);
globalThis.__AGCB_UAL_SWIM_SYNC={version:VERSION,status:'UAL3_SWIM_GAMEPLAY_STATE_SYNC',get active(){return swimActive},swimmingSignal};
