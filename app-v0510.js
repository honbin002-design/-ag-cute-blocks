// AG Cute Blocks world-core compatibility wrapper.
// V0.5.04 contains the complete fishing/tool feature set but historically failed
// during startup because syncActionLabels() read category/selected inside their TDZ.
// The guarded loader patches only that exact startup call in memory and fails closed
// if the historical source no longer matches the verified signature.
// bootstrap-v0510.js remains the only visible release-version owner.
import './app-v0504-fixed-loader.js';
globalThis.__AGCB_RELEASE_OVERLAY={base:'0.5.04',additive:true,recovery:'v0504-tdz-fixed-loader',rollbackBase:'0.5.03',versionOwner:'bootstrap-v0510.js',legacyVersionWriteDisabled:true};
