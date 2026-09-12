/**
 * AG Cute Blocks — Apps Script one-time self-deploy bootstrap + persistent runner P1.
 * Future TEST bridge updates are pulled from GitHub and deployed to the SAME web-app deployment.
 * PROD save access remains disabled.
 */
const AGCB_SD_API='https://script.googleapis.com/v1';
const AGCB_SD_DEPLOYMENT_ID='AKfycbzjMLAn2QK71ges3KNXIvVyrVrGqNA9aRJdM04vIAyfXCdlkW4XXNrk22fU1iSVMBQC';
const AGCB_SD_EXEC_URL='https://script.google.com/macros/s/AKfycbzjMLAn2QK71ges3KNXIvVyrVrGqNA9aRJdM04vIAyfXCdlkW4XXNrk22fU1iSVMBQC/exec';
const AGCB_SD_CONTROL_URL='https://raw.githubusercontent.com/honbin002-design/-ag-cute-blocks/dev-v0.1/apps-script/agcb-self-deploy-control.json';
const AGCB_SD_PROTOCOL='AGCB_APPS_SCRIPT_SELF_DEPLOY_CONTROL_V1';

function AGCB_SELF_DEPLOY_BOOTSTRAP_ONCE(){
  const result=agcbSdDeployFromControl_(true);
  if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='agcbDeployRunnerPoll')){
    ScriptApp.newTrigger('agcbDeployRunnerPoll').timeBased().everyMinutes(5).create();
  }
  PropertiesService.getScriptProperties().setProperties({
    AGCB_DEPLOY_RUNNER_STATUS:'READY',
    AGCB_DEPLOY_LAST_ERROR:'',
    AGCB_DEPLOY_RUNNER_INSTALLED_AT:new Date().toISOString(),
    AGCB_DEPLOY_CONTROL_URL:AGCB_SD_CONTROL_URL
  },false);
  return Object.assign({runnerInstalled:true,pollMinutes:5},result);
}

function agcbDeployRunnerPoll(){
  try{
    const r=agcbSdDeployFromControl_(false);
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
    deploymentId:AGCB_SD_DEPLOYMENT_ID
  };
}

function agcbSdDeployFromControl_(force){
  const scriptId=ScriptApp.getScriptId();
  if(!scriptId)throw new Error('STOP: 無法取得目前 Apps Script 專案 ID。');
  const health=agcbSdFetchJson_(AGCB_SD_EXEC_URL+'?selfDeployProbe='+Date.now());
  if(!health||health.ok!==true||health.project!=='AG Cute Blocks'||health.status!=='TEST_BRIDGE_READY')throw new Error('STOP: 目前 /exec 不是 AG Cute Blocks TEST Bridge。');
  if(health.prodWriteEnabled!==false||health.prodReadEnabled!==false||health.restoreEnabled!==false||health.deleteEnabled!==false)throw new Error('STOP: Bridge 安全旗標不符合 TEST-only 規則。');

  const deploymentPath='/projects/'+encodeURIComponent(scriptId)+'/deployments/'+encodeURIComponent(AGCB_SD_DEPLOYMENT_ID);
  const before=agcbSdApi_('get',deploymentPath);
  if(!before||before.deploymentId!==AGCB_SD_DEPLOYMENT_ID)throw new Error('STOP: 指定 TEST deployment ID 無法核對。');
  const previousVersion=Number(before.deploymentConfig&&before.deploymentConfig.versionNumber);
  if(!previousVersion)throw new Error('STOP: 無法核對目前部署版本。');

  const c=agcbSdFetchJson_(AGCB_SD_CONTROL_URL+'?t='+Date.now());
  agcbSdValidateControl_(c);
  const props=PropertiesService.getScriptProperties();
  if(!force&&String(props.getProperty('AGCB_DEPLOY_LAST_RELEASE')||'')===c.releaseId)return{status:'NO_CHANGE',releaseId:c.releaseId,versionNumber:previousVersion,deploymentId:AGCB_SD_DEPLOYMENT_ID};

  const base='https://raw.githubusercontent.com/honbin002-design/-ag-cute-blocks/'+c.commitSha+'/';
  const files=c.files.map(spec=>({name:spec.name,type:spec.type,source:agcbSdFetchText_(base+spec.path+'?t='+Date.now())}));
  const bridge=files.find(f=>f.type==='SERVER_JS'&&f.source.includes("const AGCB_PROJECT='AG Cute Blocks'")&&f.source.includes('function doGet'));
  const runner=files.find(f=>f.type==='SERVER_JS'&&f.source.includes('function agcbDeployRunnerPoll'));
  const manifest=files.find(f=>f.name==='appsscript'&&f.type==='JSON');
  if(!bridge||!runner||!manifest)throw new Error('STOP: 控制來源缺少 Bridge／Runner／manifest。');
  if(!bridge.source.includes('AGCB_PROD_WRITE_ENABLED=false')||!bridge.source.includes("env!=='TEST'"))throw new Error('STOP: Bridge TEST-only 安全標記缺失。');
  const mj=JSON.parse(manifest.source);
  const scopes=mj.oauthScopes||[];
  if(!scopes.includes('https://www.googleapis.com/auth/script.projects')||!scopes.includes('https://www.googleapis.com/auth/script.deployments'))throw new Error('STOP: manifest 缺少自部署 OAuth scope。');

  agcbSdApi_('put','/projects/'+encodeURIComponent(scriptId)+'/content',{files:files});
  const readback=agcbSdApi_('get','/projects/'+encodeURIComponent(scriptId)+'/content');
  const names=new Set((readback.files||[]).map(f=>f.name+':'+f.type));
  for(const f of files)if(!names.has(f.name+':'+f.type))throw new Error('STOP: HEAD 反讀缺少 '+f.name);

  const ver=agcbSdApi_('post','/projects/'+encodeURIComponent(scriptId)+'/versions',{description:'AG Cute Blocks TEST self-deploy '+c.releaseId});
  const versionNumber=Number(ver&&ver.versionNumber);
  if(!versionNumber||versionNumber<=previousVersion)throw new Error('STOP: 新 Apps Script version 建立失敗。');
  agcbSdApi_('put',deploymentPath,{deploymentConfig:{scriptId:scriptId,versionNumber:versionNumber,manifestFileName:'appsscript',description:'AG Cute Blocks TEST auto-deploy '+c.releaseId}});
  const after=agcbSdApi_('get',deploymentPath);
  if(!after||after.deploymentId!==AGCB_SD_DEPLOYMENT_ID||Number(after.deploymentConfig&&after.deploymentConfig.versionNumber)!==versionNumber)throw new Error('STOP: deployment 更新後反讀失敗。');
  props.setProperties({AGCB_DEPLOY_LAST_RELEASE:c.releaseId,AGCB_DEPLOY_LAST_VERSION:String(versionNumber),AGCB_DEPLOY_LAST_ERROR:'',AGCB_DEPLOY_LAST_DEPLOYED_AT:new Date().toISOString()},false);
  return{status:'DEPLOYED',releaseId:c.releaseId,previousVersion:previousVersion,versionNumber:versionNumber,deploymentId:AGCB_SD_DEPLOYMENT_ID,prodWriteEnabled:false,prodReadEnabled:false,restoreEnabled:false,deleteEnabled:false};
}

function agcbSdValidateControl_(c){
  if(!c||c.protocol!==AGCB_SD_PROTOCOL||c.enabled!==true)throw new Error('STOP: self-deploy control 無效。');
  if(c.project!=='AG Cute Blocks'||String(c.environment||'').toUpperCase()!=='TEST'||c.deploymentId!==AGCB_SD_DEPLOYMENT_ID)throw new Error('STOP: self-deploy control target 不符。');
  if(!/^[0-9a-f]{40}$/i.test(String(c.commitSha||''))||!c.releaseId||!Array.isArray(c.files)||c.files.length<3)throw new Error('STOP: self-deploy control 內容不完整。');
  const seen=new Set();
  for(const f of c.files){if(!f||!f.name||!['SERVER_JS','HTML','JSON'].includes(f.type)||!/^[A-Za-z0-9._/-]+$/.test(String(f.path||''))||String(f.path).includes('..'))throw new Error('STOP: control source 規格不合法。');if(seen.has(f.name))throw new Error('STOP: control source 名稱重複。');seen.add(f.name);}
}
function agcbSdApi_(method,path,body){const opt={method:method,headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken(),Accept:'application/json'},muteHttpExceptions:true};if(body!==undefined){opt.contentType='application/json; charset=utf-8';opt.payload=JSON.stringify(body);}const r=UrlFetchApp.fetch(AGCB_SD_API+path,opt),code=r.getResponseCode(),text=r.getContentText();if(code<200||code>=300)throw new Error('STOP: Apps Script API '+method.toUpperCase()+' '+code+' '+text.slice(0,900));return text?JSON.parse(text):null;}
function agcbSdFetchJson_(url){return JSON.parse(agcbSdFetchText_(url));}
function agcbSdFetchText_(url){const r=UrlFetchApp.fetch(url,{method:'get',muteHttpExceptions:true,followRedirects:true});const code=r.getResponseCode(),text=r.getContentText();if(code<200||code>=300)throw new Error('STOP: 遠端來源讀取失敗 '+code+' '+text.slice(0,500));return text;}
