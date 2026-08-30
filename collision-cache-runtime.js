import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// The base movement loop asks Box3.setFromObject() about the same static blocks/furniture
// every frame. Keep public Three.js behavior for dynamic objects, but cache world-space bounds
// for static collision objects without constructing a transform-key string on every check.
const original=THREE.Box3.prototype.setFromObject;
const cache=new WeakMap();
const stats={hits:0,misses:0,bypassed:0};
function cacheable(object,precise){const u=object?.userData||{};return !precise&&(u.kind==='block'||(u.kind==='object'&&u.solid===true))}
function sameTransform(hit,o){const p=o.position,r=o.rotation,s=o.scale;return hit&&hit.x===p.x&&hit.y===p.y&&hit.z===p.z&&hit.rx===r.x&&hit.ry===r.y&&hit.rz===r.z&&hit.sx===s.x&&hit.sy===s.y&&hit.sz===s.z&&hit.children===o.children.length}
function remember(o,box){const p=o.position,r=o.rotation,s=o.scale;return{x:p.x,y:p.y,z:p.z,rx:r.x,ry:r.y,rz:r.z,sx:s.x,sy:s.y,sz:s.z,children:o.children.length,box:box.clone()}}

THREE.Box3.prototype.setFromObject=function(object,precise=false){
  if(!cacheable(object,precise)){stats.bypassed++;return original.call(this,object,precise)}
  const hit=cache.get(object);
  if(sameTransform(hit,object)){stats.hits++;return this.copy(hit.box)}
  stats.misses++;original.call(this,object,precise);cache.set(object,remember(object,this));return this;
};

globalThis.__AGCB_COLLISION_CACHE={stats,clear:()=>{stats.hits=stats.misses=stats.bypassed=0}};
