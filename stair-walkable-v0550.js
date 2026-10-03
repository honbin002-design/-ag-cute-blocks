// AG Cute Blocks V0.5.50 — stair compatibility shim.
// The active core already owns stair geometry, stairSurfaceY(), Step-Up, selection, rotation and removal.
// Do not generate duplicate helper meshes: they can diverge from the authoritative stair and interfere with aiming/collision.
const VERSION='V0.5.50';
function scan(){let n=0;const live=[...(globalThis.__AGCB_LIVE_AVATARS||[])].filter(x=>x?.parent).at(-1),w=live?.parent;if(w)for(const o of w.children){if(!o?.isMesh||o.userData?.kind!=='block'||(o.userData?.shape!=='stair'&&o.userData?.shape!=='stairs'))continue;o.visible=true;o.userData.solid=false;o.userData.walkable=true;o.userData.agWalkableStair=VERSION;globalThis.__AGCB_COLLISION_CACHE?.invalidateGeometry?.(o);n++}return n}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
globalThis.__AGCB_WALKABLE_STAIRS={version:VERSION,mode:'core-authoritative-no-helper-meshes',scan,rebuild:scan,get count(){return 0}};
