// Adult-female full silhouette integration v1.
// Runs after body-proportion v1 and only adds restrained leg/garment-slot compensation.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function scaleBone(bone,x=1,y=1,z=1){
  if(!bone)return false;
  bone.scale.x*=x;bone.scale.y*=y;bone.scale.z*=z;return true;
}

function refineAdultFemaleSilhouette(character){
  const visual=character?.userData?.visual;
  const slots=character?.userData?.paperDollSlots;
  if(!visual)return character;
  const get=n=>visual.getObjectByName(n);

  const thighL=get('agcb-thigh-l'),thighR=get('agcb-thigh-r');
  const shinL=get('agcb-shin-l'),shinR=get('agcb-shin-r');
  const footL=get('agcb-foot-l'),footR=get('agcb-foot-r');

  // Finish the adult head-to-body rhythm with slightly longer, slimmer legs.
  for(const b of[thighL,thighR])scaleBone(b,.965,1.030,.975);
  for(const b of[shinL,shinR])scaleBone(b,.955,1.025,.970);
  for(const b of[footL,footR])scaleBone(b,.970,1.000,.975);
  if(thighL)thighL.position.x-=.006;
  if(thighR)thighR.position.x+=.006;

  // Garments directly parented to chest/hips already inherit bone changes.
  // Only compensate paper-doll slot garments that live in visual space.
  if(slots?.underlayer){
    slots.underlayer.scale.x*=.985;
    slots.underlayer.scale.y*=1.010;
  }
  if(slots?.top){
    slots.top.scale.x*=.992;
    slots.top.scale.y*=1.008;
  }
  if(slots?.bottom){
    slots.bottom.scale.x*=.985;
    slots.bottom.scale.y*=1.018;
  }
  if(slots?.dress){
    // Dress body is hip-parented in current authored outfits; keep slot neutral to avoid double-scaling.
    slots.dress.userData.fitMode='bone-inherited-no-double-scale-v1';
  }

  character.userData.adultFemaleSilhouetteGeometry='adult-female-full-silhouette-v1';
  character.userData.adultFemaleGarmentFit={
    strategy:'bone-inherited-plus-paper-doll-slot-compensation-v1',
    underlayer:[.985,1.010],top:[.992,1.008],bottom:[.985,1.018],dress:'inherit-bone'
  };
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'?refineAdultFemaleSilhouette(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_FULL_SILHOUETTE={version:1,scope:'adult-female-full-silhouette-only',geometry:'full-silhouette-v1',garmentFit:'slot-compensation-v1',loaded:true};
