import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('/tmp/package.json');
const {chromium}=require('playwright');
const dir='character-v104-visual';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-webgl']});
const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
await page.addInitScript(()=>localStorage.setItem('agcb_prod_v1_character_selection','boy005'));
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(`${r.url()}: ${r.failure()?.errorText}`));
const report=[];
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>globalThis.__AGCB_TEST_CHARACTER_INTEGRATION?.player,{timeout:60000});
 for(const role of ['boy005','ual3','special2','special5','test3']){
  await page.evaluate(role=>globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.select(role),role);
  await page.waitForFunction(role=>{const x=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION;return x?.selected===role&&x.candidate?.root?.parent===x.player&&globalThis.__AGCB_BOOTSTRAP?.characterRuntimeGate==='READY'},role,{timeout:90000});
  const state=await page.evaluate(()=>{const x=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION,p=x.player,c=x.candidate;return{selected:x.selected,attached:!!c&&c.root.parent===p,visible:!!c&&c.root.visible,baseVisible:p?.userData?.visual?.visible,gate:globalThis.__AGCB_BOOTSTRAP?.characterRuntimeGate,meshes:c?.root?.children?.length||0,indicator:document.getElementById('agTestCharacterIndicator')?.textContent}});
  report.push({role,...state});
  if(!state.attached||!state.visible||state.baseVisible!==false||state.gate!=='READY')throw Error(`${role}: ${JSON.stringify(state)}`);
  for(const action of ['idle','walk','run','jump']){
   await page.evaluate(action=>{const c=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION.candidate;c.play(action);c.update(1/30)},action);
   await page.waitForTimeout(200);
   await page.screenshot({path:`${dir}/${role}-${action}.png`});
  }
 }
 if(errors.length)throw Error(`Browser errors: ${errors.join('\n')}`);
}finally{
 fs.writeFileSync(`${dir}/report.json`,JSON.stringify({report,errors},null,2));
 await browser.close();
}
