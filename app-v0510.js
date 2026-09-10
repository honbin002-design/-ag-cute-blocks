// AG Cute Blocks world-core compatibility wrapper.
// V0.5.04 contains the complete fishing/tool feature set but historically failed
// during startup because syncActionLabels() read category/selected inside their TDZ.
// V0.5.88 installs the tree resource guard; V0.5.92 installs persistent artificial-water
// data + connected neighbor-aware pond visuals; the fixed loader applies verified core repairs.
// V0.5.102 keeps bootstrap as the single version owner and adds an authenticated TEST-only
// Drive bridge server/client foundation while PROD write/restore remain disabled.
import './tree-resource-integrity-preload-v0588.js';
import './terrain-artificial-water-preload-v0592.js';
import './release-version-v05102.js';
import './app-v0504-fixed-loader.js';
globalThis.__AGCB_RELEASE_OVERLAY={base:'0.5.04',additive:true,recovery:'v0504-tdz-fixed-loader+v0588-tree-resource-preload+v0592-connected-artificial-water+v05102-finite-reload-version-convergence+catalog-search+catalog-recent-favorites+conflict-safe-build-undo-redo+environment-bound-complete-save-envelope+authenticated-test-drive-backup+backward-compatible-promotion-gate+rollback-safe-save-migration-registry',rollbackBase:'0.5.03',versionOwner:'bootstrap-v0510.js',runtimeVersion:'0.5.102',legacyVersionWriteDisabled:true};