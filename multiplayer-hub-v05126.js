// AG Cute Blocks V0.5.126 — TEST-only host hub for 2–3 player relay.
import { AGCBPeerSession } from './multiplayer-webrtc-test-v05123.js';
export const AGCB_MULTIPLAYER_HUB_RELEASE='V0.5.126';
const MAX_GUESTS=2;
export class AGCBMultiplayerHostHub{
 constructor({hostId='host',onMessage=()=>{},onState=()=>{}}={}){this.hostId=hostId;this.onMessage=onMessage;this.onState=onState;this.guests=new Map();this.seen=new Set()}
 async createGuestOffer(guestId){if(this.guests.has(guestId))throw new Error('AGCB_DUPLICATE_GUEST');if(this.guests.size>=MAX_GUESTS)throw new Error('AGCB_MAX_3_PLAYERS');const session=new AGCBPeerSession({onState:s=>this.onState({guestId,state:s}),onMessage:m=>this.#receive(guestId,m)});this.guests.set(guestId,session);return session.createHostOffer()}
 async acceptGuestAnswer(guestId,answer){const s=this.guests.get(guestId);if(!s)throw new Error('AGCB_UNKNOWN_GUEST');await s.acceptGuestAnswer(answer)}
 #receive(from,m){if(!m||m.env!=='TEST')return;const id=m.payload?.mutationId||`${from}:${m.type}:${m.at}`;if(this.seen.has(id))return;this.seen.add(id);if(this.seen.size>512)this.seen.delete(this.seen.values().next().value);this.onMessage({from,message:m});for(const [id2,s] of this.guests)if(id2!==from)s.send(m.type,{...m.payload,relayFrom:from})}
 broadcast(type,payload){let sent=0;for(const s of this.guests.values())if(s.send(type,{...payload,peerId:this.hostId}))sent++;return sent}
 broadcastPlayerState(state){return this.broadcast('player-state',{state})}
 broadcastBuildingMutation(event){return this.broadcast('building-mutation',{event,mutationId:event?.mutationId||crypto.randomUUID?.()})}
 broadcastFarmingMutation(event){return this.broadcast('farming-mutation',{event,mutationId:event?.mutationId||crypto.randomUUID?.()})}
 removeGuest(id){this.guests.get(id)?.close();this.guests.delete(id)}
 close(){for(const s of this.guests.values())s.close();this.guests.clear();this.seen.clear()}
}
export const AGCB_THREE_PLAYER_GATE=Object.freeze({environment:'TEST',prodEligible:false,totalTargetPlayers:3,maxGuests:2,topology:'HOST_RELAY',guestToGuestRelay:true,runtimeEvidence:'PENDING_THREE_CONTEXT_BROWSER'});
