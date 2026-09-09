# Manus5 ↔ v052 49-bone mapping

Scope: structural mapping only. No runtime activation, no character replacement, no animation retarget commit.

| v052 | Manus5 |
|---|---|
| Hips | pelvis |
| Spine | spine_01 |
| Chest | chest |
| Neck | neck |
| Head | head |
| LeftShoulder | spine_02 |
| LeftUpperArm | upperarm_L |
| LeftLowerArm | lowerarm_L |
| LeftHand | hand_L |
| RightShoulder | spine_02 |
| RightUpperArm | upperarm_R |
| RightLowerArm | lowerarm_R |
| RightHand | hand_R |
| LeftUpperLeg | thigh_L |
| LeftLowerLeg | shin_L |
| LeftFoot | foot_L |
| RightUpperLeg | thigh_R |
| RightLowerLeg | shin_R |
| RightFoot | foot_R |
| LeftHandThumb1 | thumb_01_L |
| LeftHandThumb2 | thumb_02_L |
| LeftHandThumb3 | thumb_03_L |
| LeftHandIndex1 | index_01_L |
| LeftHandIndex2 | index_02_L |
| LeftHandIndex3 | index_03_L |
| LeftHandMiddle1 | middle_01_L |
| LeftHandMiddle2 | middle_02_L |
| LeftHandMiddle3 | middle_03_L |
| LeftHandRing1 | ring_01_L |
| LeftHandRing2 | ring_02_L |
| LeftHandRing3 | ring_03_L |
| LeftHandLittle1 | pinky_01_L |
| LeftHandLittle2 | pinky_02_L |
| LeftHandLittle3 | pinky_03_L |
| RightHandThumb1 | thumb_01_R |
| RightHandThumb2 | thumb_02_R |
| RightHandThumb3 | thumb_03_R |
| RightHandIndex1 | index_01_R |
| RightHandIndex2 | index_02_R |
| RightHandIndex3 | index_03_R |
| RightHandMiddle1 | middle_01_R |
| RightHandMiddle2 | middle_02_R |
| RightHandMiddle3 | middle_03_R |
| RightHandRing1 | ring_01_R |
| RightHandRing2 | ring_02_R |
| RightHandRing3 | ring_03_R |
| RightHandLittle1 | pinky_01_R |
| RightHandLittle2 | pinky_02_R |
| RightHandLittle3 | pinky_03_R |

## Validation result

- v052 required joints: 49
- Manus5 joints: 49
- Direct/semantic mapping rows: 49
- Unique Manus5 targets used by this draft: 47
- Ambiguity: LeftShoulder and RightShoulder both currently collapse to `spine_02` because Manus5 has no explicit shoulder/clavicle joints.
- Extra Manus5 root joint: `root` has no direct v052 equivalent and should be treated as scene/rig root, not deform-bone retarget target.

## Conclusion

A full 49-row semantic mapping exists, but it is NOT yet a true 49/49 one-to-one deform-bone mapping because Manus5 lacks explicit left/right shoulder joints and includes an extra `root` hierarchy joint. Run/Jump retargeting remains feasible, but shoulder/clavicle rotation must be handled by a retarget rule (distributed to upper arms and/or spine_02), not by simple bone-name substitution.

STATUS: MAPPING DRAFT COMPLETE / ONE-TO-ONE VALIDATION NOT PASS.
