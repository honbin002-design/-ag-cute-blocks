import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// V0.4.3 uses MathUtils.lerp only for the three visible heading blends below:
// player=.24, pet=.14, livestock=.10. A plain scalar lerp can rotate the long way around
// when the target crosses -PI/+PI, which looks like a character briefly turning backwards.
// Keep all other scalar lerps untouched and make only these heading blends wrap-aware.
const original=THREE.MathUtils.lerp;
const HEADING_FACTORS=new Set([.24,.14,.1]);
let corrections=0;

THREE.MathUtils.lerp=function(a,b,t){
  if(HEADING_FACTORS.has(t)&&Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(b)<=Math.PI+1e-7){
    const raw=b-a,delta=Math.atan2(Math.sin(raw),Math.cos(raw));
    if(Math.abs(raw-delta)>.001)corrections++;
    return a+delta*t;
  }
  return original(a,b,t);
};

globalThis.__AGCB_HEADING_RUNTIME={
  get corrections(){return corrections},
  description:'shortest-arc heading interpolation for player, pets and livestock'
};
