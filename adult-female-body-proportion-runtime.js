// Adult-female body proportion integration v1.
// Incremental bone-space correction only: no skeleton rebuild, no changes to other variants.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function scaleBone(bone,x=1,y=1,z=1){
  if(!bone)return false;
  bone.scale.x*=x;bone.scale.y*=y;bone.scale.z*=z;return true;
}

function refineAdultFemaleBody(character){
  const visual=character?.userData?.visual;
  if(!visual)return character;
  const get=n=>visual.getObjectByName(n);

  const hips=get('agcb-hips'),spine=get('agcb-spine'),chest=get('agcb-chest');
  const neck=get('agcb-neck'),head=get('agcb-head');
  const upperL=get('agcb-upper-arm-l'),upperR=get('agcb-upper-arm-r');
  const foreL=get('agcb-forearm-l'),foreR=get('agcb-forearm-r');

  // Hip/waist/chest rhythm: a small hip expansion, a cleaner waist transition,
  // then a modest shoulder/chest recovery. Values are deliberately restrained.
  scaleBone(hips,1.020,1.000,1.018);
  scaleBone(spine,.965,1.018,.982);
  scaleBone(chest,1.055,1.010,1.018);

  // Longer, slimmer neck and a slightly smaller head improve adult head-to-body ratio.
  scaleBone(neck,.945,1.055,.945);
  scaleBone(head,.925,.940,.940);

  // Arms stay feminine without becoming thin sticks; tiny extra length improves silhouette.
  for(const arm of[upperL,upperR])scaleBone(arm,.940,1.025,.945);
  for(const arm of[foreL,foreR])scaleBone(arm,.950,1.018,.950);

  // Shoulder attachment points move outward a touch after the waist correction.
  if(upperL)upperL.position.x-=.012;
  if(upperR)upperR.position.x+=.012;

  character.userData.adultFemaleBodyGeometry='adult-female-balanced-body-v1';
  character.userData.adultFemaleBodyFit={
    hipX:1.020,waistX:.965,chestX:1.055,neckY:1.055,headScale:[.925,.940,.940],shoulderOffset:.012
  };
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?refineAdultFemaleBody(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_BODY_PROPORTION={version:1,scope:'adult-female-body-only',geometry:'balanced-body-v1',loaded:true};
