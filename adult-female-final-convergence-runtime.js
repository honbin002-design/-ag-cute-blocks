// Adult-female final visual convergence v1.
// Unifies dress, shoes and supporting palette without changing the already-reviewed facial geometry.
const baseCreate=globalThis.__AGCB_CREATE_ORIGINAL_AVATAR;

function scale(o,x=1,y=1,z=1){if(!o)return false;o.scale.x*=x;o.scale.y*=y;o.scale.z*=z;return true;}
function move(o,dx=0,dy=0,dz=0){if(!o)return false;o.position.x+=dx;o.position.y+=dy;o.position.z+=dz;return true;}
function recolor(o,hex){
  if(!o?.material)return false;
  const mat=o.material.clone();
  if(mat.color)mat.color.setHex(hex);
  o.material=mat;
  return true;
}

function convergeAdultFemale(character){
  const visual=character?.userData?.visual;
  if(!visual)return character;

  const dress=visual.getObjectByName('agcb-formal-dress');
  const sash=visual.getObjectByName('agcb-dress-waist-sash');
  const collar=visual.getObjectByName('agcb-adult-female-collar');
  const belt=visual.getObjectByName('agcb-adult-female-waist-belt');
  const sleeveL=visual.getObjectByName('agcb-dress-sleeve-l');
  const sleeveR=visual.getObjectByName('agcb-dress-sleeve-r');
  const shoeL=visual.getObjectByName('agcb-shoe-l');
  const shoeR=visual.getObjectByName('agcb-shoe-r');
  const soleL=visual.getObjectByName('agcb-shoe-l-sole');
  const soleR=visual.getObjectByName('agcb-shoe-r-sole');

  // Final outfit palette: muted rose + warm cream keeps the adult female distinct
  // while staying compatible with the game's soft authored palette.
  const rose=0xd8899e,roseShade=0xc9778e,cream=0xf4e4d5,shoe=0x6f5b62,sole=0x41373d;
  recolor(dress,rose);recolor(sash,cream);recolor(collar,cream);recolor(belt,cream);
  recolor(sleeveL,roseShade);recolor(sleeveR,roseShade);

  // Reduce the chunky shoe read; keep the same bones and sole structure.
  for(const s of[shoeL,shoeR]){if(s){scale(s,.88,.92,.91);move(s,0,.008,.010);recolor(s,shoe);}}
  for(const s of[soleL,soleR]){if(s){scale(s,.90,.84,.92);move(s,0,.010,.008);recolor(s,sole);}}

  // Tiny final skirt/waist cadence adjustment only; no face/body re-authoring here.
  if(dress){scale(dress,.985,1.012,.985);move(dress,0,-.004,0);}
  if(sash){scale(sash,.97,.90,.92);move(sash,0,.006,0);}

  character.userData.adultFemaleFinalConvergence='adult-female-finished-look-v1';
  character.userData.adultFemaleGameReady={faceLocked:true,hairLocked:true,bodyLocked:true,outfitIntegrated:true,shoeIntegrated:true};
  return character;
}

if(typeof baseCreate==='function'){
  globalThis.__AGCB_CREATE_ORIGINAL_AVATAR=(c)=>{
    const character=baseCreate(c);
    return c?.gender==='girl'&&c?.age==='adult'&&c?.outfit==='dress'?convergeAdultFemale(character):character;
  };
}

globalThis.__AGCB_ADULT_FEMALE_FINAL_CONVERGENCE={version:1,scope:'adult-female-final-convergence-only',geometry:'finished-look-v1',gameReady:true,loaded:true};
