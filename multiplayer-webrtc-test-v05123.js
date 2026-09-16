// AG Cute Blocks V0.5.123 — TEST-only zero-cost WebRTC multiplayer transport.
// Manual offer/answer signalling: no paid backend, no PROD promotion.
export const AGCB_MULTIPLAYER_RELEASE = 'V0.5.123';
export const AGCB_MULTIPLAYER_ENVIRONMENT = 'TEST';
const ICE = Object.freeze({ iceServers: [] }); // LAN/direct ICE only until a reviewed free STUN policy is locked.

function encode(desc) { return btoa(unescape(encodeURIComponent(JSON.stringify(desc)))); }
function decode(text) { return JSON.parse(decodeURIComponent(escape(atob(String(text).trim())))); }

export class AGCBPeerSession {
  constructor({ onMessage = () => {}, onState = () => {} } = {}) {
    this.pc = new RTCPeerConnection(ICE);
    this.channel = null;
    this.onMessage = onMessage;
    this.onState = onState;
    this.pc.onconnectionstatechange = () => this.onState(this.pc.connectionState);
    this.pc.ondatachannel = e => this.#bind(e.channel);
  }
  #bind(channel) {
    this.channel = channel;
    channel.onopen = () => this.onState('data-open');
    channel.onclose = () => this.onState('data-closed');
    channel.onmessage = e => { try { this.onMessage(JSON.parse(e.data)); } catch (_) {} };
  }
  async #iceComplete() {
    if (this.pc.iceGatheringState === 'complete') return;
    await new Promise(resolve => {
      const done = () => { if (this.pc.iceGatheringState === 'complete') { this.pc.removeEventListener('icegatheringstatechange', done); resolve(); } };
      this.pc.addEventListener('icegatheringstatechange', done);
    });
  }
  async createHostOffer() {
    this.#bind(this.pc.createDataChannel('agcb-world', { ordered: true }));
    await this.pc.setLocalDescription(await this.pc.createOffer());
    await this.#iceComplete();
    return encode(this.pc.localDescription);
  }
  async acceptHostOffer(offerCode) {
    await this.pc.setRemoteDescription(decode(offerCode));
    await this.pc.setLocalDescription(await this.pc.createAnswer());
    await this.#iceComplete();
    return encode(this.pc.localDescription);
  }
  async acceptGuestAnswer(answerCode) { await this.pc.setRemoteDescription(decode(answerCode)); }
  send(type, payload) {
    if (!this.channel || this.channel.readyState !== 'open') return false;
    this.channel.send(JSON.stringify({ v: 1, env: 'TEST', type, payload, at: Date.now() }));
    return true;
  }
  sendPlayerState(state) { return this.send('player-state', state); }
  sendBuildingMutation(event) { return this.send('building-mutation', event); }
  sendFarmingMutation(event) { return this.send('farming-mutation', event); }
  close() { try { this.channel?.close(); } finally { this.pc.close(); } }
}

export const AGCB_MULTIPLAYER_TEST_GATE = Object.freeze({
  environment: 'TEST', prodEligible: false, maxTargetPlayers: 3,
  signalling: 'MANUAL_OFFER_ANSWER', transport: 'WEBRTC_DATACHANNEL',
  syncScopes: Object.freeze(['player-state', 'building-mutation', 'farming-mutation']),
  runtimeEvidence: 'PENDING_TWO_CONTEXT_TEST',
});
