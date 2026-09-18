// AG Cute Blocks V0.5.142 — CC0 adult TEST runtime geometry / rig compatibility gate.
// Static structural gate only. This does NOT promote either candidate to PROD and does NOT claim animation/visual PASS.

import { FORMAL_CC0_ADULT_CANDIDATES, assertFormalCc0AdultTestOnly } from './formal-cc0-adult-candidate-manifest-v05141.js';

export const FORMAL_CC0_ADULT_RIG_GATE_RELEASE = 'V0.5.142';

const REQUIRED_HUMANOID_JOINTS = Object.freeze([
  'root','pelvis','spine_01','spine_02','spine_03','neck_01','Head',
  'clavicle_l','upperarm_l','lowerarm_l','hand_l',
  'clavicle_r','upperarm_r','lowerarm_r','hand_r',
  'thigh_l','calf_l','foot_l','ball_l',
  'thigh_r','calf_r','foot_r','ball_r',
]);

export const FORMAL_CC0_ADULT_SOURCE_INSPECTION = Object.freeze({
  formalCc0Male01: Object.freeze({
    nodes: 69, meshes: 3, skins: 1, embeddedAnimations: 0,
    jointCount: 65,
    joints: Object.freeze([
      'root','pelvis','spine_01','spine_02','spine_03','neck_01','Head',
      'clavicle_l','upperarm_l','lowerarm_l','hand_l',
      'index_01_l','index_02_l','index_03_l','index_04_leaf_l','middle_01_l','middle_02_l','middle_03_l','middle_04_leaf_l','pinky_01_l','pinky_02_l','pinky_03_l','pinky_04_leaf_l','ring_01_l','ring_02_l','ring_03_l','ring_04_leaf_l','thumb_01_l','thumb_02_l','thumb_03_l','thumb_04_leaf_l',
      'clavicle_r','upperarm_r','lowerarm_r','hand_r',
      'index_01_r','index_02_r','index_03_r','index_04_leaf_r','middle_01_r','middle_02_r','middle_03_r','middle_04_leaf_r','pinky_01_r','pinky_02_r','pinky_03_r','pinky_04_leaf_r','ring_01_r','ring_02_r','ring_03_r','ring_04_leaf_r','thumb_01_r','thumb_02_r','thumb_03_r','thumb_04_leaf_r',
      'thigh_l','calf_l','foot_l','ball_l','ball_leaf_l','thigh_r','calf_r','foot_r','ball_r','ball_leaf_r',
    ]),
  }),
  formalCc0Female01: Object.freeze({
    nodes: 69, meshes: 3, skins: 1, embeddedAnimations: 0,
    jointCount: 65,
    joints: Object.freeze([
      'root','pelvis','spine_01','spine_02','spine_03','neck_01','Head',
      'clavicle_l','upperarm_l','lowerarm_l','hand_l',
      'index_01_l','index_02_l','index_03_l','index_04_leaf_l','middle_01_l','middle_02_l','middle_03_l','middle_04_leaf_l','pinky_01_l','pinky_02_l','pinky_03_l','pinky_04_leaf_l','ring_01_l','ring_02_l','ring_03_l','ring_04_leaf_l','thumb_01_l','thumb_02_l','thumb_03_l','thumb_04_leaf_l',
      'clavicle_r','upperarm_r','lowerarm_r','hand_r',
      'index_01_r','index_02_r','index_03_r','index_04_leaf_r','middle_01_r','middle_02_r','middle_03_r','middle_04_leaf_r','pinky_01_r','pinky_02_r','pinky_03_r','pinky_04_leaf_r','ring_01_r','ring_02_r','ring_03_r','ring_04_leaf_r','thumb_01_r','thumb_02_r','thumb_03_r','thumb_04_leaf_r',
      'thigh_l','calf_l','foot_l','ball_l','ball_leaf_l','thigh_r','calf_r','foot_r','ball_r','ball_leaf_r',
    ]),
  }),
});

export function evaluateFormalCc0AdultRigGate(candidateId) {
  const candidate = assertFormalCc0AdultTestOnly(FORMAL_CC0_ADULT_CANDIDATES[candidateId]);
  const inspection = FORMAL_CC0_ADULT_SOURCE_INSPECTION[candidateId];
  if (!inspection) throw new Error('AGCB_FORMAL_CC0_ADULT_INSPECTION_MISSING');
  const missing = REQUIRED_HUMANOID_JOINTS.filter((joint) => !inspection.joints.includes(joint));
  const geometryPass = inspection.nodes > 0 && inspection.meshes > 0 && inspection.skins === 1;
  const humanoidRigPass = missing.length === 0 && inspection.jointCount >= REQUIRED_HUMANOID_JOINTS.length;
  const safeForRetargetTest = geometryPass && humanoidRigPass && inspection.embeddedAnimations === 0;
  return Object.freeze({
    candidateId,
    role: candidate.role,
    environment: candidate.environment,
    geometryGate: geometryPass ? 'PASS_STATIC_GLTF_STRUCTURE' : 'FAIL',
    humanoidRigGate: humanoidRigPass ? 'PASS_REQUIRED_JOINTS_PRESENT' : 'FAIL',
    missingRequiredJoints: Object.freeze(missing),
    embeddedAnimationGate: inspection.embeddedAnimations === 0 ? 'NONE_RETARGET_REQUIRED' : 'PRESENT_REVIEW_REQUIRED',
    nextGate: safeForRetargetTest ? 'ANIMATION_RETARGET_TEST' : 'HOLD',
    prodEligible: false,
  });
}

export function assertFormalCc0AdultRigGateReady(candidateId) {
  const result = evaluateFormalCc0AdultRigGate(candidateId);
  if (result.nextGate !== 'ANIMATION_RETARGET_TEST' || result.prodEligible !== false) {
    throw new Error('AGCB_FORMAL_CC0_ADULT_RIG_GATE_HOLD');
  }
  return result;
}
