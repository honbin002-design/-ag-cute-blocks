// Adult-female outfit refinement v1.
// Focus: dress silhouette, waist placement, sleeve lightness and paper-doll fit.
// This pass is incremental and only applies to the adult-female dress configuration.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function move(o,dx=0,dy=0,dz=0){if(!o)return false;o.position.x+=dx;o.position.y+=dy;o.position.z+=dz;return true;}
function scale(o,x=1,y=1,z=1){if(!o)return false;o.scale.x*=x;o.scale.y*=y;o.scale.z*=z;return true;}

function refineAdultFemaleOutfit(character){
  const visual=character?.userData?.visual;
  const slots=character?.userData?.paperDollSlots;
  if(!visual||!slots)return character;

  const dress=visual.getObjectByName('agcb-formal-dress');
  const sash=visual.getObjectByName('agcb-dress-waist-sash');
  const collar=visual.getObjectByName('agcb-adult-female-collar');
  const belt=visual.getObjectByName('agcb-adult-female-waist-belt');
  const sleeveL=visual.getObjectByName('agcb-dress-sleeve-l');
  const sleeveR=visual.getObjectByName('agcb-dress-sleeve-r');

  // Japanese-anime adult silhouette: cleaner waist, slightly longer skirt,
  // moderate hem width and less bulky depth from front/3-quarter views.
  if(dress){scale(dress,.965,1.055,.955);move(dress,0,-.012,.006);}
  if(sash){scale(sash,.955,.82,.90);move(sash,0,.018,-.004);}

  // Keep neckline delicate and avoid a thick double-waist caused by the base blouse belt.
  if(collar){scale(collar,.94,.88,.88);move(collar,0,.004,.006);}
  if(belt){scale(belt,.94,.72,.86);move(belt,0,.010,.010);}

  // Sleeves should frame the shoulders without overpowering the slim arm silhouette.
  for(const sleeve of[sleeveL,sleeveR]){
    if(sleeve){scale(sleeve,.90,1.06,.92);move(sleeve,0,.004,.004);}
  }
  if(sleeveL)move(sleeveL,.010,0,0);
  if(sleeveR)move(sleeveR,-.010,0,0);

  // Visual-space underlayer compensation only; dress itself already inherits bones.
  if(slots.underlayer){scale(slots.underlayer,.975,1.010,.970);move(slots.underlayer,0,.004,.004);}
  if(slots.top){slots.top.userData.adultFemaleDressSleeveFit='slim-shoulder-follow-v1';}
  if(slots.dress){slots.dress.userData.adultFemaleDressBoneMode='bone-inherited-no-double-scale-v2';}

  character.userData.adultFemaleOutfitGeometry='adult-female-japanese-dress-v1';
  character.userData.adultFemaleOutfitFit={dress:[.965,1.055,.955],sash:[.955,.82,.90],sleeve:[.90,1.06,.92],underlayer:[.975,1.010,.970]};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'&&c?.outfit==='dress'?refineAdultFemaleOutfit(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_OUTFIT_REFINEMENT={version:1,scope:'adult-female-dress-refinement-only',geometry:'japanese-dress-v1',loaded:true};
