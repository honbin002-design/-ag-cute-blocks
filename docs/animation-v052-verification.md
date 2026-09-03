# V0.4.52 — finite avatar animation
- Visible version: V0.4.52.
- Service Worker cache: ag-cute-blocks-v045-runtime96.
- Reproduction: V0.4.51's arm offsets omit x, but rotation.set reads pose.x.
  Even while idle, undefined * 0 produces NaN. Invalid bone transforms can
  propagate through skinning, including through zero-weight matrix terms.
- Fix: provide all three offset components; sanitize time, phase, blend,
  baseline and offset inputs; use the updated walk blend in the same frame.
- Scope: no GLB, material, mesh, rig-weight, swing-axis or amplitude changes.
  Existing 1.35x Walk_Cycle and per-frame __AGCB_ASSET_TICK wiring retained.
- Regression: tests/asset-animation-regression.cjs fails on V0.4.51 at frame 1.
  V0.4.52 passes 12,626 runtime frames across 30/60/120 fps, idle/walk/stop/restart,
  invalid inputs, missing bones/baselines, six moving arm bones and 1.35x walk.
- Original GLB CPU check: 239,926 vertices at five poses (1,199,630 evaluations).
  All positions and bone matrices finite; head remains non-collapsed.
  All 16 local model chunks matched the existing GitHub blob SHAs.
- CI: the new regression command is included in JavaScript syntax check.
- Acceptance boundary: CPU math and CI are not a rendered iPhone visual test.
  Full avatar visibility and natural swing still require one on-device check.
- Original working tree preserved. Its 9 modified files were not edited.
