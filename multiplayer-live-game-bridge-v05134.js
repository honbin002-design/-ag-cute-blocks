// AG Cute Blocks V0.5.134 — TEST-only live multiplayer bridge.
// Routes existing V0.5.124 network events into the validated avatar/world adapters.
// PROD writes are forbidden; this is a convergence integration layer only.
import {installAGCBRemoteAvatarRuntime} from './multiplayer-remote-avatar-runtime-v05133.js';
import {installAGCBMultiplayerWorldConvergence} from './multiplayer-world-convergence-v05131.js';
export const AGCB_MULTIPLAYER_LIVE_BRIDGE_RELEASE='V0.5.134';
export function installAGCBMultiplayerLiveBridge(opts={}){
 const environment=opts.environment||'TEST';if(environment!=='TEST')throw new Error('TEST_ONLY');
 const avatars=opts.avatars||installAGCBRemoteAvatarRuntime(opts);
 const world=opts.worldRuntime||installAGCBMultiplayerWorldConvergence({world:opts.world});
 const forwardPlayer=e=>{const d=e.detail||{};document.dispatchEvent(new CustomEvent('agcb:remote-player-state',{detail:{environment:'TEST',peerId:d.peerId||d.from||'peer',state:d.state||{}}}))};
 const applyBuilding=e=>document.dispatchEvent(new CustomEvent('agcb:live-building-apply',{detail:e.detail}));
 const applyFarming=e=>document.dispatchEvent(new CustomEvent('agcb:live-farming-apply',{detail:e.detail}));
 document.addEventListener('agcb:multiplayer-remote-player-state',forwardPlayer);
 document.addEventListener('agcb:apply-remote-building',applyBuilding);
 document.addEventListener('agcb:apply-remote-farming',applyFarming);
 const api={release:AGCB_MULTIPLAYER_LIVE_BRIDGE_RELEASE,environment:'TEST',prodEligible:false,avatars,world,snapshot:()=>({avatars:avatars.snapshot(),world:world.snapshot()}),close(){document.removeEventListener('agcb:multiplayer-remote-player-state',forwardPlayer);document.removeEventListener('agcb:apply-remote-building',applyBuilding);document.removeEventListener('agcb:apply-remote-farming',applyFarming);avatars.close?.();world.close?.()}};
 globalThis.__AGCB_MULTIPLAYER_LIVE_BRIDGE_TEST=api;return api;
}
export const AGCB_MULTIPLAYER_LIVE_BRIDGE_GATE=Object.freeze({environment:'TEST',prodEligible:false,targetPlayers:3,remoteAvatar:'WIRED',buildingWorld:'WIRED',farmingWorld:'WIRED',prodWrite:'FORBIDDEN',deviceEvidence:'PENDING'});
