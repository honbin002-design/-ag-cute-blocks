/**
 * AG Cute Blocks — Apps Script self-deploy runner P3.4
 * TEST only. Raw GitHub control transport + immutable commit CDN sources.
 * Prevents stale branch-alias CDN control from targeting an old deployment.
 */
const AGCB_SD_API='https://script.googleapis.com/v1';
const AGCB_SD_DEPLOYMENT_ID='AKfycbx2kSQg7qx4b5MIRGnc-aPL0vjAXw8Fdbc3whvVf72KooBxmGUesF-pLBaMLopgE8gA';
const AGCB_SD_REPO='honbin002-design/-ag-cute-blocks';
const AGCB_SD_CONTROL_PATH='apps-script/agcb-self-deploy-control.json';
const AGCB_SD_PROTOCOL='AGCB_APPS_SCRIPT_SELF_DEPLOY_CONTROL_V1';
const AGCB_SD_POLL_MINUTES=5;

function AGCB_SELF_DEPLOY_PREFLIGHT(){
  const s=agcbSdPreflight_();
  PropertiesService.getScriptProperties().setProperties({AGCB_DEPLOY_RUNNER_STATUS:'PREFLIGHT_PASS',AGCB_DEPLOY_LAST_ERROR:'',AGCB_DEPLOY_LAST_CHECK_AT:new Date().toISOString()},false);
  return {status:s.status,previousVersion:s.previousVersion,releaseId:s.control.releaseId,deploymentId:AGCB_SD_DEPLOYMENT_ID,transport:'RAW_CONTROL_IMMUTABLE_CDN',runner:'P3.4',prodWriteEnabled:false,prodReadEnabled:false,restoreEnabled:false,deleteEnabled:false};
}

function AGCB_SELF_DEPLOY_BOOTSTRAP_ONCE(){
  const p=agcbSdPreflight_();
  const r=agcbSdDeployFromPrepared_(p,true);
  if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='agcbDeployRunnerPoll')) ScriptApp.newTrigger('agcbDeployRunnerPoll').timeBased().everyMinutes(AGCB_SD_POLL_MINUTES).create();
  PropertiesService.getScriptProperties().setProperties({AGCB_DEPLOY_RUNNER_STATUS:'READY',AGCB_DEPLOY_LAST_ERROR:'',AGCB_DEPLOY_RUNNER_INSTALLED_AT:new Date().toISOString()},false);
  return Object.assign({runnerInstalled:true,pollMinutes:AGCB_SD_POLL_MINUTES,transport:'RAW_CONTROL_IMMUTABLE_CDN',runner:'P3.4'},r);
}

function agcbDeployRunnerPoll(){
  try{
    const p=agcbSdPreflight_();
    const r=agcbSdDeployFromPrepared_(p,false);
    PropertiesService.getScriptProperties().setProperties({AGCB_DEPLOY_RUNNER_STATUS:r.status||'READY',AGCB_DEPLOY_LAST_ERROR:'',AGCB_DEPLOY_LAST_CHECK_AT:new Date().toISOString()},false);
    return r;
  }catch(err){
    PropertiesService.getScriptProperties().setProperties({AGCB_DEPLOY_RUNNER_STATUS:'ERROR',AGCB_DEPLOY_LAST_ERROR:String(err&&err.message||err).slice(0,1500),AGCB_DEPLOY_LAST_CHECK_AT:new Date().toISOString()},false);
    throw err;
  }
}

function agcbDeployRunnerStatus(){
  const p=PropertiesService.getScriptProperties();
  return {status:p.getProperty('AGCB_DEPLOY_RUNNER_STATUS')||'NOT_INSTALLED',lastRelease:p.getProperty('AGCB_DEPLOY_LAST_RELEASE')||'',lastVersion:Number(p.getProperty('AGCB_DEPLOY_LAST_VERSION')||0),lastError:p.getProperty('AGCB_DEPLOY_LAST_ERROR')||'',lastCheckAt:p.getProperty('AGCB_DEPLOY_LAST_CHECK_AT')||'',installedAt:p.getProperty('AGCB_DEPLOY_RUNNER_INSTALLED_AT')||'',deploymentId:AGCB_SD_DEPLOYMENT_ID,transport:'RAW_CONTROL_IMMUTABLE_CDN',runner:'P3.4'};
}

function agcbSdPreflight_(){
  const scriptId=ScriptApp.getScriptId();
  if(!scriptId) throw new Error('STOP: 無法取得目前 Apps Script 專案 ID。');
  const deploymentPath='/projects/'+encodeURIComponent(scriptId)+'/deployments/'+encodeURIComponent(AGCB_SD_DEPLOYMENT_ID);
  const before=agcbSdApi_('get',deploymentPath);
  if(!before||before.deploymentId!==AGCB_SD_DEPLOYMENT_ID) throw new Error('STOP: deployment ID 無法核對。');
  const previousVersion=Number(before.deploymentConfig&&before.deploymentConfig.versionNumber);
  if(!previousVersion) throw new Error('STOP: 無法核對目前部署版本。');
  const deployed=agcbSdApi_('get','/projects/'+encodeURIComponent(scriptId)+'/content?versionNumber='+previousVersion);
  agcbSdValidateDeployedBridge_(deployed.files||[]);
  const control=agcbSdFetchControl_();
  agcbSdValidateControl_(control);
  const files=control.files.map(spec=>({name:spec.name,type:spec.type,source:agcbSdPinnedFile_(spec.path,control.commitSha,control.releaseId)}));
  agcbSdValidateFiles_(files);
  return {scriptId,deploymentPath,previousVersion,control,files,status:'PREFLIGHT_PASS'};
}

function agcbSdFetchControl_(){
  const p=AGCB_SD_CONTROL_PATH.split('/').map(encodeURIComponent).join('/');
  const nonce=Date.now();
  const urls=[
    'https://raw.githubusercontent.com/'+AGCB_SD_REPO+'/dev-v0.1/'+p+'?v='+nonce,
    'https://cdn.statically.io/gh/'+AGCB_SD_REPO+'/dev-v0.1/'+p+'?v='+nonce,
    'https://cdn.jsdelivr.net/gh/'+AGCB_SD_REPO+'@dev-v0.1/'+p+'?v='+nonce
  ];
  const errors=[];
  for(const url of urls){
    try{
      const r=UrlFetchApp.fetch(url,{method:'get',headers:{'Cache-Control':'no-cache','Pragma':'no-cache','User-Agent':'AG-Cute-Blocks-Self-Deploy-P3.4'},muteHttpExceptions:true,followRedirects:true});
      const code=r.getResponseCode(),text=r.getContentText();
      if(code>=200&&code<300&&text){
        const c=JSON.parse(text);
        if(c&&c.protocol===AGCB_SD_PROTOCOL&&c.project==='AG Cute Blocks'&&String(c.environment||'').toUpperCase()==='TEST'&&c.deploymentId===AGCB_SD_DEPLOYMENT_ID) return c;
        errors.push('stale-or-invalid-control:'+url);
      }else errors.push(code+':'+text.slice(0,120));
    }catch(err){errors.push(String(err&&err.message||err).slice(0,180));}
  }
  throw new Error('STOP: 無法取得符合目前 Web App target 的最新 control。 '+errors.join(' | '));
}

function agcbSdPinnedFile_(path,ref,cacheKey){
  const p=String(path||'').split('/').map(encodeURIComponent).join('/');
  const suffix='?v='+encodeURIComponent(String(cacheKey||Date.now()));
  const urls=[
    'https://cdn.jsdelivr.net/gh/'+AGCB_SD_REPO+'@'+encodeURIComponent(ref)+'/'+p+suffix,
    'https://cdn.statically.io/gh/'+AGCB_SD_REPO+'/'+encodeURIComponent(ref)+'/'+p+suffix,
    'https://raw.githubusercontent.com/'+AGCB_SD_REPO+'/'+encodeURIComponent(ref)+'/'+p+suffix
  ];
  const errors=[];
  for(const url of urls){
    try{
      const r=UrlFetchApp.fetch(url,{method:'get',headers:{'Cache-Control':'no-cache','User-Agent':'AG-Cute-Blocks-Self-Deploy-P3.4'},muteHttpExceptions:true,followRedirects:true});
      const code=r.getResponseCode(),text=r.getContentText();
      if(code>=200&&code<300&&text) return text;
      errors.push(code+':'+text.slice(0,120));
    }catch(err){errors.push(String(err&&err.message||err).slice(0,160));}
  }
  throw new Error('STOP: immutable source unavailable '+path+' '+errors.join(' | '));
}

function agcbSdDeployFromPrepared_(p,force){
  const props=PropertiesService.getScriptProperties(),c=p.control,lastRelease=String(props.getProperty('AGCB_DEPLOY_LAST_RELEASE')||'');
  if(!force&&lastRelease===c.releaseId) return {status:'NO_CHANGE',releaseId:c.releaseId,versionNumber:p.previousVersion,deploymentId:AGCB_SD_DEPLOYMENT_ID,runner:'P3.4'};
  const existingVersion=agcbSdFindMatchingVersion_(p.scriptId,p.files);
  if(existingVersion){
    if(Number(p.previousVersion)!==Number(existingVersion)) agcbSdApi_('put',p.deploymentPath,{deploymentConfig:{scriptId:p.scriptId,versionNumber:Number(existingVersion),manifestFileName:'appsscript',description:'AG Cute Blocks TEST auto-recover '+c.releaseId}});
    agcbSdConfirmDeployment_(p.deploymentPath,Number(existingVersion));
    const deployedExisting=agcbSdApi_('get','/projects/'+encodeURIComponent(p.scriptId)+'/content?versionNumber='+Number(existingVersion));
    agcbSdValidateDeployedBridge_(deployedExisting.files||[]);
    if(!agcbSdFilesEqual_(deployedExisting.files||[],p.files)) throw new Error('STOP: recovered version content mismatch。');
    agcbSdWriteReleaseState_(props,c.releaseId,Number(existingVersion));
    return {status:'RECOVERED_EXISTING_VERSION',releaseId:c.releaseId,previousVersion:p.previousVersion,versionNumber:Number(existingVersion),deploymentId:AGCB_SD_DEPLOYMENT_ID,newVersionCreated:false,transport:'RAW_CONTROL_IMMUTABLE_CDN',runner:'P3.4',prodWriteEnabled:false,prodReadEnabled:false,restoreEnabled:false,deleteEnabled:false};
  }
  agcbSdApi_('put','/projects/'+encodeURIComponent(p.scriptId)+'/content',{files:p.files});
  const readback=agcbSdApi_('get','/projects/'+encodeURIComponent(p.scriptId)+'/content');
  agcbSdValidateFiles_(readback.files||[]);
  const ver=agcbSdApi_('post','/projects/'+encodeURIComponent(p.scriptId)+'/versions',{description:'AG Cute Blocks TEST self-deploy '+c.releaseId});
  const versionNumber=Number(ver&&ver.versionNumber);
  if(!versionNumber||versionNumber<=p.previousVersion) throw new Error('STOP: 新 Apps Script version 建立失敗。');
  agcbSdApi_('put',p.deploymentPath,{deploymentConfig:{scriptId:p.scriptId,versionNumber,manifestFileName:'appsscript',description:'AG Cute Blocks TEST auto-deploy '+c.releaseId}});
  agcbSdConfirmDeployment_(p.deploymentPath,versionNumber);
  const deployedAfter=agcbSdApi_('get','/projects/'+encodeURIComponent(p.scriptId)+'/content?versionNumber='+versionNumber);
  agcbSdValidateDeployedBridge_(deployedAfter.files||[]);
  if(!agcbSdFilesEqual_(deployedAfter.files||[],p.files)) throw new Error('STOP: deployed content 與 control 不一致。');
  agcbSdWriteReleaseState_(props,c.releaseId,versionNumber);
  return {status:'DEPLOYED',releaseId:c.releaseId,previousVersion:p.previousVersion,versionNumber,deploymentId:AGCB_SD_DEPLOYMENT_ID,newVersionCreated:true,transport:'RAW_CONTROL_IMMUTABLE_CDN',runner:'P3.4',prodWriteEnabled:false,prodReadEnabled:false,restoreEnabled:false,deleteEnabled:false};
}

function agcbSdConfirmDeployment_(deploymentPath,targetVersion){for(let i=0;i<8;i++){if(i>0)Utilities.sleep(1200);const a=agcbSdApi_('get',deploymentPath);if(a&&a.deploymentId===AGCB_SD_DEPLOYMENT_ID&&Number(a.deploymentConfig&&a.deploymentConfig.versionNumber)===Number(targetVersion))return a;}throw new Error('STOP: deployment 更新後多次反讀仍未指向 target version。');}
function agcbSdWriteReleaseState_(props,releaseId,versionNumber){const now=new Date().toISOString();props.setProperties({AGCB_DEPLOY_LAST_RELEASE:String(releaseId),AGCB_DEPLOY_LAST_VERSION:String(versionNumber),AGCB_DEPLOY_LAST_ERROR:'',AGCB_DEPLOY_LAST_DEPLOYED_AT:now,AGCB_DEPLOY_LAST_CHECK_AT:now,AGCB_DEPLOY_RUNNER_STATUS:'READY'},false);}
function agcbSdListVersions_(scriptId){let rows=[],pageToken='';for(let page=0;page<10;page++){const suffix='?pageSize=200'+(pageToken?'&pageToken='+encodeURIComponent(pageToken):'');const res=agcbSdApi_('get','/projects/'+encodeURIComponent(scriptId)+'/versions'+suffix);rows=rows.concat((res&&res.versions)||[]);pageToken=String(res&&res.nextPageToken||'');if(!pageToken)break;}return rows;}
function agcbSdFindMatchingVersion_(scriptId,targetFiles){const rows=agcbSdListVersions_(scriptId).sort((a,b)=>Number(b.versionNumber||0)-Number(a.versionNumber||0));for(const row of rows){const n=Number(row.versionNumber||0);if(!n)continue;const content=agcbSdApi_('get','/projects/'+encodeURIComponent(scriptId)+'/content?versionNumber='+n);if(agcbSdFilesEqual_(content.files||[],targetFiles))return n;}return 0;}
function agcbSdFilesEqual_(actualFiles,targetFiles){const actual=new Map((actualFiles||[]).map(f=>[String(f.name)+'|'+String(f.type),String(f.source||'')]));for(const t of(targetFiles||[])){const key=String(t.name)+'|'+String(t.type);if(!actual.has(key)||actual.get(key)!==String(t.source||''))return false;}return true;}
function agcbSdValidateDeployedBridge_(files){const text=(files||[]).filter(f=>f.type==='SERVER_JS').map(f=>String(f.source||'')).join('\n');if(!text.includes("const AGCB_PROJECT='AG Cute Blocks'")||!text.includes('function doGet'))throw new Error('STOP: immutable deployment 不是 AG Cute Blocks Bridge。');if(!text.includes('AGCB_PROD_WRITE_ENABLED=false'))throw new Error('STOP: deployed Bridge 未鎖定 PROD write=false。');if(!text.includes("env!=='TEST'"))throw new Error('STOP: deployed Bridge 缺少 TEST-only 環境限制。');if(!text.includes('prodReadEnabled:false')||!text.includes('restoreEnabled:false')||!text.includes('deleteEnabled:false'))throw new Error('STOP: deployed Bridge 安全旗標缺失。');}
function agcbSdValidateFiles_(files){const bridge=files.find(f=>f.type==='SERVER_JS'&&String(f.source||'').includes("const AGCB_PROJECT='AG Cute Blocks'")&&String(f.source||'').includes('function doGet'));const runner=files.find(f=>f.type==='SERVER_JS'&&String(f.source||'').includes('function agcbDeployRunnerPoll'));const manifest=files.find(f=>f.name==='appsscript'&&f.type==='JSON');if(!bridge||!runner||!manifest)throw new Error('STOP: 控制來源缺少 Bridge／Runner／manifest。');if(!bridge.source.includes('AGCB_PROD_WRITE_ENABLED=false')||!bridge.source.includes("env!=='TEST'"))throw new Error('STOP: Bridge TEST-only 安全標記缺失。');const m=JSON.parse(manifest.source),scopes=m.oauthScopes||[];for(const s of['https://www.googleapis.com/auth/script.projects','https://www.googleapis.com/auth/script.deployments','https://www.googleapis.com/auth/script.scriptapp'])if(!scopes.includes(s))throw new Error('STOP: manifest 缺少自部署權限 '+s);if(!m.webapp||m.webapp.access!=='ANYONE_ANONYMOUS'||m.webapp.executeAs!=='USER_DEPLOYING')throw new Error('STOP: manifest Web App 安全設定缺失。');}
function agcbSdValidateControl_(c){if(!c||c.protocol!==AGCB_SD_PROTOCOL||c.enabled!==true||c.project!=='AG Cute Blocks'||String(c.environment||'').toUpperCase()!=='TEST'||c.deploymentId!==AGCB_SD_DEPLOYMENT_ID)throw new Error('STOP: self-deploy control 無效或 target 不符。');if(!/^[0-9a-f]{40}$/i.test(String(c.commitSha||''))||!c.releaseId||!Array.isArray(c.files)||c.files.length<3)throw new Error('STOP: self-deploy control 內容不完整。');}
function agcbSdApi_(method,path,body){const opt={method,headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken(),Accept:'application/json'},muteHttpExceptions:true};if(body!==undefined){opt.contentType='application/json; charset=utf-8';opt.payload=JSON.stringify(body);}const r=UrlFetchApp.fetch(AGCB_SD_API+path,opt),code=r.getResponseCode(),text=r.getContentText();if(code<200||code>=300)throw new Error('STOP: Apps Script API '+String(method).toUpperCase()+' '+code+' '+text.slice(0,900));return text?JSON.parse(text):null;}
