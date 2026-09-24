// Adult-female face integration pass 1.
// This pass only balances relative placement of already-authored adult-female parts.
// It does not replace the individual eye/brow/nose/mouth/contour/lash/hair geometries.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function shiftNamed(root,prefix,dx=0,dy=0,dz=0){
  if(!root)return 0;
  let count=0;
  root.traverse(o=>{
    if(o!==root&&o.name?.startsWith(prefix)){
      o.position.x+=dx;o.position.y+=dy;o.position.z+=dz;count++;
    }
  });
  return count;
}

function balanceAdultFemaleFace(character){
  const face=character?.userData?.face;
  const hair=character?.userData?.hair;
  if(!face||!hair)return character;

  // Bring the brows closer to the eyes and raise the eye line a touch.
  // This removes the tall forehead/childlike spacing without changing eye geometry.
  shiftNamed(face,'agcb-adult-female-eye-',0,.004,0);
  shiftNamed(face,'agcb-adult-female-brow-',0,-.011,-.001);
  shiftNamed(face,'agcb-adult-female-eyelash-',0,.004,0);

  // Keep the nose-to-mouth rhythm compact and adult: the nose tip sits slightly higher,
  // while the lips move only minimally so the chin keeps enough visual length.
  shiftNamed(face,'agcb-adult-female-nose-bridge-',0,.003,0);
  shiftNamed(face,'agcb-adult-female-nose-tip-',0,.004,-.001);
  shiftNamed(face,'agcb-adult-female-nose-ala-',0,.004,-.001);
  shiftNamed(face,'agcb-adult-female-upper-lip-',0,.001,0);
  shiftNamed(face,'agcb-adult-female-lower-lip-',0,.001,0);
  shiftNamed(face,'agcb-adult-female-mouth-crease-',0,.001,0);

  // Face framing: pull the side locks slightly inward, drop the fringe a little,
  // and reduce crown width very slightly for a cleaner 3/4 silhouette.
  for(const name of['agcb-adult-female-side-lock-l-v1','agcb-adult-female-side-lock-r-v1']){
    const o=hair.getObjectByName(name);
    if(o)o.position.x+=name.includes('-l-') ? .008 : -.008;
  }
  shiftNamed(hair,'agcb-adult-female-fringe-',0,-.010,-.002);
  const crown=hair.getObjectByName('agcb-adult-female-hair-crown-v1');
  if(crown){crown.scale.x*=.975;crown.scale.y*=1.015;crown.position.y-=.004;}

  face.userData.integratedFaceGeometry='adult-female-balanced-face-v1';
  face.userData.integratedFaceFit={eyeRaise:.004,browDrop:.011,noseRaise:.004,fringeDrop:.010,crownWidthScale:.975};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?balanceAdultFemaleFace(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_FACE_INTEGRATION={version:1,scope:'adult-female-face-integration-only',geometry:'balanced-face-v1',loaded:true};
