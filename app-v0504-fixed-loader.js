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
    id:'legacy-doubletap-blocker-suppress',
    from:"let lastTouchEnd=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouchEnd<=350)e.preventDefault();lastTouchEnd=now},{passive:false});",
    to:"let lastTouchEnd=0;/* AG guarded recovery: double-tap policy is owned by mobile-viewport-lock-runtime.js */"
  },
  {
    id:'legacy-blanket-multitouch-suppress',
    from:"document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});",
    to:"/* AG guarded recovery: legacy blanket multitouch blocker suppressed; control-aware policy is owned by mobile-viewport-lock-runtime.js */"
  }
];

let source=original;const applied=[];
for(const patch of patches){
  const count=source.split(patch.from).length-1;
  if(count!==1)throw new Error(`V0.5.04 patch signature mismatch (${patch.id}): expected 1, got ${count}`);
  source=source.replace(patch.from,patch.to);applied.push(patch.id);
}

// Third-person camera zoom + free orbit are layered as guarded feature patches so
// the original recovery signatures and their CI contract stay unchanged.
const cameraPatches=[
  {
    id:'third-camera-orbit-state',
    from:'THIRD_CAMERA_DISTANCE=3.8,CAMERA_TUNING_REVISION=1;',
    to:'THIRD_CAMERA_DISTANCE_DEFAULT=3.8,THIRD_CAMERA_DISTANCE_MIN=0.55,THIRD_CAMERA_PITCH_DEFAULT=.24,THIRD_CAMERA_PITCH_MIN=-.72,THIRD_CAMERA_PITCH_MAX=1.16,CAMERA_TUNING_REVISION=3;'
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
    id:'third-camera-pinch-install',
    from:"renderer.domElement.style.touchAction='none';renderer.domElement.onpointerdown=",
    to:"renderer.domElement.style.touchAction='none';let thirdPinchDistance=0;const thirdTouchDistance=e=>e.touches.length<2?0:Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);renderer.domElement.addEventListener('touchstart',e=>{if(cameraMode!=='third'||e.touches.length!==2)return;thirdPinchDistance=thirdTouchDistance(e);e.preventDefault()},{passive:false});renderer.domElement.addEventListener('touchmove',e=>{if(cameraMode!=='third'||e.touches.length!==2||thirdPinchDistance<=0)return;const next=thirdTouchDistance(e);if(next>0){thirdDistance=Math.max(THIRD_CAMERA_DISTANCE_MIN,Math.min(8,thirdDistance*thirdPinchDistance/next));thirdPinchDistance=next}e.preventDefault()},{passive:false});renderer.domElement.addEventListener('touchend',e=>{if(e.touches.length<2&&thirdPinchDistance){thirdPinchDistance=0;saveSettings()}},{passive:false});renderer.domElement.addEventListener('touchcancel',()=>{thirdPinchDistance=0},{passive:true});renderer.domElement.onpointerdown="
  },
  {
    id:'third-camera-free-orbit-drag',
    from:'if(e.pointerId!==lookId)return;yaw-=(e.clientX-lx)*.0075;pitch=Math.max(-1.08,Math.min(.6,pitch-(e.clientY-ly)*.006));lx=e.clientX;ly=e.clientY',
    to:"if(cameraMode==='third'&&thirdPinchDistance>0)return;if(e.pointerId!==lookId)return;const thirdDx=e.clientX-lx,thirdDy=e.clientY-ly;if(cameraMode==='third'){yaw-=thirdDx*.0075;thirdPitch=Math.max(THIRD_CAMERA_PITCH_MIN,Math.min(THIRD_CAMERA_PITCH_MAX,thirdPitch+thirdDy*.0065))}else{yaw-=thirdDx*.0075;pitch=Math.max(-1.08,Math.min(.6,pitch-thirdDy*.006))}lx=e.clientX;ly=e.clientY"
  },
  {
    id:'third-camera-wheel',
    from:"renderer.domElement.onwheel=e=>{if(cameraMode!=='farm'&&playerState.mode!=='lie')return;e.preventDefault();if(playerState.mode==='lie')sleepDistance=Math.max(2.4,Math.min(9.5,sleepDistance+e.deltaY*.01));else farmDistance=Math.max(FARM_DISTANCE_MIN,Math.min(15.5,farmDistance+e.deltaY*.01));saveSettings()};",
    to:"renderer.domElement.onwheel=e=>{if(cameraMode!=='farm'&&cameraMode!=='third'&&playerState.mode!=='lie')return;e.preventDefault();if(playerState.mode==='lie')sleepDistance=Math.max(2.4,Math.min(9.5,sleepDistance+e.deltaY*.01));else if(cameraMode==='third')thirdDistance=Math.max(THIRD_CAMERA_DISTANCE_MIN,Math.min(8,thirdDistance+e.deltaY*.01));else farmDistance=Math.max(FARM_DISTANCE_MIN,Math.min(15.5,farmDistance+e.deltaY*.01));saveSettings()};"
  },
  {
    id:'third-camera-render-orbit',
    from:'eye.x+Math.sin(yaw)*THIRD_CAMERA_DISTANCE,eye.y+1.85,eye.z+Math.cos(yaw)*THIRD_CAMERA_DISTANCE',
    to:'eye.x+Math.sin(yaw)*Math.cos(thirdPitch)*thirdDistance,eye.y+Math.sin(thirdPitch)*thirdDistance,eye.z+Math.cos(yaw)*Math.cos(thirdPitch)*thirdDistance'
  }
];
const cameraApplied=[];
for(const patch of cameraPatches){
  const count=source.split(patch.from).length-1;
  if(count!==1)throw new Error(`V0.5.04 camera patch signature mismatch (${patch.id}): expected 1, got ${count}`);
  source=source.replace(patch.from,patch.to);cameraApplied.push(patch.id);
}

// Blob modules cannot resolve relative imports against the historical file URL.
// Rewrite static relative JS imports only; all feature code stays byte-equivalent
// apart from the guarded patches above.
source=source.replace(/(from\s*['"]|import\s*['"])(\.\/[^'"]+)(['"])/g,(all,prefix,spec,suffix)=>`${prefix}${new URL(spec,SOURCE_URL).href}${suffix}`);

const blobUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
try{
  await import(blobUrl);
  globalThis.__AGCB_V0504_FIXED={loaded:true,source:'app-v0504.js',patches:applied,signatureCount:applied.length,cameraPatches:cameraApplied,cameraPatchCount:cameraApplied.length,thirdCameraMin:0.55,thirdCameraDefault:3.8,thirdCameraPitchMin:-0.72,thirdCameraPitchMax:1.16,freeOrbit:true,legacyBlanketTouchBlockerSuppressed:true,legacyDoubleTapBlockerSuppressed:true};
}finally{URL.revokeObjectURL(blobUrl)}
