// AG Cute Blocks world-core compatibility wrapper.
// V0.5.04 contains the complete fishing/tool feature set but historically failed
// during startup because syncActionLabels() read category/selected inside their TDZ.
// V0.5.88 installs the tree resource guard; V0.5.92 installs persistent artificial-water
// data + connected neighbor-aware pond visuals; the fixed loader applies verified core repairs.
// V0.5.101 keeps bootstrap as the single version owner and adds strict PROD/TEST save isolation,
// environment-bound Drive backup verification, backward-compatible promotion gates,
// and a non-destructive rollback-safe save migration registry.
import './tree-resource-integrity-preload-v0588.js';
import './terrain-artificial-water-preload-v0592.js';
import './release-version-v05101.js';
import './app-v0504-fixed-loader.js';
globalThis.__AGCB_RELEASE_OVERLAY={base:'0.5.04',additive:true,recovery:'v0504-tdz-fixed-loader+v0588-tree-resource-preload+v0592-connected-artificial-water+v05101-finite-reload-version-convergence+catalog-search+catalog-recent-favorites+conflict-safe-build-undo-redo+environment-bound-complete-save-envelope+environment-bound-verified-drive-backup+backward-compatible-promotion-gate+rollback-safe-save-migration-registry',rollbackBase:'0.5.03',versionOwner:'bootstrap-v0510.js',runtimeVersion:'0.5.101',legacyVersionWriteDisabled:true};