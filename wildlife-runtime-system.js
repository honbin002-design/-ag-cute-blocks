// AG Cute Blocks wildlife runtime planning for a large shared world.
// Pure state/LOD logic: rendering stays in wildlife-models.js and the active world runtime.

export const WILDLIFE_SCHEMA=1;
export const WILDLIFE_MAX_ACTIVE=9;

const HOME_PLOTS=[[-58,-30],[-58,28],[-4,-54],[-2,53],[52,-8],[55,48]];
const SPECIES={
  deer:{minGroup:1,maxGroup:2,roamRadius:7,walkSpeed:.0048,preferred:['forest','meadow'],avoidPlayer:5},
  rabbit:{minGroup:1,maxGroup:3,roamRadius:4.5,walkSpeed:.0068,preferred:['meadow','forestEdge'],avoidPlayer:3},
  fox:{minGroup:1,maxGroup:1,roamRadius:8,walkSpeed:.0058,preferred:['forest','forestEdge'],avoidPlayer:6}
};

function hash01(seed){const x=Math.sin(seed*91.137+17.733)*43758.5453;return x-Math.floor(x)}
function hashString(s=''){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function sqr(v){return v*v}
function nearHome(x,z,margin=9){return HOME_PLOTS.some(([hx,hz])=>sqr(x-hx)+sqr(z-hz)<sqr(19+margin))}
function nearWaterApprox(x,z){const riverX=-38+z*.1,dx=(x-42)/1.35,dz=(z+38)/.78;return Math.abs(x-riverX)<10||dx*dx+dz*dz<26*26}

export const WILDLIFE_ZONES=[
  {id:'north-woods',kind:'forest',x:-34,z:66,radius:20},
  {id:'east-meadow',kind:'meadow',x:66,z:12,radius:18},
  {id:'south-woods',kind:'forest',x:10,z:-70,radius:18},
  {id:'lake-edge',kind:'forestEdge',x:55,z:-55,radius:16},
  {id:'west-meadow',kind:'meadow',x:-72,z:-4,radius:16}
];

export function wildlifeSpeciesRules(type){return SPECIES[type]||SPECIES.rabbit}
export function wildlifeLOD(distance,quality='normal'){
  const q=quality==='low'?.78:quality==='high'?1.12:1;
  if(distance<18*q)return {visible:true,animate:true,updateEvery:1,detail:'full'};
  if(distance<34*q)return {visible:true,animate:true,updateEvery:2,detail:'medium'};
  if(distance<52*q)return {visible:true,animate:false,updateEvery:6,detail:'low'};
  return {visible:false,animate:false,updateEvery:18,detail:'hidden'};
}

export function createWildlifePopulation(worldSeed='world-1',saved=[]){
  if(Array.isArray(saved)&&saved.length)return saved.map((x,i)=>({...x,id:x.id||`wild-${i}`,schema:WILDLIFE_SCHEMA}));
  const seed=hashString(String(worldSeed)),out=[];
  let ordinal=0;
  for(const zone of WILDLIFE_ZONES){
    const candidates=Object.entries(SPECIES).filter(([,r])=>r.preferred.includes(zone.kind));
    const count=zone.kind==='meadow'?2:2;
    for(let i=0;i<count&&out.length<WILDLIFE_MAX_ACTIVE;i++){
      const pick=candidates[Math.floor(hash01(seed+ordinal*7.7)*candidates.length)]||candidates[0];
      const type=pick[0],a=hash01(seed+ordinal*11.1)*Math.PI*2,r=zone.radius*(.22+.55*hash01(seed+ordinal*13.9));
      let x=zone.x+Math.cos(a)*r,z=zone.z+Math.sin(a)*r;
      if(nearHome(x,z,6)){x=zone.x;z=zone.z}
      out.push({schema:WILDLIFE_SCHEMA,id:`wild-${zone.id}-${ordinal}`,type,zoneId:zone.id,x,z,homeX:x,homeZ:z,phase:hash01(seed+ordinal*19.3)*Math.PI*2,state:'idle'});ordinal++;
    }
  }
  return out;
}

export function updateWildlifeEntity(entity,{playerX=0,playerZ=0,timeSeconds=0,dt=1,quality='normal'}={}){
  const rules=wildlifeSpeciesRules(entity.type),dxp=playerX-entity.x,dzp=playerZ-entity.z,playerDist=Math.hypot(dxp,dzp),lod=wildlifeLOD(playerDist,quality);
  if(!lod.visible)return {...entity,lod,state:'idle'};
  const phase=(entity.phase||0)+dt*.0025,angle=phase+(hashString(entity.id)%628)/100;
  let targetX=entity.homeX+Math.sin(angle)*rules.roamRadius,targetZ=entity.homeZ+Math.cos(angle*.83)*rules.roamRadius;
  let state='walk';
  if(playerDist<rules.avoidPlayer){targetX=entity.x-dxp;targetZ=entity.z-dzp;state='walk'}
  else if(Math.sin(timeSeconds*.11+phase)>.72)state=entity.type==='rabbit'?'idle':'eat';
  if(nearWaterApprox(entity.x,entity.z)&&Math.sin(timeSeconds*.07+phase)>.88)state='drink';
  if(state==='walk'){
    const dx=targetX-entity.x,dz=targetZ-entity.z,d=Math.hypot(dx,dz)||1,s=rules.walkSpeed*dt*(entity.type==='rabbit'?1.25:1);
    entity.x+=dx/d*s;entity.z+=dz/d*s;
  }
  entity.phase=phase;entity.state=state;entity.lod=lod;return entity;
}

export function wildlifeNearPlayer(population,playerX,playerZ,max=WILDLIFE_MAX_ACTIVE){
  return [...population].sort((a,b)=>Math.hypot(a.x-playerX,a.z-playerZ)-Math.hypot(b.x-playerX,b.z-playerZ)).slice(0,max);
}
