// AG Cute Blocks guarded V0.5.04 loader.
// Recover the complete V0.5.04 world/fishing feature set while applying only
// verified startup/input compatibility repairs in memory. Historical source stays
// untouched. Every patch is signature-count gated and fails closed on mismatch.

const SOURCE_URL=new URL('./app-v0504.js',import.meta.url);
const original=await fetch(SOURCE_URL,{cache:'no-cache'}).then(r=>{
  if(!r.ok)throw new Error(`V0.5.04 source fetch failed: ${r.status}`);
  return r.text();
});

const patches=[
  {
    id:'syncActionLabels-tdz-defer',
    from:"document.head.appendChild(st)};syncActionLabels();\n\nconst scene=new THREE.Scene()",
    to:"document.head.appendChild(st)};queueMicrotask(syncActionLabels);\n\nconst scene=new THREE.Scene()"
  },
  {
    id:'player-axe-action-label',
    from:"const addLabel=category==='農具'?(selected==='fishingRod'?['🎣','釣魚']:['⛏️','使用']):['＋','放置'];",
    to:"const addLabel=category==='農具'?(selected==='fishingRod'?['🎣','釣魚']:selected==='axe'?['🪓','砍樹']:['⛏️','使用']):['＋','放置'];"
  },
  {
    id:'player-axe-catalog',
    from:"'農具':[['hoe','⛏️','鋤頭'],['fishingRod','🎣','釣魚竿']]",
    to:"'農具':[['hoe','⛏️','鋤頭'],['axe','🪓','斧頭'],['fishingRod','🎣','釣魚竿']]"
  },
  {
    id:'player-axe-authoritative-use',
    from:"if(category==='農具'&&selected==='fishingRod'){castFishing(p);return;}if(category==='農具'&&selected==='hoe'){",
    to:"if(category==='農具'&&selected==='fishingRod'){castFishing(p);return;}if(category==='農具'&&selected==='axe'){let o=h.object;while(o.parent&&o.parent!==world)o=o.parent;if(o.userData?.type!=='tree')return toast('請把準星對準樹木');if(Math.hypot(o.position.x-player.position.x,o.position.z-player.position.z)>5.5)return toast('距離太遠，請靠近樹木');const r=globalThis.__AGCB_WORLD_TASK_API?.chopTreeById?.(o.userData.id);if(r?.ok){toast('🪓 砍下樹木，木材 +1');return}return toast(r?.reason==='stump-regrowing'?'樹樁正在重新生長':'這棵樹目前不能砍')}if(category==='農具'&&selected==='hoe'){"
  },
  {
    id:'wild-tree-regrowth-state',
    from:"g.userData={kind:'object',id:r.id||id(),type:r.type,solid:true,growth:r.growth??.2,affection:r.affection??0,lastProductDay:r.lastProductDay??0,productReady:r.productReady};",
    to:"g.userData={kind:'object',id:r.id||id(),type:r.type,solid:true,growth:r.growth??.2,affection:r.affection??0,lastProductDay:r.lastProductDay??0,productReady:r.productReady,treeState:r.treeState||'grown',regrowDay:Number(r.regrowDay||0),regrowAt:Number(r.regrowAt||0)};"
  },
  {
    id:'wild-tree-stump-model',
    from:"else if(t==='tree'){box(g,.42,2,.42,0,1,0,'wood');sphere(g,1.18,0,2.15,0,0x67ad62,[1,.9,1])}else return null;",
    to:"else if(t==='tree'){if(g.userData.treeState==='stump'){box(g,.52,.42,.52,0,.21,0,'wood');g.userData.solid=false}else{box(g,.42,2,.42,0,1,0,'wood');sphere(g,1.18,0,2.15,0,0x67ad62,[1,.9,1])}}else return null;"
  },
  {
    id:'wild-tree-regrowth-snapshot',
    from:"objects:objects.map(o=>({id:o.userData.id,type:o.userData.type,x:o.position.x,z:o.position.z,rot:o.rotation.y,growth:o.userData.growth,affection:o.userData.affection,lastProductDay:o.userData.lastProductDay,productReady:o.userData.productReady}))",
    to:"objects:objects.map(o=>({id:o.userData.id,type:o.userData.type,x:o.position.x,z:o.position.z,rot:o.rotation.y,growth:o.userData.growth,affection:o.userData.affection,lastProductDay:o.userData.lastProductDay,productReady:o.userData.productReady,treeState:o.userData.treeState,regrowDay:o.userData.regrowDay,regrowAt:o.userData.regrowAt}))"
  },
  {
    id:'legacy-doubletap-blocker-suppress',
    from:"let lastTouchEnd=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouchEnd<=350)e.preventDefault();lastTouchEnd=now},{passive:false});",
    to:"let lastTouchEnd=0;/* AG guarded recovery: double-tap policy is owned by mobile-viewport-lock-runtime.js */"
  },
  {
    id:'legacy-blanket-multitouch-suppress',
    from:"document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});",
    to:"/* AG guarded recovery: legacy blanket multitouch blocker suppressed; control-aware policy is owned by mobile-viewport-lock-runtime.js */"
  },
  {
    id:'active-furniture-state-bridge',
    from:"const playerState={mode:'free',anchor:null,previousCamera:null};",
    to:"const playerState={mode:'free',anchor:null,previousCamera:null};globalThis.__AGCB_ACTIVE_FURNITURE_STATE={version:1,get mode(){return playerState.mode},get anchor(){return playerState.anchor},get type(){return playerState.anchor?.userData?.type||''},get active(){return playerState.mode!=='free'&&!!playerState.anchor}};"
  },
  {
    id:'authoritative-world-task-bridge',
    from:"}lifeUI.interact.onclick=interact;",
    to:"}lifeUI.interact.onclick=interact;const TREE_REGROW_MIN_MS=60000,TREE_REGROW_MAX_MS=180000;const randomTreeRegrowMs=()=>Math.floor(TREE_REGROW_MIN_MS+Math.random()*(TREE_REGROW_MAX_MS-TREE_REGROW_MIN_MS+1));function taskObjectById(id){return objects.find(o=>String(o.userData?.id||'')===String(id||''))||null}function listMatureCrops(){return objects.filter(o=>o.userData?.crop&&Number(o.userData.growth||0)>=.95).map(o=>({id:o.userData.id,itemId:o.userData.crop,x:o.position.x,z:o.position.z,growth:Number(o.userData.growth||0)}))}function harvestMatureCropById(id){const o=taskObjectById(id);if(!o||!o.userData?.crop)return{ok:false,reason:'missing-crop'};if(Number(o.userData.growth||0)<.95)return{ok:false,reason:'not-ready'};const itemId=o.userData.crop;addInventory(economy,itemId,1);o.userData.growth=.15;rebuildCrop(o);changed=true;renderLife();saveSettings();saveWorld();return{ok:true,id:o.userData.id,itemId,qty:1,inventory:Number(economy.inventory[itemId]||0)}}function renderWildTreeState(o){if(!o||o.userData?.type!=='tree')return;unregisterSolid(o);unregisterCameraTarget(o);while(o.children.length)o.remove(o.children[o.children.length-1]);if(o.userData.treeState==='stump'){box(o,.52,.42,.52,0,.21,0,'wood');o.userData.solid=false}else{o.userData.treeState='grown';o.userData.regrowDay=0;o.userData.regrowAt=0;o.userData.solid=true;box(o,.42,2,.42,0,1,0,'wood');sphere(o,1.18,0,2.15,0,0x67ad62,[1,.9,1]);registerCameraTarget(o);registerSolid(o,.22)}}function listHarvestableTrees(){return objects.filter(o=>o.userData?.type==='tree'&&o.userData.treeState!=='stump').map(o=>({id:o.userData.id,itemId:'wood',x:o.position.x,z:o.position.z}))}function chopTreeById(id){const o=taskObjectById(id);if(!o||o.userData?.type!=='tree')return{ok:false,reason:'missing-tree'};if(o.userData.treeState==='stump')return{ok:false,reason:'stump-regrowing',regrowAt:Number(o.userData.regrowAt||0),remainingMs:Math.max(0,Number(o.userData.regrowAt||0)-Date.now())};const regrowMs=randomTreeRegrowMs();o.userData.treeState='stump';o.userData.regrowDay=0;o.userData.regrowAt=Date.now()+regrowMs;renderWildTreeState(o);addInventory(economy,'wood',1);changed=true;renderLife();saveSettings();saveWorld();return{ok:true,id,itemId:'wood',qty:1,inventory:Number(economy.inventory.wood||0),regrowAt:o.userData.regrowAt,regrowMs}}function processTreeRegrowth(now=Date.now()){let count=0;for(const o of objects){if(o.userData?.type!=='tree'||o.userData.treeState!=='stump')continue;let at=Number(o.userData.regrowAt||0);if(!at){o.userData.regrowAt=now+randomTreeRegrowMs();o.userData.regrowDay=0;count++;changed=true;continue}if(at>now)continue;o.userData.treeState='grown';o.userData.regrowDay=0;o.userData.regrowAt=0;renderWildTreeState(o);count++;changed=true}return count}globalThis.__AGCB_WORLD_TASK_API={version:4,status:'AUTHORITATIVE_CORE_WITH_PERSISTENT_REALTIME_TREE_REGROWTH',inventoryOwner:'economy-system/addInventory',worldOwner:'objects/worldIndex',treeRegrowMinMs:TREE_REGROW_MIN_MS,treeRegrowMaxMs:TREE_REGROW_MAX_MS,listMatureCrops,harvestMatureCropById,listHarvestableTrees,chopTreeById,processTreeRegrowth};if(!globalThis.__AGCB_TREE_REGROWTH_TIMER)globalThis.__AGCB_TREE_REGROWTH_TIMER=setInterval(()=>{if(globalThis.__AGCB_WORLD_TASK_API?.processTreeRegrowth?.(Date.now())){renderLife();saveWorld()}},1000);"
  },
  {
    id:'wild-tree-regrowth-day-hook',
    from:"function growDay(){const fromDay=worldDay;worldDay++;const earned=settleShipping(economy),careStore=readCropCare();",
    to:"function growDay(){const fromDay=worldDay;worldDay++;globalThis.__AGCB_WORLD_TASK_API?.processTreeRegrowth?.();const earned=settleShipping(economy),careStore=readCropCare();"
  }
];

let source=original;const applied=[];
for(const patch of patches){
  const count=source.split(patch.from).length-1;
  if(count!==1)throw new Error(`V0.5.04 patch signature mismatch (${patch.id}): expected 1, got ${count}`);
  source=source.replace(patch.from,patch.to);applied.push(patch.id);
}

// Sit and lie should lock player movement, not the third-person camera. The legacy
// core routed lie through a separate sleep camera branch in two pointer handlers.
const legacyFurnitureCameraBranch="if(cameraMode==='farm'||playerState.mode==='lie')";
const legacyFurnitureCameraCount=source.split(legacyFurnitureCameraBranch).length-1;
if(legacyFurnitureCameraCount!==2)throw new Error(`V0.5.04 furniture camera branch mismatch: expected 2, got ${legacyFurnitureCameraCount}`);
source=source.split(legacyFurnitureCameraBranch).join("if(cameraMode==='farm')");
applied.push('sit-lie-use-normal-third-pointer-orbit');

const cameraPatches=[
  {
    id:'third-camera-orbit-state',
    from:'THIRD_CAMERA_DISTANCE=3.8,CAMERA_TUNING_REVISION=1;',
    to:'THIRD_CAMERA_DISTANCE_DEFAULT=3.8,THIRD_CAMERA_DISTANCE_MIN=0.28,THIRD_CAMERA_PITCH_DEFAULT=.24,THIRD_CAMERA_PITCH_MIN=-.72,THIRD_CAMERA_PITCH_MAX=1.16,CAMERA_TUNING_REVISION=6;'
  },
  {
    id:'third-camera-near-plane',
    from:'new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.1,260)',
    to:'new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.05,260)'
  },
  {
    id:'third-camera-orbit-settings',
    from:'farmYaw=Number.isFinite(Number(settings.farmYaw))?Number(settings.farmYaw):FARM_YAW;\nlet playerColor=',
    to:'farmYaw=Number.isFinite(Number(settings.farmYaw))?Number(settings.farmYaw):FARM_YAW;let thirdDistance=Math.max(THIRD_CAMERA_DISTANCE_MIN,Math.min(8,Number(settings.thirdDistance)||THIRD_CAMERA_DISTANCE_DEFAULT));let thirdPitch=Math.max(THIRD_CAMERA_PITCH_MIN,Math.min(THIRD_CAMERA_PITCH_MAX,Number.isFinite(Number(settings.thirdPitch))?Number(settings.thirdPitch):THIRD_CAMERA_PITCH_DEFAULT));\nlet playerColor='
  },
  {
    id:'third-camera-orbit-save',
    from:'cameraMode,farmDistance,farmPitch,farmYaw,season',
    to:'cameraMode,thirdDistance,thirdPitch,farmDistance,farmPitch,farmYaw,season'
  },
  {
    id:'furniture-camera-orbit-unlock',
    from:"if((playerState.mode!=='free'&&playerState.mode!=='lie')||e.clientX<=innerWidth*.29)return;",
    to:"if((playerState.mode!=='free'&&playerState.mode!=='sit'&&playerState.mode!=='lie')||e.clientX<=innerWidth*.29)return;"
  },
  {
    id:'third-camera-pointer-pinch-install',
    from:"renderer.domElement.style.touchAction='none';renderer.domElement.onpointerdown=",
    to:"renderer.domElement.style.touchAction='none';let thirdPinchDistance=0;const thirdPointers=new Map();const thirdPointerDistance=()=>{const a=[...thirdPointers.values()];return a.length<2?0:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};renderer.domElement.addEventListener('pointerdown',e=>{if(cameraMode!=='third'||e.pointerType==='mouse'||e.clientX<=innerWidth*.29)return;thirdPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});renderer.domElement.setPointerCapture?.(e.pointerId);if(thirdPointers.size>=2){thirdPinchDistance=thirdPointerDistance();lookId=null;e.preventDefault()}},{capture:true,passive:false});renderer.domElement.addEventListener('pointermove',e=>{if(cameraMode!=='third'||!thirdPointers.has(e.pointerId))return;if(thirdPointers.size>=2){const before=thirdPointerDistance();const p=thirdPointers.get(e.pointerId);p.x=e.clientX;p.y=e.clientY;const after=thirdPointerDistance();if(before>0&&after>0){const ratio=Math.pow(before/after,1.45);thirdDistance=Math.max(THIRD_CAMERA_DISTANCE_MIN,Math.min(8,thirdDistance*ratio));thirdPinchDistance=after}e.preventDefault()}else{const p=thirdPointers.get(e.pointerId);p.x=e.clientX;p.y=e.clientY}},{capture:true,passive:false});const finishThirdPointer=e=>{if(!thirdPointers.has(e.pointerId))return;thirdPointers.delete(e.pointerId);if(thirdPointers.size===1){const [id,p]=thirdPointers.entries().next().value;lookId=id;lx=p.x;ly=p.y;thirdPinchDistance=0}else if(!thirdPointers.size){lookId=null;thirdPinchDistance=0;saveSettings()}};renderer.domElement.addEventListener('pointerup',finishThirdPointer,{capture:true,passive:true});renderer.domElement.addEventListener('pointercancel',finishThirdPointer,{capture:true,passive:true});renderer.domElement.onpointerdown="
  },
  {
    id:'third-camera-free-orbit-drag',
    from:'if(e.pointerId!==lookId)return;yaw-=(e.clientX-lx)*.0075;pitch=Math.max(-1.08,Math.min(.6,pitch-(e.clientY-ly)*.006));lx=e.clientX;ly=e.clientY',
    to:"if(cameraMode==='third'&&thirdPinchDistance>0)return;if(e.pointerId!==lookId)return;const thirdDx=e.clientX-lx,thirdDy=e.clientY-ly;if(cameraMode==='third'){yaw-=thirdDx*.0075;thirdPitch=Math.max(THIRD_CAMERA_PITCH_MIN,Math.min(THIRD_CAMERA_PITCH_MAX,thirdPitch+thirdDy*.0065))}else{yaw-=thirdDx*.0075;pitch=Math.max(-1.08,Math.min(.6,pitch-thirdDy*.006))}lx=e.clientX;ly=e.clientY"
  },
  {
    id:'third-camera-wheel',
    from:"renderer.domElement.onwheel=e=>{if(cameraMode!=='farm'&&playerState.mode!=='lie')return;e.preventDefault();if(playerState.mode==='lie')sleepDistance=Math.max(2.4,Math.min(9.5,sleepDistance+e.deltaY*.01));else farmDistance=Math.max(FARM_DISTANCE_MIN,Math.min(15.5,farmDistance+e.deltaY*.01));saveSettings()};",
    to:"renderer.domElement.onwheel=e=>{if(cameraMode!=='farm'&&cameraMode!=='third')return;e.preventDefault();if(cameraMode==='third')thirdDistance=Math.max(THIRD_CAMERA_DISTANCE_MIN,Math.min(8,thirdDistance+e.deltaY*.01));else farmDistance=Math.max(FARM_DISTANCE_MIN,Math.min(15.5,farmDistance+e.deltaY*.01));saveSettings()};"
  },
  {
    id:'third-camera-safe-clearance',
    from:'function safeCamera(from,desired){cameraDelta.copy(desired).sub(from);const len=cameraDelta.length();if(len<.1)return desired;cameraDelta.normalize();camRay.set(from,cameraDelta);camRay.far=len;const h=camRay.intersectObjects(cameraTargets,false)[0];return h&&h.distance<len?cameraHitPos.copy(from).addScaledVector(cameraDelta,Math.max(.7,h.distance-.3)):desired}',
    to:"function safeCamera(from,desired){cameraDelta.copy(desired).sub(from);const len=cameraDelta.length();if(len<.1)return desired;cameraDelta.normalize();camRay.set(from,cameraDelta);camRay.far=len;const h=camRay.intersectObjects(cameraTargets,false)[0];const clearance=cameraMode==='third'?.12:.7;return h&&h.distance<len?cameraHitPos.copy(from).addScaledVector(cameraDelta,Math.max(clearance,h.distance-.3)):desired}"
  },
  {
    id:'third-camera-render-orbit',
    from:"if(cameraMode==='third'){if(playerState.mode==='lie'){const sleepHorizontal=Math.cos(sleepPitch)*sleepDistance;desiredCamera.set(eye.x+Math.sin(yaw)*sleepHorizontal,eye.y+Math.sin(sleepPitch)*sleepDistance,eye.z+Math.cos(yaw)*sleepHorizontal);camera.position.lerp(safeCamera(eye,desiredCamera),.3);camera.lookAt(eye)}else{desiredCamera.set(eye.x+Math.sin(yaw)*THIRD_CAMERA_DISTANCE,eye.y+1.85,eye.z+Math.cos(yaw)*THIRD_CAMERA_DISTANCE);camera.position.lerp(safeCamera(eye,desiredCamera),.3);camera.lookAt(eye)}}else if(cameraMode==='farm')",
    to:"if(cameraMode==='third'){desiredCamera.set(eye.x+Math.sin(yaw)*Math.cos(thirdPitch)*thirdDistance,eye.y+Math.sin(thirdPitch)*thirdDistance,eye.z+Math.cos(yaw)*Math.cos(thirdPitch)*thirdDistance);camera.position.lerp(safeCamera(eye,desiredCamera),.3);camera.lookAt(eye)}else if(cameraMode==='farm')"
  }
];
const cameraApplied=[];
for(const patch of cameraPatches){
  const count=source.split(patch.from).length-1;
  if(count!==1)throw new Error(`V0.5.04 camera patch signature mismatch (${patch.id}): expected 1, got ${count}`);
  source=source.replace(patch.from,patch.to);cameraApplied.push(patch.id);
}

source=source.replace(/(from\s*['"]|import\s*['"])(\.\/[^'"]+)(['"])/g,(all,prefix,spec,suffix)=>`${prefix}${new URL(spec,SOURCE_URL).href}${suffix}`);

const blobUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
try{
  await import(blobUrl);
  globalThis.__AGCB_V0504_FIXED={loaded:true,source:'app-v0504.js',patches:applied,signatureCount:applied.length,cameraPatches:cameraApplied,cameraPatchCount:cameraApplied.length,thirdCameraMin:0.28,thirdCameraDefault:3.8,thirdCameraPitchMin:-0.72,thirdCameraPitchMax:1.16,freeOrbit:true,furnitureOrbit:true,furnitureStateBridge:true,lieUsesNormalThirdCamera:true,pointerPinch:true,pinchExponent:1.45,cameraNear:0.05,thirdCameraCollisionClearance:0.12,legacyBlanketTouchBlockerSuppressed:true,legacyDoubleTapBlockerSuppressed:true,playerAxeAuthoritative:true,persistentTreeRegrowth:true,realtimeTreeRegrowth:true,treeRegrowMinMs:60000,treeRegrowMaxMs:180000};
}finally{URL.revokeObjectURL(blobUrl)}