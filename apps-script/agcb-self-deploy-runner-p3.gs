/**
 * AG Cute Blocks — Apps Script self-deploy runner P3
 * TEST only. Same Apps Script project/deployment.
 * Source transport uses public CDN URLs (jsDelivr primary, Statically fallback)
 * so the runner is not blocked by unauthenticated GitHub REST API rate limits.
 */
const AGCB_SD_API='https://script.googleapis.com/v1';
const AGCB_SD_DEPLOYMENT_ID='AKfycbzjMLAn2QK71ges3KNXIvVyrVrGqNA9aRJdM04vIAyfXCdlkW4XXNrk22fU1iSVMBQC';
const AGCB_SD_REPO='honbin002-design/-ag-cute-blocks';
const AGCB_SD_CONTROL_PATH='apps-script/agcb-self-deploy-control.json';
const AGCB_SD_PROTOCOL='AGCB_APPS_SCRIPT_SELF_DEPLOY_CONTROL_V1';
const AGCB_SD_POLL_MINUTES=5;

function AGCB_SELF_DEPLOY_PREFLIGHT(){
  const s=agcbSdPreflight_();
  PropertiesService.getScriptProperties().setProperties({
    AGCB_DEPLOY_RUNNER_STATUS:'PREFLIGHT_PASS',
    AGCB_DEPLOY_LAST_ERROR:'',
    AGCB_DEPLOY_LAST_CHECK_AT:new Date().toISOString()
  },false);
  return {
    status:s.status,
    previousVersion:s.previousVersion,
    releaseId:s.control.releaseId,
    deploymentId:AGCB_SD_DEPLOYMENT_ID,
    transport:'CDN_PINNED',
    prodWriteEnabled:false,
    prodReadEnabled:false,
    restoreEnabled:false,
    deleteEnabled:false
  };
}

function AGCB_SELF_DEPLOY_BOOTSTRAP_ONCE(){
  const p=agcbSdPreflight_();
  const r=agcbSdDeployFromPrepared_(p,true);
  if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='agcbDeployRunnerPoll')){
    ScriptApp.newTrigger('agcbDeployRunnerPoll').timeBased().everyMinutes(AGCB_SD_POLL_MINUTES).create();
  }
  PropertiesService.getScriptProperties().setProperties({
    AGCB_DEPLOY_RUNNER_STATUS:'READY',
    AGCB_DEPLOY_LAST_ERROR:'',
    AGCB_DEPLOY_RUNNER_INSTALLED_AT:new Date().toISOString()
  },false);
  return Object.assign({runnerInstalled:true,pollMinutes:AGCB_SD_POLL_MINUTES,transport:'CDN_PINNED'},r);
}

function agcbDeployRunnerPoll(){
  try{
    const p=agcbSdPreflight_();
    const r=agcbSdDeployFromPrepared_(p,false);
    PropertiesService.getScriptProperties().setProperties({
      AGCB_DEPLOY_RUNNER_STATUS:r.status||'READY',
      AGCB_DEPLOY_LAST_ERROR:'',
      AGCB_DEPLOY_LAST_CHECK_AT:new Date().toISOString()
    },false);
    return r;
  }catch(err){
    PropertiesService.getScriptProperties().setProperties({
      AGCB_DEPLOY_RUNNER_STATUS:'ERROR',
      AGCB_DEPLOY_LAST_ERROR:String(err&&err.message||err).slice(0,1500),
      AGCB_DEPLOY_LAST_CHECK_AT:new Date().toISOString()
    },false);
    throw err;
  }
}

function agcbDeployRunnerStatus(){
  const p=PropertiesService.getScriptProperties();
  return {
    status:p.getProperty('AGCB_DEPLOY_RUNNER_STATUS')||'NOT_INSTALLED',
    lastRelease:p.getProperty('AGCB_DEPLOY_LAST_RELEASE')||'',
    lastVersion:Number(p.getProperty('AGCB_DEPLOY_LAST_VERSION')||0),
    lastError:p.getProperty('AGCB_DEPLOY_LAST_ERROR')||'',
    lastCheckAt:p.getProperty('AGCB_DEPLOY_LAST_CHECK_AT')||'',
    installedAt:p.getProperty('AGCB_DEPLOY_RUNNER_INSTALLED_AT')||'',
    deploymentId:AGCB_SD_DEPLOYMENT_ID,
    transport:'CDN_PINNED'
  };
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

  const control=JSON.parse(agcbSdCdnFile_(AGCB_SD_CONTROL_PATH,'dev-v0.1','control'));
  agcbSdValidateControl_(control);

  const files=control.files.map(spec=>({
    name:spec.name,
    type:spec.type,
    source:agcbSdCdnFile_(spec.path,control.commitSha,control.releaseId)
  }));
  agcbSdValidateFiles_(files);
  return {scriptId,deploymentPath,previousVersion,control,files,status:'PREFLIGHT_PASS'};
}

function agcbSdDeployFromPrepared_(p,force){
  const props=PropertiesService.getScriptProperties(), c=p.control;
  if(!force&&String(props.getProperty('AGCB_DEPLOY_LAST_RELEASE')||'')===c.releaseId){
    return {status:'NO_CHANGE',releaseId:c.releaseId,versionNumber:p.previousVersion,deploymentId:AGCB_SD_DEPLOYMENT_ID};
  }

  agcbSdApi_('put','/projects/'+encodeURIComponent(p.scriptId)+'/content',{files:p.files});
  const readback=agcbSdApi_('get','/projects/'+encodeURIComponent(p.scriptId)+'/content');
  agcbSdValidateFiles_(readback.files||[]);

  const ver=agcbSdApi_('post','/projects/'+encodeURIComponent(p.scriptId)+'/versions',{description:'AG Cute Blocks TEST self-deploy '+c.releaseId});
  const versionNumber=Number(ver&&ver.versionNumber);
  if(!versionNumber||versionNumber<=p.previousVersion) throw new Error('STOP: 新 Apps Script version 建立失敗。');

  agcbSdApi_('put',p.deploymentPath,{deploymentConfig:{
    scriptId:p.scriptId,
    versionNumber:versionNumber,
    manifestFileName:'appsscript',
    description:'AG Cute Blocks TEST auto-deploy '+c.releaseId
  }});

  const after=agcbSdApi_('get',p.deploymentPath);
  if(!after||after.deploymentId!==AGCB_SD_DEPLOYMENT_ID||Number(after.deploymentConfig&&after.deploymentConfig.versionNumber)!==versionNumber){
    throw new Error('STOP: deployment 更新後反讀失敗。');
  }

  const deployedAfter=agcbSdApi_('get','/projects/'+encodeURIComponent(p.scriptId)+'/content?versionNumber='+versionNumber);
  agcbSdValidateDeployedBridge_(deployedAfter.files||[]);

  props.setProperties({
    AGCB_DEPLOY_LAST_RELEASE:c.releaseId,
    AGCB_DEPLOY_LAST_VERSION:String(versionNumber),
    AGCB_DEPLOY_LAST_ERROR:'',
    AGCB_DEPLOY_LAST_DEPLOYED_AT:new Date().toISOString()
  },false);
  return {
    status:'DEPLOYED',releaseId:c.releaseId,previousVersion:p.previousVersion,versionNumber:versionNumber,
    deploymentId:AGCB_SD_DEPLOYMENT_ID,transport:'CDN_PINNED',
    prodWriteEnabled:false,prodReadEnabled:false,restoreEnabled:false,deleteEnabled:false
  };
}

function agcbSdValidateDeployedBridge_(files){
  const text=(files||[]).filter(f=>f.type==='SERVER_JS').map(f=>String(f.source||'')).join('\n');
  if(!text.includes("const AGCB_PROJECT='AG Cute Blocks'")||!text.includes('function doGet')) throw new Error('STOP: immutable deployment 不是 AG Cute Blocks Bridge。');
  if(!text.includes('AGCB_PROD_WRITE_ENABLED=false')) throw new Error('STOP: deployed Bridge 未鎖定 PROD write=false。');
  if(!text.includes("env!=='TEST'")) throw new Error('STOP: deployed Bridge 缺少 TEST-only 環境限制。');
  if(!text.includes('prodReadEnabled:false')||!text.includes('restoreEnabled:false')||!text.includes('deleteEnabled:false')) throw new Error('STOP: deployed Bridge 安全旗標缺失。');
}

function agcbSdValidateFiles_(files){
  const bridge=files.find(f=>f.type==='SERVER_JS'&&String(f.source||'').includes("const AGCB_PROJECT='AG Cute Blocks'")&&String(f.source||'').includes('function doGet'));
  const runner=files.find(f=>f.type==='SERVER_JS'&&String(f.source||'').includes('function agcbDeployRunnerPoll'));
  const manifest=files.find(f=>f.name==='appsscript'&&f.type==='JSON');
  if(!bridge||!runner||!manifest) throw new Error('STOP: 控制來源缺少 Bridge／Runner／manifest。');
  if(!bridge.source.includes('AGCB_PROD_WRITE_ENABLED=false')||!bridge.source.includes("env!=='TEST'")) throw new Error('STOP: Bridge TEST-only 安全標記缺失。');
  const scopes=(JSON.parse(manifest.source).oauthScopes||[]);
  for(const s of [
    'https://www.googleapis.com/auth/script.projects',
    'https://www.googleapis.com/auth/script.deployments',
    'https://www.googleapis.com/auth/script.scriptapp'
  ]) if(!scopes.includes(s)) throw new Error('STOP: manifest 缺少自部署權限 '+s);
}

function agcbSdValidateControl_(c){
  if(!c||c.protocol!==AGCB_SD_PROTOCOL||c.enabled!==true||c.project!=='AG Cute Blocks'||String(c.environment||'').toUpperCase()!=='TEST'||c.deploymentId!==AGCB_SD_DEPLOYMENT_ID){
    throw new Error('STOP: self-deploy control 無效或 target 不符。');
  }
  if(!/^[0-9a-f]{40}$/i.test(String(c.commitSha||''))||!c.releaseId||!Array.isArray(c.files)||c.files.length<3){
    throw new Error('STOP: self-deploy control 內容不完整。');
  }
}

function agcbSdCdnFile_(path,ref,cacheKey){
  const encodedPath=String(path||'').split('/').map(encodeURIComponent).join('/');
  const suffix='?v='+encodeURIComponent(String(cacheKey||Date.now()));
  const urls=[
    'https://cdn.jsdelivr.net/gh/'+AGCB_SD_REPO+'@'+encodeURIComponent(ref)+'/'+encodedPath+suffix,
    'https://cdn.statically.io/gh/'+AGCB_SD_REPO+'/'+encodeURIComponent(ref)+'/'+encodedPath+suffix
  ];
  const errors=[];
  for(const url of urls){
    try{
      const r=UrlFetchApp.fetch(url,{method:'get',headers:{'Cache-Control':'no-cache','User-Agent':'AG-Cute-Blocks-Self-Deploy-P3'},muteHttpExceptions:true,followRedirects:true});
      const code=r.getResponseCode(),text=r.getContentText();
      if(code>=200&&code<300&&text) return text;
      errors.push(code+':'+text.slice(0,120));
    }catch(err){errors.push(String(err&&err.message||err).slice(0,160));}
  }
  throw new Error('STOP: CDN source unavailable '+path+' '+errors.join(' | '));
}

function agcbSdApi_(method,path,body){
  const opt={method:method,headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken(),Accept:'application/json'},muteHttpExceptions:true};
  if(body!==undefined){opt.contentType='application/json; charset=utf-8';opt.payload=JSON.stringify(body);}
  const r=UrlFetchApp.fetch(AGCB_SD_API+path,opt),code=r.getResponseCode(),text=r.getContentText();
  if(code<200||code>=300) throw new Error('STOP: Apps Script API '+String(method).toUpperCase()+' '+code+' '+text.slice(0,900));
  return text?JSON.parse(text):null;
}
