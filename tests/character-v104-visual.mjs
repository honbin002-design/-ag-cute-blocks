import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('/tmp/package.json');
const {chromium}=require('playwright');
const dir='character-v104-visual';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
await page.addInitScript(()=>localStorage.setItem('agcb_prod_v1_character_selection','boy005'));
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(`${r.url()}: ${r.failure()?.errorText}`));
const report=[];
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>globalThis.__AGCB_TEST_CHARACTER_INTEGRATION?.player,{timeout:60000});
 if((await page.locator('#cam').textContent())?.includes('第一人稱'))await page.locator('#cam').click();
 if(!(await page.locator('#cam').textContent())?.includes('第三人稱'))throw Error('視覺驗收相機不是第三人稱');
 for(const role of ['boy005','ual3','special2','special5','test3']){
  await page.evaluate(role=>globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.select(role),role);
  await page.waitForFunction(role=>{const x=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION;return x?.selected===role&&x.candidate?.root?.parent===x.player&&globalThis.__AGCB_BOOTSTRAP?.characterRuntimeGate==='READY'},role,{timeout:90000});
  const state=await page.evaluate(()=>{const x=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION,p=x.player,c=x.candidate;return{selected:x.selected,attached:!!c&&c.root.parent===p,visible:!!c&&c.root.visible,baseVisible:p?.userData?.visual?.visible,gate:globalThis.__AGCB_BOOTSTRAP?.characterRuntimeGate,meshes:c?.root?.children?.length||0,indicator:document.getElementById('agTestCharacterIndicator')?.textContent}});
  report.push({role,...state});
  if(!state.attached||!state.visible||state.baseVisible!==false||state.gate!=='READY')throw Error(`${role}: ${JSON.stringify(state)}`);
  const poses={};
  console.log('Rendering',role);
  await page.evaluate(()=>{const p=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.player;p.rotation.y=0});
  for(const action of ['idle','walk','run','jump']){
   await page.evaluate(action=>globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.force(action,5000),action);
   await page.waitForTimeout(650);
   poses[action]=await page.evaluate(()=>{const bones=[];globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.candidate.root.traverse(o=>{if(o.isBone)bones.push(...o.quaternion.toArray())});return bones});
   await page.screenshot({path:`${dir}/${role}-${action}.png`});
  }
  const poseDistance=(a,b)=>a.reduce((sum,v,i)=>sum+Math.abs(v-b[i]),0);
  const movement={walk:poseDistance(poses.walk,poses.idle),run:poseDistance(poses.run,poses.idle),jump:poseDistance(poses.jump,poses.idle)};
  report.at(-1).movement=movement;
  if(Object.values(movement).some(n=>n<.01))throw Error(`${role}: animation did not change pose ${JSON.stringify(movement)}`);
 }
 await page.evaluate(()=>globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.select('ual3'));
 await page.waitForFunction(()=>globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.selected==='ual3'&&globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.candidate?.root?.parent===globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.player);
 await page.waitForTimeout(500);await page.screenshot({path:`${dir}/ual3-reselected.png`});
 if(errors.length)throw Error(`Browser errors: ${errors.join('\n')}`);
}finally{
 fs.writeFileSync(`${dir}/report.json`,JSON.stringify({report,errors},null,2));
 await browser.close();
}
