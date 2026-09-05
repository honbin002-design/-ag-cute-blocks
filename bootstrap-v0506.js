// AG Cute Blocks V0.5.06 deterministic runtime bootstrap.
import './render-performance-runtime.js';
import './collision-cache-runtime.js';
import './raycast-budget-runtime.js';
import './mobile-viewport-lock-runtime.js?v=0.5.06';
import './ag-original-character-runtime.js';
import './ag-original-animal-runtime.js';

// Verified V0.5.04 world core remains untouched through the V0.5.06 wrapper.
import './app-v0506.js';

import './heading-runtime.js';
import './furniture-safety-runtime.js';
import './procedural-material-runtime.js';
import './building-extension-runtime.js?v=0.5.06';
import './character-polish-runtime.js';
import './asset-fetch-resilience-runtime.js?v=0.5.06';
import './character-asset-runtime-v0499.js';
import './character-motion-fix-runtime.js?v=0.5.06';
import './pet-grounding-runtime.js';

import './mobile-controls-runtime.js?v=0.5.06';
import './aim-reticle-runtime.js?v=0.5.06';
import './movement-mode-persistence-runtime.js?v=0.5.06';
import './mobile-input-runtime.js?v=0.5.06';
import './animal-life-runtime.js';
import './crop-care-runtime.js';
import './orchard-runtime.js';
import './furniture-life-details.js';
import './sleep-routine-v0499.js';
import './wildlife-live-runtime.js';
import './weather-visual-runtime.js';

// Fishing ecology remains the source of catch weighting; forecast is presentation only.
import './fishing-ecology-runtime-v0505.js?v=0.5.06';
import './fishing-forecast-runtime-v0506.js?v=0.5.06';

globalThis.__AGCB_BOOTSTRAP={version:'0.5.06',loaded:true,baseWorld:'0.5.04'};
