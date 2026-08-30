import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// The base movement loop asks Box3.setFromObject() about the same static blocks/furniture
// every frame. Keep the public Three.js behavior for dynamic objects, but cache world-space
// bounds for static collision objects. This avoids repeatedly traversing their child meshes.
const original=THREE.Box3.prototype.setFromObject;
const cache=new WeakMap();
const stats={hits:0,misses:0,bypassed:0};
function cacheable(object,precise){const u=object?.userData||{};return !precise&&(u.kind==='block'||(u.kind==='object'&&u.solid===true))}
function transformKey(o){const p=o.position,r=o.rotation,s=o.scale;return `${p.x.toFixed(4)}|${p.y.toFixed(4)}|${p.z.toFixed(4)}|${r.x.toFixed(4)}|${r.y.toFixed(4)}|${r.z.toFixed(4)}|${s.x.toFixed(4)}|${s.y.toFixed(4)}|${s.z.toFixed(4)}|${o.children.length}`}

THREE.Box3.prototype.setFromObject=function(object,precise=false){
  if(!cacheable(object,precise)){stats.bypassed++;return original.call(this,object,precise)}
  const key=transformKey(object),hit=cache.get(object);
  if(hit?.key===key){stats.hits++;return this.copy(hit.box)}
  stats.misses++;original.call(this,object,precise);cache.set(object,{key,box:this.clone()});return this;
};

globalThis.__AGCB_COLLISION_CACHE={stats,clear:()=>{stats.hits=stats.misses=stats.bypassed=0}};
