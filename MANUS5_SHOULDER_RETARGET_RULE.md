# Manus5 Shoulder / Clavicle Retarget Compensation

Scope: analysis-only. No runtime activation, no replacement of current v052 characters, no gameplay release change.

## Confirmed skeleton difference

Current v052 has explicit clavicle/shoulder joints:
- LeftShoulder -> LeftUpperArm
- RightShoulder -> RightUpperArm

Manus5 has no dedicated clavicle/shoulder joints:
- spine_02 / chest -> upperarm_L
- spine_02 / chest -> upperarm_R

Therefore `LeftShoulder` and `RightShoulder` must NOT both be mapped directly to `spine_02`, because that would mix independent left/right shoulder motion into one shared torso joint.

## Minimal compensation rule

For locomotion retargeting only:

1. Keep torso chain mapping independent:
   - Chest -> chest
   - Spine -> spine_01 / spine_02 according to the normal torso mapping

2. Fold each missing clavicle rotation into its own upper arm:
   - source LeftShoulder rotation is composed into target upperarm_L before source LeftUpperArm rotation
   - source RightShoulder rotation is composed into target upperarm_R before source RightUpperArm rotation

3. Do not add arbitrary percentage weighting to spine_02 at this stage.

4. Translation from source shoulder joints is ignored for locomotion clips unless a later pose test proves it is required.

5. Preserve target Manus5 bind-pose offsets; apply retargeted animation as rotational deltas rather than replacing bind transforms.

## Why this is the safest first rule

- Left/right shoulder motion remains independent.
- Torso twist is not contaminated by arm swing.
- No guessed numeric weighting is introduced.
- The rule is reversible and isolated to retargeted animation clips.

## Validation status

STRUCTURAL RULE: PASS
VISUAL MOTION: NOT YET PASS

The next required step is a non-production Run/Jump retarget test on one Manus5 variant and inspection for shoulder collapse, arm penetration, or excessive shrugging.
