// AG Cute Blocks V0.4.5 deterministic runtime bootstrap.
// Performance/collision patches must be active before the main world creates its renderer.
import './render-performance-runtime.js?v=0.4.66';
import './collision-cache-runtime.js?v=0.4.66';
import './raycast-budget-runtime.js?v=0.4.66';
import './ag-original-character-runtime.js?v=0.4.66';
import './ag-original-animal-runtime.js?v=0.4.66';

// Main world establishes the live scene/player/object registries used by extension runtimes.
// Midnight progression now calls daily-progression-system.js directly inside the core app.
import './app-v043.js?v=0.4.66';

// Core corrections and visual/building surface upgrades attach after base initialization.
import './heading-runtime.js?v=0.4.66';
import './furniture-safety-runtime.js?v=0.4.66';
import './procedural-material-runtime.js?v=0.4.66';
import './building-extension-runtime.js?v=0.4.66';
import './character-polish-runtime.js?v=0.4.66';
import './character-asset-runtime.js?v=0.4.66';
import './pet-grounding-runtime.js?v=0.4.66';

// Mobile control presentation attaches after the HUD exists, before input handlers.
import './mobile-controls-runtime.js?v=0.4.66';

// Input and life extensions attach after the main HUD/world handlers exist.
import './mobile-input-runtime.js?v=0.4.66';
import './animal-life-runtime.js?v=0.4.66';
import './crop-care-runtime.js?v=0.4.66';
import './orchard-runtime.js?v=0.4.66';
import './furniture-life-details.js?v=0.4.66';
import './sleep-routine.js?v=0.4.66';
import './wildlife-live-runtime.js?v=0.4.66';
import './weather-visual-runtime.js?v=0.4.66';

globalThis.__AGCB_BOOTSTRAP={version:'0.4.5',loaded:true};
