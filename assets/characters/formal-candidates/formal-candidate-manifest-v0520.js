// AG Cute Blocks V0.5.122 — TEST-only formal character candidate integrity manifest.
// This file does NOT promote either model to PROD or claim visual/license approval.

export const FORMAL_CHARACTER_CANDIDATE_RELEASE = 'V0.5.122';

export const FORMAL_CHARACTER_CANDIDATES = Object.freeze({
  formalMale01: Object.freeze({
    sourceName: '05_q_adult_male.glb',
    role: 'adult_male',
    environment: 'TEST',
    expectedBytes: 970188,
    sha256: '1db922fb1fe846c70d6260679c0e7c1564ea47f9862af9ccd7f766b2b8cf5377',
    sourceIntegrity: 'PASS',
    geometryLoad: 'PASS',
    visualGate: 'PENDING_RUNTIME_PREVIEW',
    licenseGate: 'HOLD_NO_LICENSE_EVIDENCE',
    prodEligible: false,
  }),
  formalFemale01: Object.freeze({
    sourceName: '06_q_adult_female_repaired.glb',
    originalSourceName: '06_q_adult_female.glb',
    role: 'adult_female',
    environment: 'TEST',
    expectedBytes: 1073848,
    originalSha256: '30ed406e1a392f53748fe7d8143053725d565f184b0d54330eed652f1c5bffc0',
    sha256: 'ef341fa15253a99e653a4aa511df176db509ff763ce6b4ef62a8ade6068c4254',
    sourceIntegrity: 'PASS',
    geometryLoad: 'PASS_AFTER_JSON_PADDING_REPAIR',
    repairScope: 'TEST_COPY_JSON_PADDING_ONLY_NO_REMODEL',
    visualGate: 'PENDING_RUNTIME_PREVIEW',
    licenseGate: 'HOLD_NO_LICENSE_EVIDENCE',
    prodEligible: false,
  }),
});

export function assertFormalCandidateTestOnly(candidate) {
  if (!candidate || candidate.environment !== 'TEST' || candidate.prodEligible !== false) {
    throw new Error('AGCB_FORMAL_CANDIDATE_ENV_GUARD');
  }
  return candidate;
}
