// Adult-female visual refinement v2.
// Focus: front / 3-quarter adult read. This pass only refines existing adult-female parts.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function move(o,dx=0,dy=0,dz=0){if(!o)return false;o.position.x+=dx;o.position.y+=dy;o.position.z+=dz;return true;}
function scale(o,x=1,y=1,z=1){if(!o)return false;o.scale.x*=x;o.scale.y*=y;o.scale.z*=z;return true;}
function eachPrefix(root,prefix,fn){if(!root)return 0;let n=0;root.traverse(o=>{if(o!==root&&o.name?.startsWith(prefix)){fn(o);n++;}});return n;}

function refineAdultFemaleVisualV2(character){
  const visual=character?.userData?.visual;
  const face=character?.userData?.face;
  const hair=character?.userData?.hair;
  if(!visual||!face||!hair)return character;
  const get=n=>visual.getObjectByName(n);

  // Front-view maturity: slightly narrower face width with a touch more vertical length.
  // This changes the whole head container only minimally so all passed facial parts stay registered.
  const head=get('agcb-head');
  if(head){scale(head,.990,1.008,.998);}

  // Keep eye treatment refined but reduce the wide-eyed/childlike read a little.
  eachPrefix(face,'agcb-adult-female-eye-',o=>scale(o,.985,.975,1));
  eachPrefix(face,'agcb-adult-female-eyelash-',o=>{scale(o,.985,.990,1);move(o,0,-.001,0);});

  // Brows sit a touch closer to the eye line, giving a calmer adult expression.
  eachPrefix(face,'agcb-adult-female-brow-',o=>move(o,0,-.002,0));

  // Strengthen chin/jaw length very slightly without creating a sharp V face.
  const jaw=face.getObjectByName('agcb-adult-female-cheek-jaw-shell-v1');
  if(jaw){scale(jaw,.985,1.020,1);move(jaw,0,-.002,0);}

  // Cheeks become a little subtler, preserving softness without reading as child blush pads.
  for(const name of['agcb-adult-female-cheek-soft-l-v1','agcb-adult-female-cheek-soft-r-v1']){
    const o=face.getObjectByName(name);if(o){scale(o,.94,.90,.90);if(o.material&&'opacity' in o.material)o.material.opacity=Math.min(o.material.opacity,.24);}
  }

  // Hair framing: bring side locks slightly closer to the cheeks and expose a little more forehead.
  for(const name of['agcb-adult-female-side-lock-l-v1','agcb-adult-female-side-lock-r-v1']){
    const o=hair.getObjectByName(name);if(o)move(o,name.includes('-l-')?.004:-.004,.002,.001);
  }
  eachPrefix(hair,'agcb-adult-female-fringe-',o=>{move(o,0,.003,.001);scale(o,.985,.990,.990);});

  const crown=hair.getObjectByName('agcb-adult-female-hair-crown-v1');
  if(crown){scale(crown,.990,1.010,.995);move(crown,0,.002,0);}

  character.userData.adultFemaleVisualGeometryV2='adult-female-front-three-quarter-v2';
  character.userData.adultFemaleVisualFitV2={
    head:[.990,1.008,.998],eye:[.985,.975],browDrop:.002,jaw:[.985,1.020],cheekOpacity:.24,
    sideLockInward:.004,fringeRaise:.003,crown:[.990,1.010,.995]
  };
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?refineAdultFemaleVisualV2(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_VISUAL_REFINEMENT_V2={version:2,scope:'adult-female-front-three-quarter-refinement-only',geometry:'front-three-quarter-v2',loaded:true};
