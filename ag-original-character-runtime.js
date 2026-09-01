import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const AG_ORIGINAL_CHARACTER_SCHEMA=1;
const AG_ORIGINAL_CHARACTER_TOPOLOGY='deduped-marching-tetra-v5';
const PAPER_DOLL_SLOTS=['bodyBase','underlayer','top','bottom','dress','shoes','hair','hat','glasses','accessory'];
const SKIN={light:0xf2c5a5,warm:0xc88963,deep:0x8c5a3c,rosy:0xf0b09e};
const HAIR={chestnut:0x68483b,black:0x2c2528,honey:0xb87845,plum:0x543c67};
const TOP={pink:0xf1a4b5,sky:0x74afd7,mint:0x8acbb9,lavender:0xbfa4e7};
const BOTTOM={denim:0x6685a3,navy:0x4e5c88,cream:0xe8c78b,rose:0xc87891};
const UNDERWEAR=0xf3a8b7;

function smoothUnion(a,b,k=.075){const h=Math.max(k-Math.abs(a-b),0);return Math.min(a,b)-h*h/(4*k)}
function ellipsoid(p,c,r){const dx=(p.x-c[0])/r[0],dy=(p.y-c[1])/r[1],dz=(p.z-c[2])/r[2];return (Math.sqrt(dx*dx+dy*dy+dz*dz)-1)*Math.min(r[0],r[1],r[2])}
function makeOrganicFeatureGeometry(rx,ry,rz,sides=16,rings=9){
  const verts=[],indices=[];
  for(let j=0;j<=rings;j++){const phi=-Math.PI/2+Math.PI*j/rings,cp=Math.cos(phi),sp=Math.sin(phi);for(let i=0;i<sides;i++){const a=2*Math.PI*i/sides;verts.push(Math.cos(a)*cp*rx,sp*ry,Math.sin(a)*cp*rz)}}
  for(let j=0;j<rings;j++)for(let i=0;i<sides;i++){const n=(i+1)%sides,a=j*sides+i,b=j*sides+n,c=(j+1)*sides+n,d=(j+1)*sides+i;indices.push(a,b,d,b,c,d)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
function makeProfileVolumeGeometry(profile,sides=10){
  const verts=[],indices=[];
  for(const ring of profile)for(let i=0;i<sides;i++){const a=2*Math.PI*i/sides;verts.push((ring.cx||0)+Math.cos(a)*ring.rx,ring.y,(ring.cz||0)+Math.sin(a)*ring.rz)}
  for(let j=0;j<profile.length-1;j++)for(let i=0;i<sides;i++){const n=(i+1)%sides,a=j*sides+i,b=j*sides+n,c=(j+1)*sides+n,d=(j+1)*sides+i;indices.push(a,d,b,b,d,c)}
  const first=verts.length/3;verts.push(profile[0].cx||0,profile[0].y,profile[0].cz||0);const end=profile[profile.length-1],last=verts.length/3;verts.push(end.cx||0,end.y,end.cz||0);
  for(let i=0;i<sides;i++){const n=(i+1)%sides;indices.push(first,n,i,last,(profile.length-1)*sides+i,(profile.length-1)*sides+n)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
function organicFeature(parent,name,material,position,radii,rotation=[0,0,0]){const mesh=new THREE.Mesh(makeOrganicFeatureGeometry(...radii),material);mesh.name=name;mesh.position.set(...position);mesh.rotation.set(...rotation);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function profileVolume(parent,name,material,position,profile,rotation=[0,0,0]){const mesh=new THREE.Mesh(makeProfileVolumeGeometry(profile),material);mesh.name=name;mesh.position.set(...position);mesh.rotation.set(...rotation);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function flatRingGeometry(outer,inner,depth,sides=24){const verts=[],indices=[];for(const z of[-depth/2,depth/2])for(const r of[outer,inner])for(let i=0;i<sides;i++){const a=2*Math.PI*i/sides;verts.push(Math.cos(a)*r,Math.sin(a)*r,z)}const o0=0,i0=sides,o1=sides*2,i1=sides*3;for(let i=0;i<sides;i++){const n=(i+1)%sides;indices.push(o0+i,o0+n,i0+i,o0+n,i0+n,i0+i,o1+i,i1+i,o1+n,o1+n,i1+i,i1+n,o0+i,o1+i,o0+n,o0+n,o1+i,o1+n,i0+i,i0+n,i1+i,i0+n,i1+n,i1+i)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(indices);g.computeVertexNormals();return g}
function bodyField(p,c=bodyField.variant||{gender:'girl',age:'child'}){
  const adult=c.age==='adult',male=c.gender==='boy';
  const y0=.035,yScale=adult?1.04:.86,y=v=>y0+(v-y0)*yScale,ry=v=>v*(adult?1.01:.91);
  // Four authored silhouettes.  The child is compact with a shorter pelvis;
  // adults have longer legs, a smaller head, and a deliberate shoulder/hip read.
  const shoulder=male?(adult?1.28:1.02):(adult?.98:.86),chest=male?(adult?1.05:.92):(adult?.91:.84);
  const waist=male?(adult?.86:.78):(adult?.70:.70),hip=male?(adult?.88:.82):(adult?1.18:1.02);
  const armScale=adult?1.08:.83,legScale=adult?1.22:.86,legX=adult?(male?.205:.19):.145;
  const headR=adult?(male?[.215,.245,.215]:[.215,.250,.215]):(male?[.260,.285,.235]:[.265,.295,.240]);
  const parts=[
    [[0,y(.73),0],[.28*hip,ry(.18),.205]],[[0,y(.98),0],[.235*waist,ry(.16),.185]],
    [[0,y(1.22),0],[.30*chest,ry(.22),.215]],[[0,y(1.43),0],[.29*shoulder,ry(.125),.195]],
    [[0,y(1.63),0],[male?(adult?.125:.105):.10,ry(.095),.12]],[[0,y(1.87),0],headR],
    [[-.32*shoulder,y(1.38),0],[.105*armScale,ry(.17),.115]],[[-.41*shoulder,y(1.14),0],[.083*armScale,ry(.165),.105]],[[-.44*shoulder,y(.92),-.018],[.075*armScale,ry(.10),.105]],
    [[.32*shoulder,y(1.38),0],[.105*armScale,ry(.17),.115]],[[.41*shoulder,y(1.14),0],[.083*armScale,ry(.165),.105]],[[.44*shoulder,y(.92),-.018],[.075*armScale,ry(.10),.105]],
    [[-legX,y(.63),0],[.105*legScale,ry(.18),.125]],[[legX,y(.63),0],[.105*legScale,ry(.18),.125]],[[-legX,y(.34),0],[.085*legScale,ry(.19),.11]],[[legX,y(.34),0],[.085*legScale,ry(.19),.11]],
    [[-legX,y(.10),-.095],[.115*legScale,ry(.085),.17]],[[legX,y(.10),-.095],[.115*legScale,ry(.085),.17]]
  ];
  if(!male){
    // Bust/upper chest and the wider hip plane give the female silhouette a
    // visible waist rhythm without making the body anatomically exaggerated.
    parts.push([[-.095,y(adult?1.27:1.22),-.105],[adult?.125:.080,ry(adult?.10:.085),adult?.13:.095]],[[.095,y(adult?1.27:1.22),-.105],[adult?.125:.080,ry(adult?.10:.085),adult?.13:.095]]);
  }else{
    // A broad clavicle plane and straight pelvis keep the male read crisp.
    parts.push([[0,y(adult?1.29:1.25),-.075],[adult?.235:.16,ry(adult?.14:.11),adult?.125:.11]]);
  }
  let value=Infinity;for(const part of parts)value=smoothUnion(value,ellipsoid(p,part[0],part[1]));return value;
}
const TETS=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
const EDGES=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
function makeConnectedBodyGeometry(c){
  bodyField.variant=c;
  const nx=20,ny=31,nz=16,minX=-.78,maxX=.78,minY=-.08,maxY=2.30,minZ=-.62,maxZ=.58;
  const dx=(maxX-minX)/nx,dy=(maxY-minY)/ny,dz=(maxZ-minZ)/nz,verts=[],colors=[],indices=[],vertexMap=new Map(),triangleSet=new Set();
  const sample=(ix,iy,iz)=>{const p={x:minX+ix*dx,y:minY+iy*dy,z:minZ+iz*dz};return {p,v:bodyField(p)}};
  const emitSurfaceTriangle=(a,b,c)=>{
    const triangleKey=[a,b,c].sort((x,y)=>x-y).join(',');
    if(triangleSet.has(triangleKey))return;
    triangleSet.add(triangleKey);
    const ax=verts[a*3],ay=verts[a*3+1],az=verts[a*3+2],bx=verts[b*3],by=verts[b*3+1],bz=verts[b*3+2],cx=verts[c*3],cy=verts[c*3+1],cz=verts[c*3+2];
    const abx=bx-ax,aby=by-ay,abz=bz-az,acx=cx-ax,acy=cy-ay,acz=cz-az,nx=aby*acz-abz*acy,ny=abz*acx-abx*acz,nz=abx*acy-aby*acx,px=(ax+bx+cx)/3,py=(ay+by+cy)/3,pz=(az+bz+cz)/3,e=.006;
    const gx=bodyField({x:px+e,y:py,z:pz})-bodyField({x:px-e,y:py,z:pz}),gy=bodyField({x:px,y:py+e,z:pz})-bodyField({x:px,y:py-e,z:pz}),gz=bodyField({x:px,y:py,z:pz+e})-bodyField({x:px,y:py,z:pz-e});
    if(nx*gx+ny*gy+nz*gz<0)indices.push(a,c,b);else indices.push(a,b,c);
  };
  const colorAt=p=>{
    let color=SKIN[c.skin]||SKIN.light;
    if(c.outfit==='underwear'){
      if(p.y>.84&&p.y<1.42&&Math.abs(p.x)<.31)color=TOP[c.top]||TOP.pink;
      else if(p.y>.52&&p.y<.88&&Math.abs(p.x)<.34)color=UNDERWEAR;
    }else{
      const upper=p.y>.78&&p.y<1.48&&Math.abs(p.x)<.38;
      if(upper)color=c.outfit==='formal'?0x42516f:TOP[c.top]||TOP.pink;
      if(p.y>.48&&p.y<.90&&Math.abs(p.x)<.36)color=BOTTOM[c.bottom]||BOTTOM.denim;
      if(c.outfit==='dress'&&p.y>.52&&p.y<1.48&&Math.abs(p.x)<.43)color=TOP[c.top]||TOP.pink;
      if(c.outfit==='hoodie'&&p.y>.74&&p.y<1.54)color=TOP[c.top]||TOP.sky;
      if(c.outfit==='formal'&&p.y>.46&&p.y<.92)color=0x29334a;
    }
    return new THREE.Color(color);
  };
  const orderCutPolygon=points=>{
    if(points.length<4)return points;
    let cx=0,cy=0,cz=0;for(const i of points){cx+=verts[i*3];cy+=verts[i*3+1];cz+=verts[i*3+2]}cx/=points.length;cy/=points.length;cz/=points.length;
    const e=.006,gx=bodyField({x:cx+e,y:cy,z:cz})-bodyField({x:cx-e,y:cy,z:cz}),gy=bodyField({x:cx,y:cy+e,z:cz})-bodyField({x:cx,y:cy-e,z:cz}),gz=bodyField({x:cx,y:cy,z:cz+e})-bodyField({x:cx,y:cy,z:cz-e}),gl=Math.hypot(gx,gy,gz)||1,nx=gx/gl,ny=gy/gl,nz=gz/gl;
    const ax=Math.abs(ny)>.92?1:0,ay=Math.abs(ny)>.92?0:1,az=0,ux0=ay*nz-az*ny,uy0=az*nx-ax*nz,uz0=ax*ny-ay*nx,ul=Math.hypot(ux0,uy0,uz0)||1,ux=ux0/ul,uy=uy0/ul,uz=uz0/ul,vx=ny*uz-nz*uy,vy=nz*ux-nx*uz,vz=nx*uy-ny*ux;
    return points.slice().sort((a,b)=>{const apx=verts[a*3]-cx,apy=verts[a*3+1]-cy,apz=verts[a*3+2]-cz,bpx=verts[b*3]-cx,bpy=verts[b*3+1]-cy,bpz=verts[b*3+2]-cz;return Math.atan2(apy*vy+apz*vz+apx*vx,apy*uy+apz*uz+apx*ux)-Math.atan2(bpy*vy+bpz*vz+bpx*vx,bpy*uy+bpz*uz+bpx*ux)});
  };
  const pushPoint=(a,b)=>{
    const t=a.v/(a.v-b.v),p={x:a.p.x+(b.p.x-a.p.x)*t,y:a.p.y+(b.p.y-a.p.y)*t,z:a.p.z+(b.p.z-a.p.z)*t};
    const key=[p.x,p.y,p.z].map(v=>Math.round(v*100000)).join(',');
    const existing=vertexMap.get(key);if(existing!==undefined)return existing;
    const i=verts.length/3;vertexMap.set(key,i);verts.push(p.x,p.y,p.z);const col=colorAt(p);colors.push(col.r,col.g,col.b);return i;
  };
  for(let x=0;x<nx;x++)for(let y=0;y<ny;y++)for(let z=0;z<nz;z++){
    const q=[sample(x,y,z),sample(x+1,y,z),sample(x+1,y,z+1),sample(x,y,z+1),sample(x,y+1,z),sample(x+1,y+1,z),sample(x+1,y+1,z+1),sample(x,y+1,z+1)];
    for(const ids of TETS){
      const t=ids.map(i=>q[i]),inside=t.filter(v=>v.v<0).length;if(!inside||inside===4)continue;
      const cut=[];for(const [a,b] of EDGES)if((t[a].v<0)!==(t[b].v<0))cut.push(pushPoint(t[a],t[b]));
      if(cut.length>=3){const ordered=orderCutPolygon(cut);for(let i=1;i<ordered.length-1;i++)emitSurfaceTriangle(ordered[0],ordered[i],ordered[i+1])}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();g.userData={geometryTopology:AG_ORIGINAL_CHARACTER_TOPOLOGY,vertexCount:verts.length/3,triangleCount:indices.length/3};return g;
}
function bone(name,parent,x,y,z){const b=new THREE.Bone();b.name=name;b.position.set(x,y,z);(parent||null)?.add(b);return b}
function segmentDistance(p,a,b){const ab=new THREE.Vector3().subVectors(b,a),t=Math.max(0,Math.min(1,ab.dot(new THREE.Vector3().subVectors(p,a))/Math.max(ab.lengthSq(),.0001)));return p.distanceTo(new THREE.Vector3().copy(a).addScaledVector(ab,t))}
function bindConnectedBody(mesh,bones,positions){
  const pos=mesh.geometry.getAttribute('position'),si=[],sw=[];
  // Keep the continuous body intact while the authored skeleton remains available for poses.
  // The previous proximity weights were calculated in a different bind space and visibly tore the mesh.
  for(let i=0;i<pos.count;i++){si.push(0,0,0,0);sw.push(1,0,0,0)}
  mesh.geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(si,4));
  mesh.geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(sw,4));
  mesh.add(bones[0]);bones[0].updateMatrixWorld(true);mesh.updateMatrixWorld(true);
  const skeleton=new THREE.Skeleton(bones);mesh.bind(skeleton);mesh.pose();
  mesh.userData.skinningMode='root-stabilized-connected-v1';
  return skeleton;
}
function addFaceAndHair(visual,c,bones){
  const head=bones.head,face=new THREE.Group();face.name='agcb-original-face';head.add(face);face.position.set(0,.02,-.245);
  const skinMat=new THREE.MeshStandardMaterial({color:SKIN[c.skin]||SKIN.light,roughness:.9}),hairMat=new THREE.MeshStandardMaterial({color:HAIR[c.hair]||HAIR.chestnut,roughness:.9}),hairLightMat=new THREE.MeshStandardMaterial({color:new THREE.Color(HAIR[c.hair]||HAIR.chestnut).offsetHSL(0,.02,.06),roughness:.88}),hairPartMat=new THREE.MeshStandardMaterial({color:new THREE.Color(HAIR[c.hair]||HAIR.chestnut).offsetHSL(0,.02,-.12),roughness:.92}),eyeMat=new THREE.MeshStandardMaterial({color:0x392d2b,roughness:.58}),whiteMat=new THREE.MeshStandardMaterial({color:0xfffdf8,roughness:.82}),mouthMat=new THREE.MeshStandardMaterial({color:0x7e4350,roughness:.82}),cheekMat=new THREE.MeshBasicMaterial({color:0xf09b98,transparent:true,opacity:.48});
  const female=c.gender==='girl',male=!female,adult=c.age==='adult',eyeRadius=adult?.044:.057,eyeGap=adult?(female?.102:.096):(female?.115:.108),headWidth=adult?.235:.275;
  for(const x of[-eyeGap,eyeGap]){organicFeature(face,'agcb-eye-white',whiteMat,[x,.035,-.035],[eyeRadius,eyeRadius*.92,eyeRadius*.20], [0,0,0]);organicFeature(face,'agcb-eye-pupil',eyeMat,[x,.035,-.077],[eyeRadius*.46,eyeRadius*.50,eyeRadius*.17]);organicFeature(face,'agcb-eye-highlight',whiteMat,[x-eyeRadius*.12,.056,-.092],[eyeRadius*.14,eyeRadius*.14,eyeRadius*.05]);}
  for(const x of[-eyeGap,eyeGap])profileVolume(face,'agcb-brow',hairMat,[x,0,0],[{y:.105,rx:male?.019:.015,rz:.009,cx:-.018,cz:-.075},{y:.125,rx:male?.023:.018,rz:.010,cx:.018,cz:-.075}],[0,0,x<0?-.10:.10]);
  organicFeature(face,'agcb-nose',skinMat,[0,-.012,-.055],[adult?.022:.019,adult?.022:.018,.012]);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(female?(adult?.040:.038):(adult?.035:.033),.005,6,14,Math.PI),mouthMat);smile.rotation.z=Math.PI;smile.position.set(0,-.070,-.062);face.add(smile);
  organicFeature(face,'agcb-cheek-l',cheekMat,[-(adult?.165:.18),-.038,-.056],[adult?.030:.034,adult?.016:.018,.008]);organicFeature(face,'agcb-cheek-r',cheekMat,[adult?.165:.18,-.038,-.056],[adult?.030:.034,adult?.016:.018,.008]);
  if(female)for(const x of[-eyeGap,eyeGap])profileVolume(face,'agcb-eyelash',hairMat,[x,0,0],[{y:.095,rx:.008,rz:.006,cx:x<0?-.018:.018,cz:-.084},{y:.117,rx:.009,rz:.006,cx:x<0?-.008:.008,cz:-.084}],[0,0,x<0?-.18:.18]);
  organicFeature(face,'agcb-ear-l',skinMat,[-headWidth,.005,.005],[.034,.060,.022]);organicFeature(face,'agcb-ear-r',skinMat,[headWidth,.005,.005],[.034,.060,.022]);
  const hair=new THREE.Group();hair.name='agcb-original-hair';head.add(hair);hair.position.set(0,.10,.045);
  const requestedStyle=c.hairStyle||'bob',style=female?requestedStyle:(requestedStyle==='bob'?'short':requestedStyle),cap=female?(adult?.225:.255):(adult?.205:.235);
  const capProfile=[{y:-.11,rx:cap*.58,rz:cap*.38,cx:0,cz:.13},{y:0,rx:cap*.90,rz:cap*.48,cx:0,cz:.14},{y:.13,rx:cap,rz:cap*.50,cx:-.01,cz:.12},{y:.23,rx:cap*.74,rz:cap*.38,cx:.02,cz:.08},{y:.29,rx:cap*.32,rz:cap*.18,cx:.03,cz:.03}];
  profileVolume(hair,'agcb-hair-cap',hairMat,[0,.04,.10],capProfile);
  const lock=(name,x,y,z,length,width,depth,tilt=0,material=hairMat)=>profileVolume(hair,name,material,[x,y,z],[{y:-length*.52,rx:width*.22,rz:depth*.20,cx:-tilt*.03,cz:0},{y:-length*.20,rx:width*.46,rz:depth*.33,cx:-tilt*.01,cz:-.008},{y:length*.20,rx:width*.58,rz:depth*.42,cx:tilt*.02,cz:-.008},{y:length*.50,rx:width*.24,rz:depth*.20,cx:tilt*.04,cz:0}],[0,0,tilt]);
  const fringeXs=female?[-.23,-.13,-.045,.045,.13,.23]:[-.18,-.09,0,.09,.18];
  const fringeLengths=style==='long'||style==='ponytail'?(female?[.18,.22,.26,.24,.20,.16]:[.16,.19,.22,.19,.15]):style==='curly'?(female?[.16,.19,.18,.21,.18,.14]:[.14,.17,.19,.16,.13]):(female?[.13,.17,.20,.17,.14,.11]:[.11,.14,.17,.14,.10]);
  fringeXs.forEach((x,i)=>{const center=i-(fringeXs.length-1)/2;lock('agcb-hair-fringe-'+i,x,.185+Math.abs(center)*.006,-.205,fringeLengths[i],female?.075:.065,female?.055:.050,center*.09,i%3===0?hairLightMat:hairMat)});
  profileVolume(hair,'agcb-hair-side-part',hairPartMat,[female?-.04:.045,.235,-.16],[{y:-.02,rx:.003,rz:.004},{y:.07,rx:.004,rz:.005,cx:.02},{y:.13,rx:.003,rz:.004,cx:.035}],[0,0,female?-.18:.18]);
  if(female){
    if(style==='curly')for(let i=0;i<3;i++){const curl=.16+i*.035;lock('agcb-hair-curl-l-'+i,-.27+i*.035,.04,.06,curl,.085+i*.01,.08+i*.01,-.12,i%2?hairMat:hairLightMat);lock('agcb-hair-curl-r-'+i,.27-i*.035,.04,.06,curl,.085+i*.01,.08+i*.01,.12,i%2?hairMat:hairLightMat)}
    if(style==='long'||style==='ponytail'||style==='curly'){lock('agcb-hair-curtain-l',-.22,-.10,.14,.36,.11,.12,-.05);lock('agcb-hair-curtain-r',.22,-.10,.14,.38,.11,.12,.05)}
    if(style==='ponytail'||(!adult&&style==='bob')){
      const tieMat=new THREE.MeshStandardMaterial({color:TOP[c.top]||TOP.pink,roughness:.84});
      for(const x of[-.29,.29]){const side=x<0?'l':'r';organicFeature(hair,'agcb-girl-ribbon-'+side,tieMat,[x,.02,.16],[.050,.030,.028],[0,0,x<0?-.12:.12]);lock('agcb-girl-ponytail-'+side,x,-.12,.16,.34,.11,.10,x<0?-.14:.14,hairLightMat);}
    }
  }else if(style==='short'){
    lock('agcb-boy-side-lock-l',-.22,-.02,.04,adult?.12:.10,.060,.055,-.06);
    lock('agcb-boy-side-lock-r',.22,-.02,.04,adult?.12:.10,.060,.055,.06);
    if(!adult){lock('agcb-boy-fringe-l',-.14,.18,-.19,.16,.075,.055,-.16,hairLightMat);lock('agcb-boy-fringe-c',-.03,.22,-.19,.18,.075,.055,0,hairMat);lock('agcb-boy-fringe-r',.10,.18,-.19,.14,.070,.052,.15,hairLightMat)}
  }
  face.scale.setScalar(adult?.98:1.0);hair.scale.setScalar(adult?.96:1.0);
  if(c.hat==='beanie'){const hatMat=new THREE.MeshStandardMaterial({color:0x8bb8d8,roughness:.86});profileVolume(hair,'agcb-beanie-crown',hatMat,[0,.28,.02],[{y:-.08,rx:.25,rz:.23,cz:.01},{y:.08,rx:.30,rz:.27,cz:.02},{y:.22,rx:.24,rz:.22,cz:.02},{y:.28,rx:.12,rz:.12,cz:.01}])}
  if(c.hat==='sun'){const hatMat=new THREE.MeshStandardMaterial({color:0xf0c56b,roughness:.88});const brim=new THREE.Mesh(flatRingGeometry(.36,.20,.045),hatMat);brim.name='agcb-sunhat-brim';brim.rotation.x=Math.PI/2;brim.position.set(0,.31,-.01);hair.add(brim);profileVolume(hair,'agcb-sunhat-crown',hatMat,[0,.34,.01],[{y:-.06,rx:.19,rz:.17},{y:.10,rx:.22,rz:.19},{y:.18,rx:.16,rz:.14}])}
  if(c.glasses==='round'){const frame=new THREE.MeshStandardMaterial({color:0x453d48,roughness:.62});for(const x of[-.145,.145]){const ring=new THREE.Mesh(flatRingGeometry(.086,.073,.014,20),frame);ring.name='agcb-glasses-ring';ring.position.set(x,.05,-.102);face.add(ring)}profileVolume(face,'agcb-glasses-bridge',frame,[0,.05,-.103],[{y:-.009,rx:.045,rz:.007},{y:.009,rx:.045,rz:.007}])}
  if(c.accessory==='scarf'){const scarf=new THREE.Mesh(new THREE.TorusGeometry(.25,.035,8,24),new THREE.MeshStandardMaterial({color:0xe48791,roughness:.84}));scarf.rotation.x=Math.PI/2;scarf.position.set(0,-.23,.02);head.add(scarf)}
  if(c.accessory==='bow'){const bow=new THREE.Group();bow.name='agcb-bow-accessory';for(const x of[-.10,.10])organicFeature(bow,'agcb-bow-wing',new THREE.MeshStandardMaterial({color:0xe48791,roughness:.84}),[x,0,-.02],[.15,.09,.035],[0,0,x<0?-.18:.18]);organicFeature(bow,'agcb-bow-knot',new THREE.MeshStandardMaterial({color:0xd96779,roughness:.82}),[0,0,-.05],[.045,.036,.018]);bow.position.set(0,-.18,-.34);head.add(bow)}
  if(c.accessory==='backpack'){const pack=new THREE.Mesh(new THREE.BoxGeometry(.32,.38,.12),new THREE.MeshStandardMaterial({color:0xf09a68,roughness:.88}));pack.name='agcb-backpack-accessory';pack.position.set(0,.02,.31);head.add(pack)}
  return {face,hair};
}
function addPaperDollMarkers(visual,c){
  const slots={};for(const slot of PAPER_DOLL_SLOTS){const marker=new THREE.Group();marker.name='agcb-paper-doll-'+slot;marker.userData={slot,assetId:slot==='bodyBase'?'ag-character-base-underwear-v1':slot==='underlayer'?'ag-underlayer-basic-v1':c[slot]||'none',visible:slot==='bodyBase'||slot==='underlayer'};marker.visible=false;visual.add(marker);slots[slot]=marker}
  visual.userData.paperDollSlots=slots;visual.userData.paperDollSchema=1;return slots;
}
function roundGarment(parent,name,color,position,scale){
  const material=new THREE.MeshStandardMaterial({color,roughness:.82,metalness:.01});
  return organicFeature(parent,name,material,position,scale,[0,0,0]);
}
function applyPaperDoll(visual,c,bones,slots){
  const clear=slot=>{while(slots[slot].children.length)slots[slot].remove(slots[slot].children[0]);slots[slot].visible=false};
  for(const slot of PAPER_DOLL_SLOTS)clear(slot);
  if(c.outfit==='underwear'){
    // The connected body already carries the underwear colors; skip a coplanar overlay to avoid z-fighting speckles.
    slots.underlayer.visible=false;visual.userData.underwearLayerMode='body-color-only-z-fight-safe-v1';return;
  }
  slots.underlayer.visible=true;
  profileVolume(slots.underlayer,'agcb-underlayer-top',new THREE.MeshStandardMaterial({color:UNDERWEAR,roughness:.84}),[0,.02,0],[{y:-.22,rx:.25,rz:.20},{y:-.08,rx:.31,rz:.24},{y:.13,rx:.29,rz:.23},{y:.24,rx:.23,rz:.19}]);
  profileVolume(slots.underlayer,'agcb-underlayer-bottom',new THREE.MeshStandardMaterial({color:UNDERWEAR,roughness:.84}),[0,-.04,0],[{y:-.16,rx:.26,rz:.21},{y:.02,rx:.30,rz:.23},{y:.14,rx:.25,rz:.20}]);
  slots.top.visible=true;
  slots.top.userData.anchor='agcb-chest';
  const female=c.gender==='girl',adult=c.age==='adult',male=!female;
  const topColor=TOP[c.top]||TOP.pink,topMat=new THREE.MeshStandardMaterial({color:topColor,roughness:.84});
  profileVolume(bones.chest,'agcb-daily-top',topMat,[0,-.07,0],[{y:-.31,rx:.245,rz:.205},{y:-.19,rx:.30,rz:.245},{y:.08,rx:.31,rz:.25},{y:.22,rx:.255,rz:.205}]);
  profileVolume(bones.chest,'agcb-top-neckline',new THREE.MeshStandardMaterial({color:0xf7d9c7,roughness:.82}),[0,.17,-.19],[{y:-.025,rx:.12,rz:.022},{y:.025,rx:.135,rz:.022}]);
  profileVolume(bones.chest,'agcb-top-waist-trim',new THREE.MeshStandardMaterial({color:new THREE.Color(topColor).offsetHSL(0,.04,-.14),roughness:.86}),[0,-.22,-.235],[{y:-.025,rx:.255,rz:.025},{y:.025,rx:.255,rz:.025}]);
  if(adult&&male){
    // Adult male: jacket front, shirt placket and lapels create a tailored
    // upper-body read even when the player uses the simple overall slot.
    const jacketMat=new THREE.MeshStandardMaterial({color:0x4b5878,roughness:.88}),trimMat=new THREE.MeshStandardMaterial({color:0xf5eadb,roughness:.86});
    profileVolume(bones.chest,'agcb-adult-male-jacket-front',jacketMat,[0,-.08,-.205],[{y:-.23,rx:.27,rz:.035},{y:.16,rx:.29,rz:.035}]);
    profileVolume(bones.chest,'agcb-adult-male-shirt-panel',trimMat,[0,.03,-.245],[{y:-.14,rx:.072,rz:.022},{y:.17,rx:.080,rz:.022}]);
    profileVolume(bones.chest,'agcb-adult-male-lapel-l',trimMat,[-.105,.05,-.255],[{y:-.13,rx:.025,rz:.020},{y:.12,rx:.070,rz:.020}],[0,0,-.24]);
    profileVolume(bones.chest,'agcb-adult-male-lapel-r',trimMat,[.105,.05,-.255],[{y:-.13,rx:.025,rz:.020},{y:.12,rx:.070,rz:.020}],[0,0,.24]);
    profileVolume(bones.chest,'agcb-adult-male-jacket-shell',jacketMat,[0,-.08,.01],[{y:-.26,rx:.26,rz:.21},{y:.18,rx:.29,rz:.22}]);
    slots.bottom.visible=true;slots.bottom.userData.anchor='agcb-hips';
    profileVolume(slots.bottom,'agcb-adult-male-trouser-l',new THREE.MeshStandardMaterial({color:0x29334a,roughness:.9}),[-.14,.52,0],[{y:-.25,rx:.12,rz:.14},{y:.20,rx:.13,rz:.15}]);
    profileVolume(slots.bottom,'agcb-adult-male-trouser-r',new THREE.MeshStandardMaterial({color:0x29334a,roughness:.9}),[.14,.52,0],[{y:-.25,rx:.12,rz:.14},{y:.20,rx:.13,rz:.15}]);
    organicFeature(slots.top,'agcb-adult-male-suit-sleeve-l',jacketMat,[-.33,1.27,0],[.10,.22,.12],[0,0,-.15]);
    organicFeature(slots.top,'agcb-adult-male-suit-sleeve-r',jacketMat,[.33,1.27,0],[.10,.22,.12],[0,0,.15]);
  }else if(adult&&female){
    // Adult female: a clean blouse neckline and a defined waist line support
    // the wider-hip silhouette instead of reading as a scaled child.
    profileVolume(bones.chest,'agcb-adult-female-collar',new THREE.MeshStandardMaterial({color:0xfff4e6,roughness:.84}),[0,.14,-.255],[{y:-.025,rx:.11,rz:.022},{y:.035,rx:.13,rz:.022}]);
    profileVolume(bones.chest,'agcb-adult-female-waist-belt',new THREE.MeshStandardMaterial({color:BOTTOM[c.bottom]||BOTTOM.cream,roughness:.86}),[0,-.22,-.258],[{y:-.025,rx:.255,rz:.024},{y:.025,rx:.255,rz:.024}]);
  }else if(!adult&&female&&c.outfit==='dress'){
    profileVolume(bones.chest,'agcb-girl-dress-collar',new THREE.MeshStandardMaterial({color:0xfff4e6,roughness:.84}),[0,.12,-.255],[{y:-.020,rx:.10,rz:.020},{y:.035,rx:.12,rz:.020}]);
    profileVolume(bones.hips,'agcb-girl-dress-hem',new THREE.MeshStandardMaterial({color:new THREE.Color(topColor).offsetHSL(0,.02,-.10),roughness:.86}),[0,-.24,-.255],[{y:-.030,rx:.38,rz:.025},{y:.030,rx:.40,rz:.025}]);
  }
  if(c.outfit==='hoodie'){
    profileVolume(bones.chest,'agcb-hoodie-pocket',new THREE.MeshStandardMaterial({color:0x6d9fca,roughness:.84}),[0,-.30,-.26],[{y:-.07,rx:.15,rz:.025},{y:.07,rx:.18,rz:.025}]);
    profileVolume(bones.chest,'agcb-hoodie-hood',new THREE.MeshStandardMaterial({color:new THREE.Color(topColor).offsetHSL(0,0,-.10),roughness:.86}),[0,.20,.02],[{y:-.04,rx:.19,rz:.15},{y:.08,rx:.22,rz:.16}]);
    const sleeveMat=new THREE.MeshStandardMaterial({color:topColor,roughness:.86});
    organicFeature(slots.top,'agcb-hoodie-sleeve-l',sleeveMat,[-.33,1.26,0],[.105,.22,.12],[0,0,-.16]);
    organicFeature(slots.top,'agcb-hoodie-sleeve-r',sleeveMat,[.33,1.26,0],[.105,.22,.12],[0,0,.16]);
  }
  if(c.outfit==='overall'){
    slots.bottom.visible=true;
    slots.bottom.userData.anchor='agcb-hips';
    const bottomColor=BOTTOM[c.bottom]||BOTTOM.denim,bottomMat=new THREE.MeshStandardMaterial({color:bottomColor,roughness:.84});
    profileVolume(bones.hips,'agcb-overall-bottom',bottomMat,[0,-.02,0],[{y:-.22,rx:.32,rz:.24},{y:-.08,rx:.38,rz:.28},{y:.16,rx:.34,rz:.25},{y:.24,rx:.27,rz:.22}]);
    profileVolume(bones.chest,'agcb-overall-bib',bottomMat,[0,-.17,-.235],[{y:-.16,rx:.17,rz:.035},{y:.08,rx:.19,rz:.040},{y:.18,rx:.16,rz:.035}]);
    profileVolume(bones.chest,'agcb-overall-straps',new THREE.MeshStandardMaterial({color:bottomColor,roughness:.84}),[-.18,.07,-.205],[{y:-.04,rx:.035,rz:.025},{y:.17,rx:.035,rz:.025}],[0,0,-.12]);
    profileVolume(bones.chest,'agcb-overall-strap-r',new THREE.MeshStandardMaterial({color:bottomColor,roughness:.84}),[.18,.07,-.205],[{y:-.04,rx:.035,rz:.025},{y:.17,rx:.035,rz:.025}],[0,0,.12]);
    const sleeveMat=new THREE.MeshStandardMaterial({color:topColor,roughness:.86});
    organicFeature(slots.top,'agcb-overall-sleeve-l',sleeveMat,[-.33,1.27,0],[.095,.18,.11],[0,0,-.12]);
    organicFeature(slots.top,'agcb-overall-sleeve-r',sleeveMat,[.33,1.27,0],[.095,.18,.11],[0,0,.12]);
  }else if(c.outfit==='dress'){
    slots.dress.visible=true;
    slots.dress.userData.anchor='agcb-hips';
    const dressMat=new THREE.MeshStandardMaterial({color:TOP[c.top]||TOP.pink,roughness:.84});
    profileVolume(bones.hips,'agcb-formal-dress',dressMat,[0,-.18,0],[{y:-.28,rx:.44,rz:.31},{y:-.12,rx:.40,rz:.29},{y:.12,rx:.34,rz:.26},{y:.26,rx:.30,rz:.24}]);
    profileVolume(bones.hips,'agcb-dress-waist-sash',new THREE.MeshStandardMaterial({color:BOTTOM[c.bottom]||BOTTOM.cream,roughness:.84}),[0,.06,-.27],[{y:-.035,rx:.28,rz:.026},{y:.035,rx:.30,rz:.026}]);
    const sleeveMat=new THREE.MeshStandardMaterial({color:dressMat.color.clone().offsetHSL(0,0,-.06),roughness:.86});
    organicFeature(slots.top,'agcb-dress-sleeve-l',sleeveMat,[-.31,1.27,0],[.095,.16,.11],[0,0,-.14]);
    organicFeature(slots.top,'agcb-dress-sleeve-r',sleeveMat,[.31,1.27,0],[.095,.16,.11],[0,0,.14]);
  }
  if(c.outfit==='overall'||c.outfit==='hoodie'){
    slots.bottom.visible=true;slots.bottom.userData.anchor='agcb-hips';
    const trouserMat=new THREE.MeshStandardMaterial({color:BOTTOM[c.bottom]||BOTTOM.denim,roughness:.86});
    organicFeature(slots.bottom,'agcb-pants-l',trouserMat,[-.14,.52,0],[.115,.25,.13]);
    organicFeature(slots.bottom,'agcb-pants-r',trouserMat,[.14,.52,0],[.115,.25,.13]);
  }
  slots.shoes.visible=true;
  const shoeMat=new THREE.MeshStandardMaterial({color:0x665f5b,roughness:.82}),soleMat=new THREE.MeshStandardMaterial({color:0x3c3540,roughness:.88});
  const makeShoe=(name,foot)=>{
    const shoe=profileVolume(foot,name,shoeMat,[0,-.04,-.08],[{y:-.12,rx:.14,rz:.18,cz:-.02},{y:-.02,rx:.20,rz:.27,cz:-.03},{y:.09,rx:.19,rz:.25,cz:-.02},{y:.14,rx:.12,rz:.16,cz:0}]);
    profileVolume(foot,name+'-sole',soleMat,[0,-.11,-.10],[{y:-.025,rx:.15,rz:.20,cz:-.02},{y:.025,rx:.21,rz:.28,cz:-.03}]);return shoe;
  };
  const leftShoe=makeShoe('agcb-shoe-l',bones.footL),rightShoe=makeShoe('agcb-shoe-r',bones.footR);
  leftShoe.position.x=-.18;rightShoe.position.x=.18;
}
export function createOriginalCharacter(c){
  const visual=new THREE.Group();visual.name='agcb-original-connected-avatar';visual.userData.assetStatus='AG_ORIGINAL_CONNECTED_BODY';
  const geom=makeConnectedBodyGeometry(c),material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.84,metalness:.01,side:THREE.DoubleSide});
  const mesh=new THREE.SkinnedMesh(geom,material);mesh.name='agcb-original-connected-skinned-body';mesh.castShadow=true;mesh.receiveShadow=true;visual.add(mesh);
  const adult=c.age==='adult',male=c.gender==='boy',yScale=adult?1.04:.86,y0=.035,Y=v=>y0+(v-y0)*yScale;
  const hipY=Y(.73),spineY=Y(1.15),chestY=Y(1.43),neckY=Y(1.63),headY=Y(1.87);
  const armX=male?(adult?.36:.31):(adult?.28:.27),legX=adult?.18:.14,armDrop=adult?-.21:-.18,legDrop=adult?-.33:-.28;
  const root=bone('agcb-root',null,0,0,0),hips=bone('agcb-hips',root,0,hipY,0),spine=bone('agcb-spine',hips,0,spineY-hipY,0),chest=bone('agcb-chest',spine,0,chestY-spineY,0),neck=bone('agcb-neck',chest,0,neckY-chestY,0),head=bone('agcb-head',neck,0,headY-neckY,0);
  const upperL=bone('agcb-upper-arm-l',chest,-armX,.02,0),foreL=bone('agcb-forearm-l',upperL,-.12,armDrop,0),handL=bone('agcb-hand-l',foreL,-.03,armDrop,0);
  const upperR=bone('agcb-upper-arm-r',chest,armX,.02,0),foreR=bone('agcb-forearm-r',upperR,.12,armDrop,0),handR=bone('agcb-hand-r',foreR,.03,armDrop,0);
  const thighL=bone('agcb-thigh-l',hips,-legX,-.12,0),shinL=bone('agcb-shin-l',thighL,0,legDrop,0),footL=bone('agcb-foot-l',shinL,0,adult?-.24:-.20,-.08);
  const thighR=bone('agcb-thigh-r',hips,legX,-.12,0),shinR=bone('agcb-shin-r',thighR,0,legDrop,0),footR=bone('agcb-foot-r',shinR,0,adult?-.24:-.20,-.08);
  const bones=[root,hips,spine,chest,neck,head,upperL,foreL,handL,upperR,foreR,handR,thighL,shinL,footL,thighR,shinR,footR];
  const pairs=[[[0,0,0],[0,hipY,0]],[[0,hipY,0],[0,spineY,0]],[[0,spineY,0],[0,chestY,0]],[[0,chestY,0],[0,neckY,0]],[[0,neckY,0],[0,Y(1.84),0]],[[0,Y(1.84),0],[0,headY+.15*yScale,0]],[[-armX,chestY-.12,0],[-armX-.12,Y(1.08),0]],[[-armX-.12,Y(1.08),0],[-armX-.15,Y(.78),0]],[[-armX-.15,Y(.78),0],[-armX-.15,Y(.70),0]],[[armX,chestY-.12,0],[armX+.12,Y(1.08),0]],[[armX+.12,Y(1.08),0],[armX+.15,Y(.78),0]],[[armX+.15,Y(.78),0],[armX+.15,Y(.70),0]],[[-legX,hipY,0],[-legX,Y(.64),0]],[[-legX,Y(.64),0],[-legX,Y(.29),0]],[[-legX,Y(.29),0],[-legX,Y(.07),-.08]],[[legX,hipY,0],[legX,Y(.64),0]],[[legX,Y(.64),0],[legX,Y(.29),0]],[[legX,Y(.29),0],[legX,Y(.07),-.08]]];
  bindConnectedBody(mesh,bones,pairs);const extras=addFaceAndHair(visual,c,{head});const slots=addPaperDollMarkers(visual,c);applyPaperDoll(visual,c,{head,chest,hips,footL,footR},slots);slots.hair.visible=true;slots.hat.visible=c.hat!=='none';slots.glasses.userData.assetId=c.glasses||'none';slots.accessory.userData.assetId=c.accessory||'none';
  const parts={leftArm:upperL,rightArm:upperR,leftLeg:shinL,rightLeg:shinR,legs:[shinL,shinR],body:chest,bib:slots.top};
  const g=new THREE.Group();g.name='agcb-original-character';g.add(visual);g.userData={agOriginal:true,assetStatus:'AG_ORIGINAL_CONNECTED_BODY',visual,animatedParts:parts,baseBodyY:chest.position.y,body:chest,legs:parts.legs,paperDollSlots:slots,paperDollApplied:true,face:extras.face,hair:extras.hair};
  const ageScale=adult?[1.01,1.02,1.01]:[.90,.90,.90],genderScale=male?[1.04,1,1.01]:[.98,1,1],bodyScale=c.body==='tall'?[.95,1.07,.97]:c.body==='petite'?[.94,.94,.95]:[1.05,1,1.02];g.scale.set(ageScale[0]*genderScale[0]*bodyScale[0],ageScale[1]*bodyScale[1],ageScale[2]*bodyScale[2]);return g;
}
globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>createOriginalCharacter(c);
globalThis.__AGCB_ORIGINAL_CHARACTER={schema:AG_ORIGINAL_CHARACTER_SCHEMA,enabled:true,source:'AG authored procedural connected skinned mesh',body:'ag-character-base-underwear-v1',paperDollSlots:PAPER_DOLL_SLOTS,animalStatus:'authoring',topology:AG_ORIGINAL_CHARACTER_TOPOLOGY,variants:['girl-child','boy-child','girl-adult','boy-adult'],featureSet:'gender-age-silhouette-face-hair-v8',detailSet:'four-hero-proportion-garment-v7'};
