import * as THREE from 'three';

// Shortest-arc heading correction. Uses the same Three.js instance as the game/import map.
const original=THREE.MathUtils.lerp;
const HEADING_FACTORS=new Set([.24,.14,.1]);
let corrections=0;
if(!THREE.MathUtils.__agcbHeadingSafe){
  THREE.MathUtils.lerp=function(a,b,t){
    if(HEADING_FACTORS.has(t)&&Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(b)<=Math.PI+1e-7){
      const raw=b-a,delta=Math.atan2(Math.sin(raw),Math.cos(raw));
      if(Math.abs(raw-delta)>.001)corrections++;
      return a+delta*t;
    }
    return original(a,b,t);
  };
  THREE.MathUtils.__agcbHeadingSafe=true;
}
globalThis.__AGCB_HEADING_RUNTIME={get corrections(){return corrections},sharedThree:true,description:'shortest-arc heading interpolation for player, pets and livestock'};
