// AG Cute Blocks V0.5.149 — adult CC0 runtime materialization contract.
// TEST-only. Defines exact source -> retargeted runtime output requirements before binary generation.

import { FORMAL_CC0_ADULT_CANDIDATES, assertFormalCc0AdultTestOnly } from './formal-cc0-adult-candidate-manifest-v05141.js';
import { assertFormalCc0AdultRigGateReady } from './formal-cc0-adult-rig-gate-v05142.js';
import { FORMAL_CC0_ADULT_RETARGET_GATE, assertFormalCc0AdultRetargetTestOnly } from './formal-cc0-adult-animation-retarget-gate-v05143.js';

export const FORMAL_CC0_ADULT_MATERIALIZATION_RELEASE = 'V0.5.149';

const CLIP_PLAN = Object.freeze({
  idle: Object.freeze({ source: 'Idle_Loop', runtime: 'Idle', loop: true }),
  walk: Object.freeze({ source: 'Walk_Loop', runtime: 'Walk', loop: true }),
  run: Object.freeze({ source: 'Jog_Fwd_Loop', runtime: 'Run', loop: true }),
  jumpStart: Object.freeze({ source: 'Jump_Start', runtime: 'Jump_Start', loop: false }),
  jumpLoop: Object.freeze({ source: 'Jump_Loop', runtime: 'Jump_Loop', loop: true }),
  jumpLand: Object.freeze({ source: 'Jump_Land', runtime: 'Jump_Land', loop: false }),
});

export const FORMAL_CC0_ADULT_RUNTIME_OUTPUTS = Object.freeze({
  formalCc0Male01: Object.freeze({
    outputPath: 'assets/characters/formal-cc0/runtime/formalCc0Male01-retarget-v05149.glb',
    role: 'adult_male',
  }),
  formalCc0Female01: Object.freeze({
    outputPath: 'assets/characters/formal-cc0/runtime/formalCc0Female01-retarget-v05149.glb',
    role: 'adult_female',
  }),
});

export function buildFormalCc0AdultMaterializationContract(candidateId) {
  const candidate = assertFormalCc0AdultTestOnly(FORMAL_CC0_ADULT_CANDIDATES[candidateId]);
  const rig = assertFormalCc0AdultRigGateReady(candidateId);
  const retarget = assertFormalCc0AdultRetargetTestOnly(FORMAL_CC0_ADULT_RETARGET_GATE);
  const output = FORMAL_CC0_ADULT_RUNTIME_OUTPUTS[candidateId];
  if (!output) throw new Error('AGCB_FORMAL_CC0_ADULT_RUNTIME_OUTPUT_MISSING');
  if (rig.humanoidRigGate !== 'PASS_REQUIRED_JOINTS_PRESENT') throw new Error('AGCB_FORMAL_CC0_ADULT_RIG_NOT_READY');
  return Object.freeze({
    release: FORMAL_CC0_ADULT_MATERIALIZATION_RELEASE,
    candidateId,
    role: candidate.role,
    environment: 'TEST',
    sourceGltf: candidate.sourcePath,
    sourceGltfSha256: candidate.gltfSha256,
    sourceBinSha256: candidate.binSha256,
    targetJointCount: 65,
    retargetMethod: retarget.semanticContract.transformRule,
    shoulderRule: retarget.semanticContract.shoulderRule,
    rootMotionRule: retarget.semanticContract.rootMotionRule,
    clips: CLIP_PLAN,
    outputPath: output.outputPath,
    outputBinarySha256: 'PENDING_BUILD',
    requiredPostBuildGates: Object.freeze([
      'OUTPUT_FILE_EXISTS',
      'OUTPUT_GLTF_OR_GLB_PARSE',
      'TARGET_SKIN_PRESENT',
      'REQUIRED_RUNTIME_CLIPS_PRESENT',
      'NO_NAN_OR_INF_TRANSFORMS',
      'RUNTIME_PLAYBACK_TEST',
      'VISUAL_DEFORMATION_TEST',
    ]),
    runtimePlayback: 'PENDING',
    visualDeformation: 'PENDING',
    prodEligible: false,
    prodPromotion: 'HOLD',
  });
}

export function assertFormalCc0AdultMaterializationContract(candidateId) {
  const contract = buildFormalCc0AdultMaterializationContract(candidateId);
  if (contract.environment !== 'TEST' || contract.prodEligible !== false || contract.prodPromotion !== 'HOLD') {
    throw new Error('AGCB_FORMAL_CC0_ADULT_MATERIALIZATION_ENV_GUARD');
  }
  return contract;
}
