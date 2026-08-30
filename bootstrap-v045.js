// AG Cute Blocks V0.4.5 deterministic runtime bootstrap.
// Performance/collision patches must be active before the main world creates its renderer.
import './render-performance-runtime.js';
import './collision-cache-runtime.js';
import './raycast-budget-runtime.js';

// Main world establishes the live scene/player/object registries used by extension runtimes.
import './app-v043.js';

// Heading correction is installed after base initialization but before the first animation frame.
import './heading-runtime.js';

// Input and life extensions attach after the main HUD/world handlers exist.
import './mobile-input-runtime.js';
import './animal-life-runtime.js';
import './crop-care-runtime.js';
import './orchard-runtime.js';
import './furniture-life-details.js';
import './sleep-routine.js';
import './wildlife-live-runtime.js';

globalThis.__AGCB_BOOTSTRAP={version:'0.4.5',loaded:true};
