// AG Cute Blocks V0.5.143 — CC0 adult animation retarget structural gate.
// TEST-only. This records structural compatibility; it does NOT claim visual deformation PASS or PROD eligibility.

export const FORMAL_CC0_ADULT_RETARGET_RELEASE = 'V0.5.143';

export const FORMAL_CC0_ADULT_RETARGET_GATE = Object.freeze({
  environment: 'TEST',
  prodEligible: false,

  target: Object.freeze({
    candidates: ['formalCc0Male01', 'formalCc0Female01'],
    sourcePack: 'Quaternius Universal Base Characters Standard',
    license: 'CC0-1.0',
    nodesEach: 69,
    meshesEach: 3,
    skinsEach: 1,
    jointsEach: 65,
    embeddedAnimationsEach: 0,
    runtimeGeometryGate: 'PASS_STRUCTURAL_V05142',
  }),

  donorRoutes: Object.freeze({
    existingGameplayV052: Object.freeze({
      status: 'PASS_SOURCE_CLIPS',
      clips: ['Idle', 'Walk', 'Run', 'Jump'],
      joints: 49,
      note: 'Existing gameplay boy/girl v052 baseline already proves these locomotion semantics are available. Retarget still requires bind-pose-safe remapping to the new 65-joint target.',
    }),
    quaterniusUAL: Object.freeze({
      status: 'PASS_EXISTING_CC0_SOURCE_ROUTE',
      license: 'CC0-1.0',
      requiredSemantics: Object.freeze({
        idle: ['Idle_Loop'],
        walk: ['Walk_Loop'],
        run: ['Jog_Fwd_Loop', 'Sprint_Loop'],
        jump: ['Jump_Start', 'Jump_Loop', 'Jump_Land'],
      }),
      note: 'Repository already contains a pinned UAL Standard source gate. Reuse that provenance/semantic route; do not introduce Mixamo or a paid animation dependency.',
    }),
  }),

  semanticContract: Object.freeze({
    required: ['hips', 'spine', 'chest', 'neck', 'head',
      'leftShoulder', 'leftUpperArm', 'leftLowerArm', 'leftHand',
      'rightShoulder', 'rightUpperArm', 'rightLowerArm', 'rightHand',
      'leftUpperLeg', 'leftLowerLeg', 'leftFoot',
      'rightUpperLeg', 'rightLowerLeg', 'rightFoot'],
    targetCoreGate: 'PASS_ALL_REQUIRED_HUMANOID_JOINTS_PRESENT_V05142',
    shoulderRule: 'LEFT_RIGHT_INDEPENDENT_PRESERVE_BIND_POSE_OFFSETS',
    rootMotionRule: 'DO_NOT_ASSUME_SOURCE_ROOT_TRANSLATION_MATCHES_GAMEPLAY_CONTROLLER',
    transformRule: 'RETARGET_ROTATIONAL_DELTAS_AGAINST_SOURCE_AND_TARGET_BIND_POSES',
  }),

  clipContract: Object.freeze({
    idle: 'SOURCE_AVAILABLE_TARGET_RETARGET_PENDING',
    walk: 'SOURCE_AVAILABLE_TARGET_RETARGET_PENDING',
    run: 'SOURCE_AVAILABLE_TARGET_RETARGET_PENDING',
    jump: 'SOURCE_AVAILABLE_TARGET_RETARGET_PENDING',
  }),

  structuralRetargetEligibility: 'PASS',
  generatedRetargetedBinary: 'PENDING_BUILD',
  runtimePlaybackGate: 'PENDING',
  deformationVisualGate: 'PENDING',
  agVisualGate: 'PENDING',
  prodPromotionGate: 'HOLD',
});

export function assertFormalCc0AdultRetargetTestOnly(gate = FORMAL_CC0_ADULT_RETARGET_GATE) {
  if (!gate || gate.environment !== 'TEST' || gate.prodEligible !== false || gate.prodPromotionGate !== 'HOLD') {
    throw new Error('AGCB_FORMAL_CC0_ADULT_RETARGET_ENV_GUARD');
  }
  if (gate.structuralRetargetEligibility !== 'PASS') {
    throw new Error('AGCB_FORMAL_CC0_ADULT_RETARGET_STRUCTURE_GUARD');
  }
  return gate;
}
