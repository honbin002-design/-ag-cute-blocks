// AG Cute Blocks V0.5.82 - maid work assignment, first real task: mature-crop harvest.
// Task metadata only lives here. All world/inventory mutation MUST go through
// __AGCB_WORLD_TASK_API owned by the guarded V0.5.04 core.
const VERSION='V0.5.82',KEY='ag_cute_blocks_worker_tasks_v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{schema:1,worker:'女僕一號',task:null}}catch{return{schema:1,worker:'女僕一號',task:null}}};
const write=s=>localStorage.setItem(KEY,JSON.stringify(s));
let state=read(),box=null,timer=0;
function api(){return globalThis.__AGCB_WORLD_TASK_API}
function save(){write(state);render()}
function pendingTargets(){return api()?.listMatureCrops?.()||[]}
function assignHarvest(){const targets=pendingTargets();if(!targets.length){setStatus('目前沒有成熟作物可收成');return false}state.task={id:`harvest-${Date.now()}`,kind:'harvestMature',status:'working',targetIds:targets.map(x=>x.id),completed:0,startedAt:Date.now(),lastResult:null};save();schedule(180);return true}
function cancel(){if(timer)clearTimeout(timer);timer=0;if(state.task){state.task.status='cancelled';state.task.endedAt=Date.now()}save()}
function schedule(ms=900){if(timer||state.task?.status!=='working')return;timer=setTimeout(step,ms)}
function step(){timer=0;const task=state.task,a=api();if(!task||task.status!=='working'||!a){schedule(700);return}let result=null;while(task.targetIds.length&&!result?.ok){const id=task.targetIds.shift();result=a.harvestMatureCropById?.(id);if(result?.ok){task.completed++;task.lastResult=result;break}}if(!task.targetIds.length){task.status='done';task.endedAt=Date.now();setStatus(task.completed?`女僕完成收成：${task.completed} 份已放入同一個背包`:'女僕檢查完成：沒有可收成作物');save();return}save();schedule(1050)}
function setStatus(text){const s=document.querySelector('#status');if(s)s.textContent=text}
function render(){if(!box)return;const t=state.task,ready=pendingTargets().length;const working=t?.status==='working';const done=t?.status==='done';box.innerHTML=`<h3 style="margin:0 0 7px">🧹 女僕工作</h3><div style="font-size:11px;line-height:1.45;margin-bottom:8px">${state.worker}・成果直接進既有背包，不建立第二份資源。</div><div style="font-size:12px;margin-bottom:8px">成熟作物：<b>${ready}</b>${t?`　目前：<b>${working?'工作中':done?'完成':t.status}</b>　已收 <b>${t.completed||0}</b>`:''}</div><button id="agMaidHarvest" style="width:100%;border:0;border-radius:10px;padding:9px;background:#fff1b8;font-weight:900" ${working||!ready?'disabled':''}>🧺 指派收成熟作物</button>${working?'<button id="agMaidCancel" style="width:100%;border:0;border-radius:10px;padding:8px;margin-top:6px;background:#eee;font-weight:800">停止目前工作</button>':''}`;box.querySelector('#agMaidHarvest')?.addEventListener('click',assignHarvest);box.querySelector('#agMaidCancel')?.addEventListener('click',cancel)}
function install(){const panel=document.querySelector('#lifePanel');if(!panel){setTimeout(install,350);return}if(document.querySelector('#agMaidWork')){box=document.querySelector('#agMaidWork');render();return}box=document.createElement('section');box.id='agMaidWork';box.className='lifeSection';panel.appendChild(box);render();if(state.task?.status==='working')schedule(450);setInterval(render,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
globalThis.__AGCB_MAID_WORK={version:VERSION,get state(){return state},assignHarvest,cancel,step,status:'REAL_CORE_MUTATION_ONLY_NO_SECOND_INVENTORY'};
