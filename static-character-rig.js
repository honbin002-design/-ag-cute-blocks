import * as THREE from './vendor/three-0.180.0/build/three.module.js';

// The two user-supplied Meshy assets contain one static mesh, no skin or clips.
// Bind their existing vertices in mesh-local space; retain all original UVs/materials.
// These profiles describe the inspected chibi proportions, not arbitrary humanoids.
const smooth = (a,b,x) => {const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
export function rigStaticCharacter(root,id){
  const meshes=[];root.traverse(o=>{if(o.isMesh&&!o.isSkinnedMesh)meshes.push(o)});
  for(const mesh of meshes){
    const geometry=mesh.geometry.clone();geometry.computeBoundingBox();
    const box=geometry.boundingBox,h=box.max.y-box.min.y,cx=(box.min.x+box.max.x)/2,cz=(box.min.z+box.max.z)/2;
    const bones=[],positions=[];
    function bone(name,parent,x,y,z=0){
      const b=new THREE.Bone();b.name=name;
      const p=new THREE.Vector3(cx+x*h,box.min.y+y*h,cz+z*h);
      b.position.copy(p);if(parent>=0){b.position.sub(positions[parent]);bones[parent].add(b)}
      positions.push(p);bones.push(b);return bones.length-1;
    }
    const hips=bone('Hips',-1,0,.40),spine=bone('Spine',hips,0,.51),head=bone('Head',spine,0,.69);
    const ll=bone('LeftUpLeg',hips,.075,.39),lk=bone('LeftLowerLeg',ll,.075,.21),lf=bone('LeftFoot',lk,.075,.055);
    const rl=bone('RightUpLeg',hips,-.075,.39),rk=bone('RightLowerLeg',rl,-.075,.21),rf=bone('RightFoot',rk,-.075,.055);
    const la=bone('LeftArm',spine,.12,.61),le=bone('LeftForeArm',la,.16,.49);
    const ra=bone('RightArm',spine,-.12,.61),re=bone('RightForeArm',ra,-.16,.49);
    const pos=geometry.attributes.position,indices=new Uint16Array(pos.count*4),weights=new Float32Array(pos.count*4);
    for(let i=0;i<pos.count;i++){
      const x=(pos.getX(i)-cx)/h,y=(pos.getY(i)-box.min.y)/h,z=(pos.getZ(i)-cz)/h;
      const w=new Map(),add=(j,v)=>{if(v>0)w.set(j,(w.get(j)||0)+v)};
      const leg=1-smooth(.34,.43,y),left=smooth(-.025,.025,x);
      const foot=1-smooth(.045,.10,y),thigh=smooth(.18,.26,y),shin=(1-foot)*(1-thigh);
      for(const [side,upper,knee,ankle] of [[left,ll,lk,lf],[1-left,rl,rk,rf]]){
        add(upper,leg*side*(1-foot)*thigh);add(knee,leg*side*shin);add(ankle,leg*side*foot);
      }
      // Preserve the long hair behind the arms and the cloud held by special5.
      const arm=id==='special2'?smooth(.125,.185,Math.abs(x))*smooth(.40,.46,y)*(1-smooth(.60,.66,y))*smooth(-.065,-.015,z):0;
      const upper=1-leg,fore=1-smooth(.465,.515,y),headWeight=smooth(.60,.69,y);
      add(x>=0?la:ra,upper*arm*(1-fore));add(x>=0?le:re,upper*arm*fore);
      add(head,upper*(1-arm)*headWeight);add(spine,upper*(1-arm)*(1-headWeight)*smooth(.40,.49,y));
      add(hips,upper*(1-arm)*(1-headWeight)*(1-smooth(.40,.49,y)));
      const rows=[...w].sort((a,b)=>b[1]-a[1]).slice(0,4),sum=rows.reduce((n,r)=>n+r[1],0)||1;
      rows.forEach(([j,v],k)=>{indices[i*4+k]=j;weights[i*4+k]=v/sum});
    }
    geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));
    geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
    const skin=new THREE.SkinnedMesh(geometry,mesh.material);skin.name=mesh.name;
    skin.position.copy(mesh.position);skin.quaternion.copy(mesh.quaternion);skin.scale.copy(mesh.scale);
    skin.castShadow=mesh.castShadow;skin.receiveShadow=mesh.receiveShadow;skin.frustumCulled=false;
    mesh.parent.add(skin);skin.add(bones[0]);root.updateMatrixWorld(true);
    skin.bind(new THREE.Skeleton(bones));mesh.removeFromParent();
    skin.userData={...mesh.userData,agStaticRig:{version:'1.0.4',profile:id,bones:bones.length,vertices:pos.count}};
  }
  return meshes.length;
}
