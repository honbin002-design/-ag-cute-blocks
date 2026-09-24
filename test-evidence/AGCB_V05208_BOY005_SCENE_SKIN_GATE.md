# V0.5.208 Boy005 scene/skin binding gate

Date: 2026-09-24
Environment: TEST
Netlify: NOT USED
PROD: HOLD

Direct inspection of the Drive Boy005 GLB confirms:

- 41 total nodes.
- 21 mesh nodes.
- 21 skins.
- Every mesh node references a skin.
- Every skin uses the same native AGCB skeleton root: node 23 (agcb-root).
- Every skin contains exactly the same 18 AGCB joints.
- Rig hierarchy is rooted through AG_Boy_Study_005 -> Rig -> agcb-root.
- All 21 mesh nodes and the rig root are included in the active scene roots.
- No detached/unskinned visible mesh node was found.

Native rig hierarchy:
agcb-root
  -> agcb-hips
     -> agcb-spine -> agcb-chest
        -> agcb-neck -> agcb-head
        -> left arm chain
        -> right arm chain
     -> left leg chain
     -> right leg chain

Result:
- SCENE_BINDING_GATE = PASS
- SKIN_BINDING_GATE = PASS
- COMMON_18_BONE_SKELETON_GATE = PASS
- VISUAL_RENDER_GATE = PENDING
- PLAYABLE_ROUTE_PROMOTION = HOLD
- PROD_PROMOTION = HOLD

Scope note:
This proves scene inclusion and skin-to-skeleton consistency directly from the GLB. It does not claim rendered material appearance, deformation aesthetics, foot contact, camera framing, or transition quality.
