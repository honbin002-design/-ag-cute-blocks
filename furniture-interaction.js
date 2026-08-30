import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const DEFINITIONS={
  chair:{action:'sit',label:'坐下',icon:'🪑',anchor:new THREE.Vector3(0,-.08,.02),exit:new THREE.Vector3(0,0,1.0),yaw:0},
  sofa:{action:'sit',label:'坐下',icon:'🛋️',anchor:new THREE.Vector3(0,-.30,-.04),exit:new THREE.Vector3(0,0,1.25),yaw:0},
  bed:{action:'lie',label:'躺下',icon:'🛏️',anchor:new THREE.Vector3(0,.69,0),exit:new THREE.Vector3(0,0,1.45),yaw:0},
  starBed:{action:'lie',label:'躺下',icon:'⭐',anchor:new THREE.Vector3(0,.68,0),exit:new THREE.Vector3(0,0,1.45),yaw:0},
  swingGarden:{action:'sit',label:'坐鞦韆',icon:'🌿',anchor:new THREE.Vector3(0,.20,.02),exit:new THREE.Vector3(0,0,1.15),yaw:0}
};

export function getFurnitureInteraction(type){return DEFINITIONS[type]||null}
export function furnitureAnchorWorld(object){const d=getFurnitureInteraction(object?.userData?.type);if(!d)return null;return object.localToWorld(d.anchor.clone())}
export function furnitureExitWorld(object){const d=getFurnitureInteraction(object?.userData?.type);if(!d)return null;return object.localToWorld(d.exit.clone())}
export function furnitureYaw(object){const d=getFurnitureInteraction(object?.userData?.type);return object.rotation.y+(d?.yaw||0)}
export function isFurnitureInteractable(type){return !!DEFINITIONS[type]}
