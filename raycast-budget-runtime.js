import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// The follow cameras only raycast a short segment behind/above the player.
// The core now keeps a persistent static camera-target registry, while this layer further culls
// distant meshes without allocating a new candidate array every rendered frame.
const original=THREE.Raycaster.prototype.intersectObjects;
const stats={calls:0,cameraCalls:0,candidates:0,tested:0,bufferReuses:0};
const nearby=[];

THREE.Raycaster.prototype.intersectObjects=function(objects,recursive=false,intersects=[]){
  stats.calls++;
  const far=Number(this.far);
  // Before the first renderer pass, matrixWorld can still be stale. Stay fully conservative until
  // render governance publishes a live tier, which happens only after a real render has completed.
  if(!globalThis.__AGCB_PERF_TIER||!Number.isFinite(far)||far>16||!Array.isArray(objects)||objects.length<12){
    return original.call(this,objects,recursive,intersects);
  }
  stats.cameraCalls++;stats.candidates+=objects.length;stats.bufferReuses++;nearby.length=0;
  const origin=this.ray.origin,max=far+4.5,maxSq=max*max;
  for(const object of objects){
    if(!object?.matrixWorld){nearby.push(object);continue}
    const e=object.matrixWorld.elements,dx=e[12]-origin.x,dy=e[13]-origin.y,dz=e[14]-origin.z;
    if(dx*dx+dy*dy+dz*dz<=maxSq)nearby.push(object);
  }
  stats.tested+=nearby.length;
  return original.call(this,nearby,recursive,intersects);
};

globalThis.__AGCB_RAYCAST_BUDGET={stats,nearby,description:'persistent camera target registry plus reusable short-ray cull buffer; aim rays unchanged'};
