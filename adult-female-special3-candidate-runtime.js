import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// Adult-female candidate route built on the existing Special 3 GLB base.
// Approved visual target (2026-09-02): chibi adult woman, more defined adult
// proportions, long wavy hair, white top and light-colour long trousers.
// The original Special 3 option remains untouched.
const KEY='agcb_adult_female_special3_candidate_v1';
const DISPLAY_VERSION='V0.4.79';
const STYLE_REV='adult-female-reference-20260902-v1';
const avatar=document.querySelector('#avatar');
const age=document.querySelector('#avatarAge');
const body=document.querySelector('#avatarBody');

// Visible release label must move whenever a playable character revision changes.
const versionBadge=document.querySelector('.title small');
if(versionBadge)versionBadge.textContent=DISPLAY_VERSION;
const versionNote=document.querySelector('.note');
if(versionNote)versionNote.textContent=versionNote.textContent.replace(/^V0\.4\.\d+：/,`${DISPLAY_VERSION}：`);

function active(){return localStorage.getItem(KEY)==='1';}
function setActive(v){if(v)localStorage.setItem(KEY,'1');else localStorage.removeItem(KEY);}
function meshLabel(o,m){return `${o?.name||''} ${m?.name||''}`.toLowerCase();}
function setMaterialLook(m,color,{roughness=.80,metalness=.02}={}){
  if(!m)return;
  if(m.color)m.color.setHex(color);
  if('metalness'in m)m.metalness=Math.min(metalness,m.metalness??metalness);
  if('roughness'in m)m.roughness=Math.max(roughness,m.roughness??roughness);
  m.needsUpdate=true;
}
function applyApprovedPalette(root){
  // Clothing names are preferred. Mapped materials keep their texture detail and
  // receive only a neutral tint; facial/eye/mouth materials are never overwritten.
  root.traverse(o=>{
    if(!o.isMesh)return;
    const mats=Array.isArray(o.material)?o.material:[o.material];
    for(const m of mats){
      if(!m?.color)continue;
      const label=meshLabel(o,m);
      if(/eye|iris|pupil|mouth|teeth|tongue|lash|brow/.test(label))continue;
      if(/hair|bang|pony|fringe|curl|lock/.test(label))setMaterialLook(m,0x5b4038,{roughness:.78});
      else if(/shoe|boot|sole/.test(label))setMaterialLook(m,0xd8d0ca,{roughness:.84});
      else if(/pant|trouser|slack|jean|bottom|legwear/.test(label))setMaterialLook(m,0xe8e1d8,{roughness:.86});
      else if(/shirt|blouse|top|sleeve|upper|cloth|dress/.test(label))setMaterialLook(m,0xf8f6f1,{roughness:.84});
      else if(/skin|face|head|hand|arm|neck/.test(label)&&!m.map)setMaterialLook(m,0xf2c5a5,{roughness:.82});
      else if(m.map)setMaterialLook(m,0xffffff,{roughness:.78});
    }
  });
}
function tuneAdultFemaleProportions(root){
  // Mild, reversible-on-reload bone scale adjustment. This deliberately stays
  // conservative so animations remain usable while the adult silhouette reads
  // differently from the child Special 3 preset.
  const chest=root.getObjectByName('chest')||root.getObjectByName('Chest');
  const hips=root.getObjectByName('hips')||root.getObjectByName('Hips');
  if(chest){chest.scale.x*=1.045;chest.scale.z*=1.025;}
  if(hips){hips.scale.x*=1.055;hips.scale.z*=1.025;}
}
function buildLongWavyHairLayer(group){
  const u=group.userData,root=u?.assetRoot,visual=u?.visual;
  if(!root||!visual)return null;
  const old=visual.getObjectByName('agcb-adult-female-long-wavy-hair');
  if(old)visual.remove(old);
  visual.updateMatrixWorld(true);root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  if(!Number.isFinite(size.y)||size.y<.5)return null;
  const layer=new THREE.Group();layer.name='agcb-adult-female-long-wavy-hair';layer.userData={styleRevision:STYLE_REV,nonDestructive:true};
  const mat=new THREE.MeshStandardMaterial({color:0x5b4038,roughness:.80,metalness:.01});
  const addStrand=(xRatio,yRatio,zRatio,heightRatio,radiusRatio,tilt=0)=>{
    const radius=Math.max(.028,size.y*radiusRatio),length=Math.max(.08,size.y*heightRatio-radius*2);
    const strand=new THREE.Mesh(new THREE.CapsuleGeometry(radius,length,5,10),mat.clone());
    const worldPoint=new THREE.Vector3(center.x+size.x*xRatio,box.min.y+size.y*yRatio,center.z+size.z*zRatio);
    const local=visual.worldToLocal(worldPoint.clone());strand.position.copy(local);strand.rotation.z=tilt;strand.castShadow=true;layer.add(strand);
  };
  // Long curled silhouette: centre-back mass plus asymmetric side locks. The
  // strands stay behind the face because model front is toward box.min.z.
  addStrand(-.31,.61,.31,.25,.036,-.12);
  addStrand(-.19,.56,.37,.31,.040,-.06);
  addStrand(-.06,.54,.40,.34,.043,-.02);
  addStrand(.08,.54,.40,.34,.043,.02);
  addStrand(.21,.56,.37,.31,.040,.07);
  addStrand(.32,.61,.31,.25,.036,.13);
  addStrand(-.39,.66,.18,.21,.032,-.18);
  addStrand(.40,.66,.18,.21,.032,.18);
  // Soft upper-back crown connects the strands so it reads as hair instead of
  // separate tubes while leaving the original face mesh visible.
  const crown=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.06,size.y*.105),18,12),mat.clone());
  crown.scale.set(Math.max(1.25,size.x/(size.y*.21)),.72,.62);
  crown.position.copy(visual.worldToLocal(new THREE.Vector3(center.x,box.min.y+size.y*.79,center.z+size.z*.28)));
  crown.castShadow=true;layer.add(crown);
  visual.add(layer);return layer;
}
function repaintCandidate(){
  if(!active())return;
  for(const group of globalThis.__AGCB_LIVE_AVATARS||[]){
    const u=group?.userData;
    if(u?.assetVariant!=='special3'||u?.assetAge!=='adult'||!u.assetRoot)continue;
    if(u.assetRoot.userData?.adultFemaleSpecial3CandidateStyle===STYLE_REV)continue;
    applyApprovedPalette(u.assetRoot);
    tuneAdultFemaleProportions(u.assetRoot);
    const hairLayer=buildLongWavyHairLayer(group);
    u.assetRoot.userData.adultFemaleSpecial3CandidateApplied=true;
    u.assetRoot.userData.adultFemaleSpecial3CandidateStyle=STYLE_REV;
    u.adultFemaleHairLayer=hairLayer;
    u.adultFemaleCandidateBase='special3-glb';
    u.adultFemaleCandidateRevision='v3';
    u.adultFemaleCandidateLook={hair:'long-wavy',top:'white',bottom:'light-long-trousers',proportion:'adult-defined'};
  }
}

function selectCandidate(){
  if(!avatar)return;
  setActive(true);
  // Reuse the exact tested Special 3 asset path, then switch only its age/body
  // customization to adult proportions. No second GLB is introduced.
  avatar.value='special3';
  avatar.__agcbBaseOnchange?.call(avatar,{target:avatar});
  setTimeout(()=>{
    if(age){age.value='adult';age.onchange?.call(age,{target:age});}
    if(body&&[...body.options].some(o=>o.value==='default')){body.value='default';body.onchange?.call(body,{target:body});}
    avatar.value='adultFemaleCandidate';
    repaintCandidate();
  },0);
}

if(avatar){
  const original=avatar.onchange;
  avatar.__agcbBaseOnchange=original;
  const option=document.createElement('option');
  option.value='adultFemaleCandidate';
  option.textContent='👩 成年女性候選';
  avatar.appendChild(option);
  avatar.onchange=e=>{
    if(e.target.value!=='adultFemaleCandidate'){
      setActive(false);
      return original?.call(avatar,e);
    }
    selectCandidate();
  };
  // On reload the app has already restored role/age/body from avatarCustomization.
  // If an older save was left as child Special3, repair it once to the candidate contract.
  if(active()){
    const currentAge=age?.value;
    if(avatar.value!=='special3'||currentAge!=='adult')selectCandidate();
    else{avatar.value='adultFemaleCandidate';repaintCandidate();}
  }
}

const timer=setInterval(repaintCandidate,250);
setTimeout(()=>clearInterval(timer),15000);
globalThis.__AGCB_ADULT_FEMALE_SPECIAL3_CANDIDATE={version:3,displayVersion:DISPLAY_VERSION,styleRevision:STYLE_REV,scope:'special3-glb-adult-female-candidate-only',base:'Meshy_AI_Meshy_Merged_Animations.glb',approvedLook:{hair:'long-wavy',top:'white',bottom:'light-long-trousers',proportion:'adult-defined'},preservesOriginalSpecial3:true,persistence:'repair-on-reload-v2',loaded:true};
