import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// The base movement loop asks Box3.setFromObject() about the same static blocks/furniture
// every frame. Keep public Three.js behavior for dynamic objects, but cache world-space bounds
// for static collision objects without constructing a transform-key string on every check.
const original=THREE.Box3.prototype.setFromObject;
const cache=new WeakMap();
const stats={hits:0,misses:0,bypassed:0,geometryInvalidations:0};
function cacheable(object,precise){const u=object?.userData||{};return !precise&&(u.kind==='block'||(u.kind==='object'&&u.solid===true))}
function geometryStamp(o){
  // Blocks are direct meshes; furniture/groups may own mesh children. A tiny numeric stamp lets
  // geometry replacement (for example cube -> stairs) invalidate stale cached collision bounds.
  let stamp=0,count=0;
  if(o?.isMesh&&o.geometry){stamp=(o.geometry.id||0)*31+(o.geometry.version||0);count=1}
  else if(o?.children?.length)for(const c of o.children){if(c?.isMesh&&c.geometry){stamp=(stamp*33+(c.geometry.id||0)*31+(c.geometry.version||0))|0;count++}}
  return [stamp,count];
}
function sameTransform(hit,o){
  const p=o.position,r=o.rotation,s=o.scale;if(!hit)return false;
  const [geometryStampNow,geometryCountNow]=geometryStamp(o);
  if(hit.geometryStamp!==geometryStampNow||hit.geometryCount!==geometryCountNow){stats.geometryInvalidations++;return false}
  return hit.x===p.x&&hit.y===p.y&&hit.z===p.z&&hit.rx===r.x&&hit.ry===r.y&&hit.rz===r.z&&hit.sx===s.x&&hit.sy===s.y&&hit.sz===s.z&&hit.children===o.children.length;
}
function remember(o,box){const p=o.position,r=o.rotation,s=o.scale,[geometryStampValue,geometryCount]=geometryStamp(o);return{x:p.x,y:p.y,z:p.z,rx:r.x,ry:r.y,rz:r.z,sx:s.x,sy:s.y,sz:s.z,children:o.children.length,geometryStamp:geometryStampValue,geometryCount,box:box.clone()}}

THREE.Box3.prototype.setFromObject=function(object,precise=false){
  if(!cacheable(object,precise)){stats.bypassed++;return original.call(this,object,precise)}
  const hit=cache.get(object);
  if(sameTransform(hit,object)){stats.hits++;return this.copy(hit.box)}
  stats.misses++;original.call(this,object,precise);cache.set(object,remember(object,this));return this;
};

globalThis.__AGCB_COLLISION_CACHE={stats,invalidate:object=>cache.delete(object),clear:()=>{stats.hits=stats.misses=stats.bypassed=stats.geometryInvalidations=0}};
