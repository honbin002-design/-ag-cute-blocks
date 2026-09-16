// AG Cute Blocks V0.5.124 — TEST-only multiplayer game integration.
// Requires multiplayer-webrtc-test-v05123.js. Does not promote multiplayer to PROD.
import { AGCBPeerSession } from './multiplayer-webrtc-test-v05123.js';
export const AGCB_MULTIPLAYER_GAME_RELEASE='V0.5.124';
const REMOTE=new Map();
const localPlayer=()=>{const s=globalThis.__AGCB_LIVE_AVATARS;const a=s?Array.from(s):[];return a.find(x=>x?.userData?.entityId==='player-local')||a.find(x=>x?.userData?.isPlayer)||a[0]||null};
const cloneState=p=>({x:p.position.x,y:p.position.y,z:p.position.z,ry:p.rotation.y,motion:String(p.userData?.motion||p.userData?.assetMotion||'idle')});
function remoteAvatar(id){if(REMOTE.has(id))return REMOTE.get(id);const THREE=globalThis.THREE;if(!THREE)return null;const root=new THREE.Group();root.userData={entityId:`player-remote-${id}`,isRemotePlayer:true};const body=new THREE.Mesh(new THREE.BoxGeometry(.45,.9,.3),new THREE.MeshStandardMaterial({color:0x8fb8ff}));body.position.y=.45;root.add(body);const scene=localPlayer()?.parent||globalThis.scene;if(!scene?.add)return null;scene.add(root);REMOTE.set(id,root);return root}
function applyRemote(id,s){const r=remoteAvatar(id);if(!r||!s)return;r.position.set(+s.x||0,+s.y||0,+s.z||0);r.rotation.y=+s.ry||0;r.userData.motion=s.motion||'idle'}
function emitLocalEvent(name,detail){document.dispatchEvent(new CustomEvent(name,{detail}))}
export function installAGCBMultiplayerGame({peerId=crypto.randomUUID?.()||Math.random().toString(36).slice(2)}={}){
 const session=new AGCBPeerSession({onState:s=>emitLocalEvent('agcb:multiplayer-state',{state:s,peerId}),onMessage:m=>{
  if(!m||m.env!=='TEST')return;const from=m.payload?.peerId||'peer';
  if(m.type==='player-state')applyRemote(from,m.payload?.state);
  else if(m.type==='building-mutation')emitLocalEvent('agcb:remote-building-mutation',m.payload);
  else if(m.type==='farming-mutation')emitLocalEvent('agcb:remote-farming-mutation',m.payload);
 }});
 let last='';const timer=setInterval(()=>{const p=localPlayer();if(!p)return;const state=cloneState(p),sig=JSON.stringify(state);if(sig!==last){last=sig;session.sendPlayerState({peerId,state})}},100);
 const building=e=>session.sendBuildingMutation({peerId,event:e.detail});
 const farming=e=>session.sendFarmingMutation({peerId,event:e.detail});
 document.addEventListener('agcb:building-mutation',building);document.addEventListener('agcb:farming-mutation',farming);
 const api={release:AGCB_MULTIPLAYER_GAME_RELEASE,environment:'TEST',prodEligible:false,peerId,session,createHostOffer:()=>session.createHostOffer(),acceptHostOffer:c=>session.acceptHostOffer(c),acceptGuestAnswer:c=>session.acceptGuestAnswer(c),close(){clearInterval(timer);document.removeEventListener('agcb:building-mutation',building);document.removeEventListener('agcb:farming-mutation',farming);session.close();for(const r of REMOTE.values())r.parent?.remove(r);REMOTE.clear()}};
 globalThis.__AGCB_MULTIPLAYER_TEST=api;return api;
}
export const AGCB_MULTIPLAYER_RUNTIME_GATE=Object.freeze({environment:'TEST',prodEligible:false,targetPlayers:'2-3',playerTransformSyncHz:10,buildingMutationBridge:'WIRED_EVENT',farmingMutationBridge:'WIRED_EVENT',twoContextRuntime:'PENDING'});
