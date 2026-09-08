// AG Cute Blocks V0.5.83 - maid work assignments: mature harvest + shared crop watering.
// Task metadata only lives here. Actual world/resource/care mutation MUST go through
// __AGCB_WORLD_TASK_API owned by guarded core/shared crop-care runtime.
const VERSION='V0.5.83',KEY='ag_cute_blocks_worker_tasks_v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{schema:1,worker:'女僕一號',task:null}}catch{return{schema:1,worker:'女僕一號',task:null}}};
const write=s=>localStorage.setItem(KEY,JSON.stringify(s));
let state=read(),box=null,timer=0;
function api(){return globalThis.__AGCB_WORLD_TASK_API}
function save(){write(state);render()}
function harvestTargets(){return api()?.listMatureCrops?.()||[]}
function waterTargets(){return api()?.listNeedsWater?.()||[]}
function assign(kind,targets){if(!targets.length)return false;state.task={id:`${kind}-${Date.now()}`,kind,status:'working',targetIds:targets.map(x=>x.id),completed:0,startedAt:Date.now(),lastResult:null};save();schedule(180);return true}
function assignHarvest(){const targets=harvestTargets();if(!targets.length){setStatus('目前沒有成熟作物可收成');return false}return assign('harvestMature',targets)}
function assignWater(){const targets=waterTargets();if(!targets.length){setStatus('目前沒有需要澆水的作物');return false}return assign('waterCrops',targets)}
function cancel(){if(timer)clearTimeout(timer);timer=0;if(state.task){state.task.status='cancelled';state.task.endedAt=Date.now()}save()}
function schedule(ms=900){if(timer||state.task?.status!=='working')return;timer=setTimeout(step,ms)}
function execute(a,task,id){if(task.kind==='harvestMature')return a.harvestMatureCropById?.(id);if(task.kind==='waterCrops')return a.waterCropById?.(id);return{ok:false,reason:'unknown-task'}}
function completionText(task){if(task.kind==='waterCrops')return task.completed?`女僕完成澆水：${task.completed} 株使用同一份作物照護資料`:'女僕檢查完成：沒有需要澆水的作物';return task.completed?`女僕完成收成：${task.completed} 份已放入同一個背包`:'女僕檢查完成：沒有可收成作物'}
function step(){timer=0;const task=state.task,a=api();if(!task||task.status!=='working'||!a){schedule(700);return}let result=null;while(task.targetIds.length&&!result?.ok){const id=task.targetIds.shift();result=execute(a,task,id);if(result?.ok){task.completed++;task.lastResult=result;break}}if(!task.targetIds.length){task.status='done';task.endedAt=Date.now();setStatus(completionText(task));save();return}save();schedule(1050)}
function setStatus(text){const s=document.querySelector('#status');if(s)s.textContent=text}
function render(){if(!box)return;const t=state.task,harvest=harvestTargets().length,water=waterTargets().length,working=t?.status==='working',done=t?.status==='done',label=t?.kind==='waterCrops'?'澆水':'收成';box.innerHTML=`<h3 style="margin:0 0 7px">🧹 女僕工作</h3><div style="font-size:11px;line-height:1.45;margin-bottom:8px">${state.worker}・收成進既有背包；澆水共用既有作物照護資料。</div><div style="font-size:12px;margin-bottom:8px">成熟：<b>${harvest}</b>　需澆水：<b>${water}</b>${t?`<br>目前：<b>${working?'工作中':done?'完成':t.status}</b>・${label} <b>${t.completed||0}</b>`:''}</div><button id="agMaidHarvest" style="width:100%;border:0;border-radius:10px;padding:9px;background:#fff1b8;font-weight:900" ${working||!harvest?'disabled':''}>🧺 指派收成熟作物</button><button id="agMaidWater" style="width:100%;border:0;border-radius:10px;padding:9px;margin-top:6px;background:#dff6ff;font-weight:900" ${working||!water?'disabled':''}>💧 指派澆水</button>${working?'<button id="agMaidCancel" style="width:100%;border:0;border-radius:10px;padding:8px;margin-top:6px;background:#eee;font-weight:800">停止目前工作</button>':''}`;box.querySelector('#agMaidHarvest')?.addEventListener('click',assignHarvest);box.querySelector('#agMaidWater')?.addEventListener('click',assignWater);box.querySelector('#agMaidCancel')?.addEventListener('click',cancel)}
function install(){const panel=document.querySelector('#lifePanel');if(!panel){setTimeout(install,350);return}if(document.querySelector('#agMaidWork')){box=document.querySelector('#agMaidWork');render();return}box=document.createElement('section');box.id='agMaidWork';box.className='lifeSection';panel.appendChild(box);render();if(state.task?.status==='working')schedule(450);setInterval(render,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
globalThis.__AGCB_MAID_WORK={version:VERSION,get state(){return state},assignHarvest,assignWater,cancel,step,status:'REAL_SHARED_CORE_AND_CARE_MUTATION_ONLY'};
