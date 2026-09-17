// AG Cute Blocks V0.5.133 — TEST-only remote avatar convergence runtime.
// Keeps remote player identity, transform and locomotion state separate from PROD.
export const AGCB_REMOTE_AVATAR_RELEASE='V0.5.133';
const REMOTES=new Map();
const finite=(v,d=0)=>Number.isFinite(+v)?+v:d;
const motion=v=>{const m=String(v||'idle').toLowerCase();return ['idle','walk','run','jump'].includes(m)?m:'idle'};
export function installAGCBRemoteAvatarRuntime({scene=globalThis.scene,THREE=globalThis.THREE}={}){
 if(!THREE)throw new Error('THREE_REQUIRED');
 const ensure=id=>{id=String(id||'peer');if(REMOTES.has(id))return REMOTES.get(id);const root=new THREE.Group();root.userData={entityId:`player-remote-${id}`,peerId:id,isRemotePlayer:true,motion:'idle',environment:'TEST'};const body=new THREE.Mesh(new THREE.BoxGeometry(.45,.9,.3),new THREE.MeshStandardMaterial());body.position.y=.45;root.add(body);scene?.add?.(root);REMOTES.set(id,root);return root};
 const apply=(id,s={})=>{const r=ensure(id);r.position.set(finite(s.x),finite(s.y),finite(s.z));r.rotation.y=finite(s.ry);r.userData.motion=motion(s.motion);document.dispatchEvent(new CustomEvent('agcb:remote-avatar-applied',{detail:{peerId:String(id),x:r.position.x,y:r.position.y,z:r.position.z,ry:r.rotation.y,motion:r.userData.motion}}));return r};
 const onState=e=>{const d=e.detail||{};if(d.environment&&d.environment!=='TEST')return;apply(d.peerId,d.state)};
 document.addEventListener('agcb:remote-player-state',onState);
 const snapshot=()=>[...REMOTES.entries()].map(([peerId,r])=>({peerId,x:r.position.x,y:r.position.y,z:r.position.z,ry:r.rotation.y,motion:r.userData.motion})).sort((a,b)=>a.peerId.localeCompare(b.peerId));
 const api={release:AGCB_REMOTE_AVATAR_RELEASE,environment:'TEST',prodEligible:false,apply,snapshot,remotes:REMOTES,close(){document.removeEventListener('agcb:remote-player-state',onState);for(const r of REMOTES.values())r.parent?.remove?.(r);REMOTES.clear()}};globalThis.__AGCB_REMOTE_AVATARS_TEST=api;return api;
}
export const AGCB_REMOTE_AVATAR_GATE=Object.freeze({environment:'TEST',prodEligible:false,targetPlayers:3,transform:'WIRED',rotation:'WIRED',motion:'IDLE_WALK_RUN_JUMP',prodWrite:'FORBIDDEN'});
