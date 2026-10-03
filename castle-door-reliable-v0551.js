import * as THREE from 'three';
const VERSION='V0.5.51';let blocker=null,lastAnchor='',lastOpen=null,anim=null;
const castle=()=>globalThis.__AGCB_LUXURY_CASTLE||null;
const live=()=>[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(x=>x?.parent).at(-1)||null;
const world=()=>live()?.parent||null;
function invalidate(o){globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(o);globalThis.__AGCB_WORLD_HOTPATH?.reindexSolid?.(o)}
function ensureBlocker(){const c=castle(),w=world(),a=c?.state?.anchor;if(!c?.state?.built||!w||!a)return false;const key=`${a.x}:${a.z}`;if(blocker&&blocker.parent===w&&lastAnchor===key)return true;if(blocker?.parent)blocker.parent.remove(blocker);blocker=new THREE.Mesh(new THREE.BoxGeometry(3.7,2.9,.42),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));blocker.position.set(a.x,1.45,a.z-5.3);blocker.name='ag-castle-door-collision-blocker';blocker.userData={kind:'block',solid:true,castleDoorBlocker:true,version:VERSION};w.add(blocker);lastAnchor=key;invalidate(blocker);return true}
function setBlocker(open){if(!ensureBlocker())return;blocker.userData.solid=!open;blocker.userData.kind=open?'decoration':'block';blocker.visible=false;invalidate(blocker)}
function ease(t){return 1-Math.pow(1-t,3)}
function startAnimation(open){const c=castle(),p=c?.state?.doorPivots;if(!p?.length)return;const [lp,rp]=p;const targetL=open?-Math.PI/2:0,targetR=open?Math.PI/2:0;const fromL=lp.rotation.y,fromR=rp.rotation.y;anim={start:performance.now(),duration:420,lp,rp,fromL,fromR,targetL,targetR}}
function frame(now){requestAnimationFrame(frame);if(!anim)return;const t=Math.min(1,(now-anim.start)/anim.duration),e=ease(t);anim.lp.rotation.y=THREE.MathUtils.lerp(anim.fromL,anim.targetL,e);anim.rp.rotation.y=THREE.MathUtils.lerp(anim.fromR,anim.targetR,e);if(t>=1)anim=null}
function sync(){const c=castle();if(!c?.state?.built)return false;ensureBlocker();const open=!!c.state.doorOpen;if(lastOpen===null){lastOpen=open;setBlocker(open);return true}if(open!==lastOpen){lastOpen=open;startAnimation(open);setBlocker(open)}return true}
function install(){let tries=0;const t=setInterval(()=>{if(sync()&&++tries>8)clearInterval(t);else if(++tries>80)clearInterval(t)},150);setInterval(sync,160);requestAnimationFrame(frame)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
globalThis.__AGCB_CASTLE_DOOR_RELIABLE={version:VERSION,sync,get blocker(){return blocker}};