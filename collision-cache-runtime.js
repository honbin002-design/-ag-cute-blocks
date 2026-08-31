import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// The movement loop checks the same static blocks/furniture many times per second.
// Cache their world bounds and keep the hot-path validation O(1): numeric transform values,
// child count and an explicit geometry revision. Dynamic creatures/crops bypass this cache.
const original=THREE.Box3.prototype.setFromObject;
const cache=new WeakMap();
const stats={hits:0,misses:0,bypassed:0,geometryInvalidations:0,explicitInvalidations:0};
function cacheable(object,precise){const u=object?.userData||{};return !precise&&(u.kind==='block'||(u.kind==='object'&&u.solid===true))}
function geometryToken(o){
  // Blocks are direct meshes, so their Three.js geometry id/version is a cheap automatic guard.
  // Solid groups use an explicit revision; their child geometry is immutable during normal play.
  if(o?.isMesh&&o.geometry)return `${o.geometry.id||0}:${o.geometry.version||0}:${o.userData?.__agcbGeometryRevision||0}`;
  return `${o?.children?.length||0}:${o?.userData?.__agcbGeometryRevision||0}`;
}
function sameTransform(hit,o){
  if(!hit)return false;const p=o.position,r=o.rotation,s=o.scale,token=geometryToken(o);
  if(hit.geometryToken!==token){stats.geometryInvalidations++;return false}
  return hit.x===p.x&&hit.y===p.y&&hit.z===p.z&&hit.rx===r.x&&hit.ry===r.y&&hit.rz===r.z&&hit.sx===s.x&&hit.sy===s.y&&hit.sz===s.z;
}
function remember(o,box){const p=o.position,r=o.rotation,s=o.scale;return{x:p.x,y:p.y,z:p.z,rx:r.x,ry:r.y,rz:r.z,sx:s.x,sy:s.y,sz:s.z,geometryToken:geometryToken(o),box:box.clone()}}
function invalidate(object){if(object){object.userData.__agcbGeometryRevision=(object.userData.__agcbGeometryRevision||0)+1;cache.delete(object);stats.explicitInvalidations++}}

THREE.Box3.prototype.setFromObject=function(object,precise=false){
  if(!cacheable(object,precise)){stats.bypassed++;return original.call(this,object,precise)}
  const hit=cache.get(object);
  if(sameTransform(hit,object)){stats.hits++;return this.copy(hit.box)}
  stats.misses++;original.call(this,object,precise);cache.set(object,remember(object,this));return this;
};

globalThis.__AGCB_COLLISION_CACHE={
  stats,
  invalidate:object=>cache.delete(object),
  invalidateGeometry:invalidate,
  clear:()=>{stats.hits=stats.misses=stats.bypassed=stats.geometryInvalidations=stats.explicitInvalidations=0}
};
