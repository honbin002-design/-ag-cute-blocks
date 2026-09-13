/**
 * AG Cute Blocks — Apps Script self-deploy recovery P3.1
 * TEST only. Recovery does NOT create a new Apps Script version.
 * It finds the already-created version that exactly matches the current
 * self-deploy control package, repairs the existing deployment pointer,
 * writes runner state, and installs one 5-minute poll trigger.
 */

function AGCB_SELF_DEPLOY_RECOVER_ONCE(){
  const scriptId=ScriptApp.getScriptId();
  if(!scriptId) throw new Error('STOP: 無法取得目前 Apps Script 專案 ID。');

  const control=JSON.parse(agcbSdCdnFile_(AGCB_SD_CONTROL_PATH,'dev-v0.1','recovery-control-'+Date.now()));
  agcbSdValidateControl_(control);

  const targetFiles=control.files.map(spec=>({
    name:spec.name,
    type:spec.type,
    source:agcbSdCdnFile_(spec.path,control.commitSha,control.releaseId)
  }));
  agcbSdValidateFiles_(targetFiles);

  const deploymentPath='/projects/'+encodeURIComponent(scriptId)+'/deployments/'+encodeURIComponent(AGCB_SD_DEPLOYMENT_ID);
  const before=agcbSdApi_('get',deploymentPath);
  if(!before||before.deploymentId!==AGCB_SD_DEPLOYMENT_ID) throw new Error('STOP: 指定 TEST deployment ID 無法核對。');
  const previousVersion=Number(before.deploymentConfig&&before.deploymentConfig.versionNumber)||0;

  const versions=agcbRecoveryListVersions_(scriptId);
  if(!versions.length) throw new Error('STOP: 找不到任何 Apps Script version。');

  let targetVersion=0;
  for(const row of versions.sort((a,b)=>Number(b.versionNumber||0)-Number(a.versionNumber||0))){
    const n=Number(row.versionNumber||0);
    if(!n) continue;
    const versionContent=agcbSdApi_('get','/projects/'+encodeURIComponent(scriptId)+'/content?versionNumber='+n);
    if(agcbRecoveryFilesEqual_(versionContent.files||[],targetFiles)){
      targetVersion=n;
      break;
    }
  }
  if(!targetVersion) throw new Error('STOP: 找不到已建立且與目前 P3 control 完全一致的 version；Recovery 不會建立新 version。');

  if(previousVersion!==targetVersion){
    agcbSdApi_('put',deploymentPath,{deploymentConfig:{
      scriptId:scriptId,
      versionNumber:targetVersion,
      manifestFileName:'appsscript',
      description:'AG Cute Blocks TEST recovery '+control.releaseId
    }});
  }

  let confirmed=null;
  for(let i=0;i<8;i++){
    if(i>0) Utilities.sleep(1200);
    const probe=agcbSdApi_('get',deploymentPath);
    const n=Number(probe&&probe.deploymentConfig&&probe.deploymentConfig.versionNumber)||0;
    if(probe&&probe.deploymentId===AGCB_SD_DEPLOYMENT_ID&&n===targetVersion){
      confirmed=probe;
      break;
    }
  }
  if(!confirmed) throw new Error('STOP: deployment 更新後多次反讀仍未指向既有 P3 version。');

  const deployed=agcbSdApi_('get','/projects/'+encodeURIComponent(scriptId)+'/content?versionNumber='+targetVersion);
  agcbSdValidateDeployedBridge_(deployed.files||[]);
  if(!agcbRecoveryFilesEqual_(deployed.files||[],targetFiles)) throw new Error('STOP: deployed content 與目前 P3 control 不一致。');

  const props=PropertiesService.getScriptProperties();
  const now=new Date().toISOString();
  const values={
    AGCB_DEPLOY_LAST_RELEASE:control.releaseId,
    AGCB_DEPLOY_LAST_VERSION:String(targetVersion),
    AGCB_DEPLOY_LAST_ERROR:'',
    AGCB_DEPLOY_LAST_DEPLOYED_AT:now,
    AGCB_DEPLOY_LAST_CHECK_AT:now,
    AGCB_DEPLOY_RUNNER_STATUS:'READY'
  };
  if(!props.getProperty('AGCB_DEPLOY_RUNNER_INSTALLED_AT')) values.AGCB_DEPLOY_RUNNER_INSTALLED_AT=now;
  props.setProperties(values,false);

  const triggers=ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='agcbDeployRunnerPoll');
  if(triggers.length===0){
    ScriptApp.newTrigger('agcbDeployRunnerPoll').timeBased().everyMinutes(AGCB_SD_POLL_MINUTES).create();
  }else if(triggers.length>1){
    for(let i=1;i<triggers.length;i++) ScriptApp.deleteTrigger(triggers[i]);
  }

  const result={
    status:'RECOVERED',
    releaseId:control.releaseId,
    previousVersion:previousVersion,
    versionNumber:targetVersion,
    deploymentId:AGCB_SD_DEPLOYMENT_ID,
    newVersionCreated:false,
    triggerCount:1,
    pollMinutes:AGCB_SD_POLL_MINUTES,
    transport:'CDN_PINNED',
    prodWriteEnabled:false,
    prodReadEnabled:false,
    restoreEnabled:false,
    deleteEnabled:false
  };
  console.log(JSON.stringify(result));
  return result;
}

function agcbRecoveryListVersions_(scriptId){
  let rows=[];
  let pageToken='';
  for(let page=0;page<10;page++){
    const suffix='?pageSize=200'+(pageToken?'&pageToken='+encodeURIComponent(pageToken):'');
    const res=agcbSdApi_('get','/projects/'+encodeURIComponent(scriptId)+'/versions'+suffix);
    rows=rows.concat((res&&res.versions)||[]);
    pageToken=String(res&&res.nextPageToken||'');
    if(!pageToken) break;
  }
  return rows;
}

function agcbRecoveryFilesEqual_(actualFiles,targetFiles){
  const actual=new Map((actualFiles||[]).map(f=>[String(f.name)+'|'+String(f.type),String(f.source||'')]));
  for(const t of (targetFiles||[])){
    const key=String(t.name)+'|'+String(t.type);
    if(!actual.has(key)||actual.get(key)!==String(t.source||'')) return false;
  }
  return true;
}
