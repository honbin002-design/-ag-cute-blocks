// AG Cute Blocks V0.5.141 — provenance-proven CC0 adult character TEST candidate manifest.
// No PROD promotion. Source is the exact Quaternius Standard archive verified in PROVENANCE.md.

export const FORMAL_CC0_ADULT_CANDIDATE_RELEASE = 'V0.5.141';
export const FORMAL_CC0_SOURCE_ARCHIVE_SHA256 = 'fdbf1804c90dfc1ea03e992bff7da2dfd1a79318e13270a660180f9308455f40';

export const FORMAL_CC0_ADULT_CANDIDATES = Object.freeze({
  formalCc0Male01: Object.freeze({
    role: 'adult_male',
    environment: 'TEST',
    sourceAuthor: 'Quaternius',
    sourcePack: 'Universal Base Characters Standard',
    license: 'CC0-1.0',
    sourcePath: 'Universal Base Characters[Standard]/Base Characters/Godot - UE/Superhero_Male_FullBody.gltf',
    gltfBytes: 30989,
    gltfSha256: 'e7fcea214ecf8855afbf910b50de6f9c7d1decfb71ca28bad8a4481452dafeb4',
    binBytes: 720076,
    binSha256: '459003f9745853ae562a85506a2b94dd56515c1f37728f9fa3d2ce1a3e4cd92f',
    sourceIntegrity: 'PASS',
    licenseGate: 'PASS_CC0_1_0',
    skinGate: 'PASS_ONE_SKIN',
    embeddedAnimationGate: 'NONE_RETARGET_REQUIRED',
    runtimeGeometryGate: 'PENDING',
    animationCompatibilityGate: 'PENDING',
    visualGate: 'PENDING',
    prodEligible: false,
  }),
  formalCc0Female01: Object.freeze({
    role: 'adult_female',
    environment: 'TEST',
    sourceAuthor: 'Quaternius',
    sourcePack: 'Universal Base Characters Standard',
    license: 'CC0-1.0',
    sourcePath: 'Universal Base Characters[Standard]/Base Characters/Godot - UE/Superhero_Female_FullBody.gltf',
    gltfBytes: 31656,
    gltfSha256: 'adedf28000a0716f689b009a70314506fc62f827498f77ba852acb5610f3f3f4',
    binBytes: 990808,
    binSha256: '3a8220a485b33d05d879115a50697728b45a151781106033afb8b8c243fca208',
    sourceIntegrity: 'PASS',
    licenseGate: 'PASS_CC0_1_0',
    skinGate: 'PASS_ONE_SKIN',
    embeddedAnimationGate: 'NONE_RETARGET_REQUIRED',
    runtimeGeometryGate: 'PENDING',
    animationCompatibilityGate: 'PENDING',
    visualGate: 'PENDING',
    prodEligible: false,
  }),
});

export function assertFormalCc0AdultTestOnly(candidate) {
  if (!candidate || candidate.environment !== 'TEST' || candidate.prodEligible !== false || candidate.license !== 'CC0-1.0') {
    throw new Error('AGCB_FORMAL_CC0_ADULT_ENV_GUARD');
  }
  return candidate;
}
