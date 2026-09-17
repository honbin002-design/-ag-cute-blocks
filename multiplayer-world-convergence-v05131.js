// AG Cute Blocks V0.5.131 — TEST-only world convergence adapter.
// Applies remote building/farming mutations to deterministic TEST world state while
// preserving DOM events for the live game runtime. Never writes PROD state.
export const AGCB_MULTIPLAYER_WORLD_RELEASE='V0.5.131';
const keyOf=(p={})=>String(p.mutationId||p.event?.mutationId||p.event?.id||'');
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
export function installAGCBMultiplayerWorldConvergence({world=globalThis.__AGCB_TEST_WORLD_STATE}={}){
 const state=world||{environment:'TEST',buildings:new Map(),farms:new Map(),applied:new Set()};
 if(state.environment!=='TEST')throw new Error('AGCB multiplayer world convergence is TEST-only');
 state.buildings=state.buildings instanceof Map?state.buildings:new Map(state.buildings||[]);
 state.farms=state.farms instanceof Map?state.farms:new Map(state.farms||[]);
 state.applied=state.applied instanceof Set?state.applied:new Set(state.applied||[]);
 const apply=(kind,payload={})=>{
  const event=payload.event||{}, id=keyOf(payload); if(id&&state.applied.has(id))return false;
  const table=kind==='building'?state.buildings:state.farms;
  const entityId=String(event.id||event.entityId||event.cellId||event.plotId||id||'');
  const op=String(event.op||event.action||'upsert').toLowerCase();
  if(['remove','delete','harvest','clear','destroy'].includes(op))table.delete(entityId);
  else table.set(entityId,clone(event));
  if(id)state.applied.add(id);
  document.dispatchEvent(new CustomEvent(`agcb:apply-remote-${kind}`,{detail:clone(payload)}));
  return true;
 };
 const onBuilding=e=>apply('building',e.detail);
 const onFarming=e=>apply('farming',e.detail);
 document.addEventListener('agcb:remote-building-mutation',onBuilding);
 document.addEventListener('agcb:remote-farming-mutation',onFarming);
 const snapshot=()=>({environment:'TEST',buildings:[...state.buildings.entries()],farms:[...state.farms.entries()]});
 const api={release:AGCB_MULTIPLAYER_WORLD_RELEASE,environment:'TEST',prodEligible:false,state,apply,snapshot,close(){document.removeEventListener('agcb:remote-building-mutation',onBuilding);document.removeEventListener('agcb:remote-farming-mutation',onFarming)}};
 globalThis.__AGCB_TEST_WORLD_STATE=state;globalThis.__AGCB_MULTIPLAYER_WORLD=api;return api;
}
export const AGCB_MULTIPLAYER_WORLD_GATE=Object.freeze({environment:'TEST',prodEligible:false,targetPlayers:3,remoteBuildingApply:'WIRED',remoteFarmingApply:'WIRED',dedupe:'MUTATION_ID',prodWrite:'FORBIDDEN'});
