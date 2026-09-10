// AG Cute Blocks world-core compatibility wrapper.
// V0.5.04 contains the complete fishing/tool feature set but historically failed
// during startup because syncActionLabels() read category/selected inside their TDZ.
// V0.5.88 installs the tree resource guard; V0.5.92 installs persistent artificial-water
// data + connected neighbor-aware pond visuals; the fixed loader applies verified core repairs.
// V0.5.93 uses bootstrap as the single version owner and a finite reload convergence helper.
import './tree-resource-integrity-preload-v0588.js';
import './terrain-artificial-water-preload-v0592.js';
import './release-version-v0593.js';
import './app-v0504-fixed-loader.js';
globalThis.__AGCB_RELEASE_OVERLAY={base:'0.5.04',additive:true,recovery:'v0504-tdz-fixed-loader+v0588-tree-resource-preload+v0592-connected-artificial-water+v0593-finite-reload-version-convergence',rollbackBase:'0.5.03',versionOwner:'bootstrap-v0510.js',runtimeVersion:'0.5.93',legacyVersionWriteDisabled:true};
