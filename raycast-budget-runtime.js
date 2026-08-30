import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// The follow cameras only raycast a short segment behind/above the player.
// The base app still assembles every solid mesh for that query; avoid testing geometry that is
// clearly far outside the short camera segment. Aim/build rays keep their original behavior.
const original=THREE.Raycaster.prototype.intersectObjects;
const stats={calls:0,cameraCalls:0,candidates:0,tested:0};

THREE.Raycaster.prototype.intersectObjects=function(objects,recursive=false,intersects=[]){
  stats.calls++;
  const far=Number(this.far);
  // Before the first renderer pass, matrixWorld can still be stale. Stay fully conservative until
  // render governance publishes a live tier, which happens only after a real render has completed.
  if(!globalThis.__AGCB_PERF_TIER||!Number.isFinite(far)||far>16||!Array.isArray(objects)||objects.length<12){
    return original.call(this,objects,recursive,intersects);
  }
  stats.cameraCalls++;stats.candidates+=objects.length;
  const origin=this.ray.origin,max=far+4.5,maxSq=max*max,nearby=[];
  for(const object of objects){
    if(!object?.matrixWorld){nearby.push(object);continue}
    const e=object.matrixWorld.elements,dx=e[12]-origin.x,dy=e[13]-origin.y,dz=e[14]-origin.z;
    if(dx*dx+dy*dy+dz*dz<=maxSq)nearby.push(object);
  }
  stats.tested+=nearby.length;
  return original.call(this,nearby,recursive,intersects);
};

globalThis.__AGCB_RAYCAST_BUDGET={stats,description:'short camera rays cull distant solid meshes after first render; aim rays unchanged'};
