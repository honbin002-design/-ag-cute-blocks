import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const {chromium}=createRequire('/tmp/package.json')('playwright');
const dir='character-v104-gameplay';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});
const errors=[],report=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{localStorage.setItem('agcb_prod_v1_character_selection','boy005');localStorage.setItem('agcb_test_sentinel','DO_NOT_TOUCH')});
const frames=()=>page.evaluate(()=>new Promise(resolve=>{let n=0;function frame(){if(++n>=8)resolve();else requestAnimationFrame(frame)}requestAnimationFrame(frame)}));
const read=()=>page.evaluate(()=>{const a=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION;return {selected:a.selected,position:a.player.position.toArray(),locomotion:a.locomotion,gate:globalThis.__AGCB_BOOTSTRAP.characterRuntimeGate,baseVisible:a.player.userData.visual.visible}});
try{
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>globalThis.__AGCB_BOOTSTRAP?.characterRuntimeGate==='READY',null,{timeout:90000});
 await page.locator('#cam').click();
 for(const role of ['boy005','ual3','special2','special5','special3']){
  // Exercise the same visible select element and change handler as the phone.
  await page.locator('#avatar').selectOption(role,{force:true});
  const identity=role==='special3'?'test3':role;
  await page.waitForFunction(id=>{const a=globalThis.__AGCB_TEST_CHARACTER_INTEGRATION;return a?.selected===id&&a.candidate?.root?.parent===a.player&&globalThis.__AGCB_BOOTSTRAP.characterRuntimeGate==='READY'},identity,{timeout:90000});
  await frames();
  const row={role,steps:[]};report.push(row);
  for(const mode of ['walk','run']){
   if((await page.locator('#runToggle').getAttribute('aria-pressed')==='true')!==(mode==='run'))await page.locator('#runToggle').click();
   const before=await read(),b=await page.locator('#joy').boundingBox();
   await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();
   await page.mouse.move(b.x+b.width/2,b.y+10);await frames();
   const after=await read();await page.screenshot({path:`${dir}/${role}-${mode}.png`});await page.mouse.up();
   const distance=Math.hypot(after.position[0]-before.position[0],after.position[2]-before.position[2]);
   assert(distance>.05,`${role} ${mode} did not move`);assert.equal(after.locomotion,mode);assert.equal(after.baseVisible,false);
   row.steps.push({mode,distance,...after});await frames();
  }
  const before=await read();await page.locator('#jump').click();await frames();const after=await read();
  assert(after.position[1]>before.position[1]+.02,`${role} jump did not rise`);
  await page.screenshot({path:`${dir}/${role}-jump.png`});row.steps.push({mode:'jump',heightDelta:after.position[1]-before.position[1],...after});
  await page.waitForTimeout(1200);await frames();
 }
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>globalThis.__AGCB_BOOTSTRAP?.characterRuntimeGate==='READY',null,{timeout:90000});
 assert.equal((await read()).selected,'test3');
 assert.equal(await page.evaluate(()=>localStorage.getItem('agcb_test_sentinel')),'DO_NOT_TOUCH');
 assert.deepEqual(errors,[]);
}finally{fs.writeFileSync(`${dir}/report.json`,JSON.stringify({report,errors},null,2));await browser.close()}
