// AG Cute Blocks V0.5.121 — TEST-only formal candidate runtime adapter.
// Fail-closed: candidates remain unavailable until their binary assets are present.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as skeletonClone } from 'three/addons/utils/SkeletonUtils.js';
import { FORMAL_CHARACTER_CANDIDATES, assertFormalCandidateTestOnly } from './assets/characters/formal-candidates/formal-candidate-manifest-v0520.js';

export const FORMAL_CANDIDATE_RUNTIME_RELEASE = 'V0.5.121';
const ROOT = new URL('./assets/characters/formal-candidates/', import.meta.url);
const ASSET = Object.freeze({
  formalMale01: '05_q_adult_male.glb',
  formalFemale01: '06_q_adult_female_repaired.glb',
});
const loader = new GLTFLoader();
const cache = new Map();

function loadGLB(url) {
  return new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject));
}
function normalize(root, targetHeight = 1.72) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('AGCB_FORMAL_CANDIDATE_INVALID_BOUNDS');
  const scale = targetHeight / size.y;
  root.scale.multiplyScalar(scale);
  root.updateMatrixWorld(true);
  const grounded = new THREE.Box3().setFromObject(root);
  const center = grounded.getCenter(new THREE.Vector3());
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= grounded.min.y;
  root.updateMatrixWorld(true);
  return root;
}
function actionMap(gltf) {
  const clips = gltf.animations || [];
  const by = Object.create(null);
  for (const clip of clips) {
    const n = String(clip.name || '').toLowerCase().replace(/_nla$/,'');
    for (const key of ['idle','walk','run','jump','jointinspection']) if (n.includes(key)) by[key] ||= clip;
  }
  return by;
}

export async function loadFormalCandidate(id) {
  const meta = assertFormalCandidateTestOnly(FORMAL_CHARACTER_CANDIDATES[id]);
  if (!ASSET[id]) throw new Error('AGCB_FORMAL_CANDIDATE_UNKNOWN_ID');
  if (!cache.has(id)) cache.set(id, loadGLB(new URL(ASSET[id], ROOT).href));
  const gltf = await cache.get(id);
  const root = normalize(skeletonClone(gltf.scene));
  const actions = actionMap(gltf);
  for (const required of ['idle','walk','run','jump']) {
    if (!actions[required]) throw new Error(`AGCB_FORMAL_CANDIDATE_MISSING_${required.toUpperCase()}`);
  }
  return { id, meta, root, clips: gltf.animations || [], actions, visualGate: 'PENDING_USER_PREVIEW', prodEligible: false };
}

export function installFormalCandidateRuntime() {
  globalThis.__AGCB_FORMAL_CANDIDATE_RUNTIME = Object.freeze({
    release: FORMAL_CANDIDATE_RUNTIME_RELEASE,
    environment: 'TEST',
    prodEligible: false,
    ids: Object.freeze(Object.keys(ASSET)),
    load: loadFormalCandidate,
  });
  return globalThis.__AGCB_FORMAL_CANDIDATE_RUNTIME;
}
