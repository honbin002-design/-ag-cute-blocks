// AG Cute Blocks V0.6.00 — strict PROD/TEST save isolation + backward-compatible save policy.
// PROD can only read PROD saves; TEST can only read TEST saves.
// Promotion compatibility is one-way at the CODE level: a newer promoted build must keep reading supported older PROD save schemas.
const VERSION='0.6.00';
const PROJECT='AG Cute Blocks';
const CURRENT_SAVE_SCHEMA=1;
const MIN_READABLE_SAVE_SCHEMA=1;
const ENVIRONMENTS=new Set(['PROD','TEST']);

function normalizeEnvironment(value){
  const env=String(value||'').trim().toUpperCase();
  if(!ENVIRONMENTS.has(env))throw new Error('invalid-save-environment');
  return env;
}
function assertSameEnvironment({runtimeEnvironment,saveEnvironment}={}){
  const runtime=normalizeEnvironment(runtimeEnvironment);
  const saved=normalizeEnvironment(saveEnvironment);
  if(runtime!==saved)throw new Error(runtime==='PROD'?'prod-cannot-read-test-save':'test-cannot-read-prod-save');
  return true;
}
function normalizeSchema(value){
  const n=Number(value);
  if(!Number.isInteger(n)||n<1)throw new Error('invalid-save-schema');
  return n;
}
function canReadSchema(schema){
  const n=normalizeSchema(schema);
  return n>=MIN_READABLE_SAVE_SCHEMA&&n<=CURRENT_SAVE_SCHEMA;
}
function assertReadableSchema(schema){
  const n=normalizeSchema(schema);
  if(n>CURRENT_SAVE_SCHEMA)throw new Error('save-schema-newer-than-runtime');
  if(n<MIN_READABLE_SAVE_SCHEMA)throw new Error('save-schema-too-old');
  return true;
}
function validateSaveForRuntime({runtimeEnvironment,envelope}={}){
  if(!envelope||envelope.project!==PROJECT)throw new Error('invalid-save-envelope');
  assertSameEnvironment({runtimeEnvironment,saveEnvironment:envelope.environment});
  assertReadableSchema(envelope.schema);
  return {ok:true,environment:normalizeEnvironment(runtimeEnvironment),schema:Number(envelope.schema)};
}
function validatePromotionCompatibility({fromSaveSchema,toReadableMin=MIN_READABLE_SAVE_SCHEMA,toReadableMax=CURRENT_SAVE_SCHEMA}={}){
  const source=normalizeSchema(fromSaveSchema);
  const min=normalizeSchema(toReadableMin);
  const max=normalizeSchema(toReadableMax);
  if(min>max)return{ok:false,reason:'invalid-compatible-schema-range'};
  if(source<min||source>max)return{ok:false,reason:'promotion-would-break-existing-prod-save',sourceSchema:source,readableRange:[min,max]};
  return{ok:true,sourceSchema:source,readableRange:[min,max]};
}

globalThis.__AGCB_SAVE_ENVIRONMENT_COMPAT={
  version:VERSION,
  status:'STRICT_ENV_ISOLATION_BACKWARD_COMPATIBLE',
  project:PROJECT,
  currentSaveSchema:CURRENT_SAVE_SCHEMA,
  minReadableSaveSchema:MIN_READABLE_SAVE_SCHEMA,
  normalizeEnvironment,
  assertSameEnvironment,
  canReadSchema,
  assertReadableSchema,
  validateSaveForRuntime,
  validatePromotionCompatibility
};
