// AG Cute Blocks V0.5.135 — TEST-only real live multiplayer bridge.
// Normalizes actual WebRTC messages into the V0.5.133 avatar and V0.5.131 world contracts.
import {installAGCBRemoteAvatarRuntime} from './multiplayer-remote-avatar-runtime-v05133.js';
import {installAGCBMultiplayerWorldConvergence} from './multiplayer-world-convergence-v05131.js';
export const AGCB_MULTIPLAYER_LIVE_BRIDGE_RELEASE='V0.5.135';
export function installAGCBMultiplayerLiveBridgeV05135(opts={}){
 const environment=opts.environment||'TEST';if(environment!=='TEST')throw new Error('TEST_ONLY');
 const avatars=opts.avatars||installAGCBRemoteAvatarRuntime(opts);
 const world=opts.worldRuntime||installAGCBMultiplayerWorldConvergence({world:opts.world});
 const emit=(name,detail)=>document.dispatchEvent(new CustomEvent(name,{detail}));
 const routeNetworkMessage=m=>{
  if(!m||m.env!=='TEST')return false;
  const p=m.payload||{};
  if(m.type==='player-state'){emit('agcb:remote-player-state',{environment:'TEST',peerId:p.peerId||p.relayFrom||'peer',state:p.state||{}});return true;}
  if(m.type==='building-mutation'){emit('agcb:remote-building-mutation',p);return true;}
  if(m.type==='farming-mutation'){emit('agcb:remote-farming-mutation',p);return true;}
  return false;
 };
 // Compatibility with V0.5.124 event names. These are the authoritative legacy names.
 const remotePlayer=e=>emit('agcb:remote-player-state',{environment:'TEST',peerId:e.detail?.peerId||e.detail?.from||'peer',state:e.detail?.state||{}});
 const remoteBuilding=e=>emit('agcb:remote-building-mutation',e.detail||{});
 const remoteFarming=e=>emit('agcb:remote-farming-mutation',e.detail||{});
 document.addEventListener('agcb:multiplayer-remote-player-state',remotePlayer);
 document.addEventListener('agcb:remote-building-network',remoteBuilding);
 document.addEventListener('agcb:remote-farming-network',remoteFarming);
 const api={release:AGCB_MULTIPLAYER_LIVE_BRIDGE_RELEASE,environment:'TEST',prodEligible:false,avatars,world,routeNetworkMessage,snapshot:()=>({avatars:avatars.snapshot(),world:world.snapshot()}),close(){document.removeEventListener('agcb:multiplayer-remote-player-state',remotePlayer);document.removeEventListener('agcb:remote-building-network',remoteBuilding);document.removeEventListener('agcb:remote-farming-network',remoteFarming);avatars.close?.();world.close?.()}};
 globalThis.__AGCB_MULTIPLAYER_LIVE_BRIDGE_TEST=api;return api;
}
export const AGCB_MULTIPLAYER_LIVE_BRIDGE_GATE=Object.freeze({environment:'TEST',prodEligible:false,targetPlayers:3,transport:'REAL_WEBRTC_REQUIRED',remoteAvatar:'V05133_EVENT_CONTRACT',buildingWorld:'V05131_REMOTE_MUTATION_CONTRACT',farmingWorld:'V05131_REMOTE_MUTATION_CONTRACT',prodWrite:'FORBIDDEN',realBrowserEvidence:'PENDING'});
