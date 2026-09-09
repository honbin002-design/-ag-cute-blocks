// Adult-female visual refinement v3.
// Focus: hair detail, side-profile nose/lip/chin rhythm, and front-view facial balance.
// This pass is incremental and only touches already-authored adult-female parts.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function move(o,dx=0,dy=0,dz=0){if(!o)return false;o.position.x+=dx;o.position.y+=dy;o.position.z+=dz;return true;}
function scale(o,x=1,y=1,z=1){if(!o)return false;o.scale.x*=x;o.scale.y*=y;o.scale.z*=z;return true;}
function eachPrefix(root,prefix,fn){if(!root)return 0;let n=0;root.traverse(o=>{if(o!==root&&o.name?.startsWith(prefix)){fn(o);n++;}});return n;}

function refineAdultFemaleVisualV3(character){
  const face=character?.userData?.face;
  const hair=character?.userData?.hair;
  if(!face||!hair)return character;

  // Front-view balance: reduce excess eye width a touch, keep vertical openness,
  // and tighten the mouth width so the face reads refined rather than doll-like.
  eachPrefix(face,'agcb-adult-female-eye-',o=>scale(o,.992,1.006,1));
  eachPrefix(face,'agcb-adult-female-brow-',o=>{scale(o,.988,1,1);move(o,0,.001,0);});
  for(const name of['agcb-adult-female-upper-lip-v1','agcb-adult-female-lower-lip-v1','agcb-adult-female-mouth-crease-v1']){
    const o=face.getObjectByName(name);if(o)scale(o,.972,1,1);
  }

  // Side-profile rhythm: a slightly clearer bridge, restrained tip projection,
  // compact lip projection, and a marginally longer chin/jaw shell.
  const bridge=face.getObjectByName('agcb-adult-female-nose-bridge-v1');
  if(bridge){scale(bridge,.96,1.035,1.035);move(bridge,0,.001,-.0015);}
  const tip=face.getObjectByName('agcb-adult-female-nose-tip-v1');
  if(tip){scale(tip,.96,.98,.94);move(tip,0,.001,.0015);}
  for(const name of['agcb-adult-female-nose-ala-l-v1','agcb-adult-female-nose-ala-r-v1']){
    const o=face.getObjectByName(name);if(o){scale(o,.93,.94,.92);move(o,0,.001,.001);}
  }
  for(const name of['agcb-adult-female-upper-lip-v1','agcb-adult-female-lower-lip-v1','agcb-adult-female-mouth-crease-v1']){
    const o=face.getObjectByName(name);if(o)move(o,0,-.001,.0015);
  }
  const jaw=face.getObjectByName('agcb-adult-female-cheek-jaw-shell-v1');
  if(jaw){scale(jaw,.992,1.012,1);move(jaw,0,-.001,0);}

  // Hair detail: separate fringe strands slightly, taper the side locks,
  // and reduce rear curtain bulk so 3/4 and side views stay close to the face.
  const fringeNames=[
    'agcb-adult-female-fringe-l2-v1','agcb-adult-female-fringe-l1-v1',
    'agcb-adult-female-fringe-r1-v1','agcb-adult-female-fringe-r2-v1'
  ];
  fringeNames.forEach((name,i)=>{
    const o=hair.getObjectByName(name);if(!o)return;
    const outer=i===0||i===3;
    scale(o,outer?.975:.985,1.012,.982);
    move(o,(i<2?-1:1)*(outer?.0025:.0015),outer?-.001:.001,.001);
  });
  for(const name of['agcb-adult-female-side-lock-l-v1','agcb-adult-female-side-lock-r-v1']){
    const o=hair.getObjectByName(name);if(o){scale(o,.965,1.015,.972);move(o,name.includes('-l-')?.0025:-.0025,-.001,.002);}
  }
  for(const name of['agcb-adult-female-back-lock-l-v1','agcb-adult-female-back-lock-r-v1']){
    const o=hair.getObjectByName(name);if(o){scale(o,.955,1.008,.970);move(o,name.includes('-l-')?.003:-.003,0,-.002);}
  }
  const crown=hair.getObjectByName('agcb-adult-female-hair-crown-v1');
  if(crown){scale(crown,.994,1.004,.985);move(crown,0,.001,-.001);}

  character.userData.adultFemaleVisualGeometryV3='adult-female-profile-hair-balance-v3';
  character.userData.adultFemaleVisualFitV3={
    eyeX:.992,mouthX:.972,bridgeY:1.035,tipZ:.94,jawY:1.012,
    sideLockX:.965,backLockX:.955,crownZ:.985
  };
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?refineAdultFemaleVisualV3(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_VISUAL_REFINEMENT_V3={version:3,scope:'adult-female-profile-hair-refinement-only',geometry:'profile-hair-balance-v3',loaded:true};
