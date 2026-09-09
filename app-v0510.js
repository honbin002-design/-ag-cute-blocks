// AG Cute Blocks world-core compatibility wrapper.
// V0.5.04 contains the complete fishing/tool feature set but historically failed
// during startup because syncActionLabels() read category/selected inside their TDZ.
// V0.5.88 first installs a one-shot tree resource guard, then the guarded loader
// patches only verified core signatures in memory and fails closed on mismatch.
// bootstrap-v0510.js remains the only visible release-version owner.
import './tree-resource-integrity-preload-v0588.js';
import './app-v0504-fixed-loader.js';
globalThis.__AGCB_RELEASE_OVERLAY={base:'0.5.04',additive:true,recovery:'v0504-tdz-fixed-loader+v0588-tree-resource-preload',rollbackBase:'0.5.03',versionOwner:'bootstrap-v0510.js',legacyVersionWriteDisabled:true};
