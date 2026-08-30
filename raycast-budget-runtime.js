import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// The follow cameras only raycast a short segment behind/above the player.
// The base app still assembles every solid mesh for that query; avoid testing geometry that is
// clearly far outside the short camera segment. Aim/build rays keep their original behavior.
const original=THREE.Raycaster.prototype.intersectObjects;
const stats={calls:0,cameraCalls:0,candidates:0,tested:0};

THREE.Raycaster.prototype.intersectObjects=function(objects,recursive=false,intersects=[]){
  stats.calls++;
  const far=Number(this.far);
  if(!Number.isFinite(far)||far>16||!Array.isArray(objects)||objects.length<12){
    return original.call(this,objects,recursive,intersects);
  }
  stats.cameraCalls++;stats.candidates+=objects.length;
  const origin=this.ray.origin,max=far+4.5,maxSq=max*max,nearby=[];
  for(const object of objects){
    if(!object?.matrixWorld){nearby.push(object);continue}
    const e=object.matrixWorld.elements,dx=e[12]-origin.x,dy=e[13]-origin.y,dz=e[14]-origin.z;
    // A not-yet-rendered object may still have an identity matrix; keep it rather than risk
    // missing a first-frame wall. Once matrices are current, distant meshes are culled cheaply.
    const matrixLooksFresh=object.matrixWorldAutoUpdate===false||object.parent===null||e[12]!==0||e[13]!==0||e[14]!==0||object.position.lengthSq()===0;
    if(!matrixLooksFresh||dx*dx+dy*dy+dz*dz<=maxSq)nearby.push(object);
  }
  stats.tested+=nearby.length;
  return original.call(this,nearby,recursive,intersects);
};

globalThis.__AGCB_RAYCAST_BUDGET={stats,description:'short camera rays cull distant solid meshes; aim rays unchanged'};
