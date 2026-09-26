// AG Cute Blocks — single authority for iPhone/gameplay control selectors.
// Keep gesture policy and immediate-action runtimes on the same control surface.
export const GAMEPLAY_CONTROL_SELECTORS=['#joy','#jump','#add','#del','#rot','#lifeInteract','#cam','#lifeBtn','#runToggle','#agWardrobeBtn','#agWardrobe','.item','.cat','.panel','.lifePanel','.waterCropBtn','.sleepMorning','.sleepWake','.furnitureExtra','#agCastleDoorBtn','#agC3Dock'];
export const GAMEPLAY_CONTROL_SELECTOR=GAMEPLAY_CONTROL_SELECTORS.join(',');
export const IMMEDIATE_ACTION_SELECTORS=['#jump','#add','#del','#rot','#lifeInteract','#cam','#lifeBtn','#runToggle','.sleepMorning','.sleepWake','.furnitureExtra','.waterCropBtn','#agWardrobeBtn','#agCastleDoorBtn'];
globalThis.__AGCB_GAMEPLAY_CONTROLS={selectors:GAMEPLAY_CONTROL_SELECTORS,selector:GAMEPLAY_CONTROL_SELECTOR,immediate:IMMEDIATE_ACTION_SELECTORS};
