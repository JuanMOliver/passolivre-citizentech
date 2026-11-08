import AsyncStorage from '@react-native-async-storage/async-storage';

export const cfg = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || '',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};
export const mode = cfg.apiUrl ? 'api' : cfg.supabaseUrl && cfg.supabaseAnonKey ? 'supabase' : 'demo';
export const categories = ['Buraco','Degrau','Calçada obstruída','Rampa ausente','Piso irregular','Outro'];
const ownKey='pl-mobile-own-v1', pendingKey='pl-mobile-pending-v1', supportedKey='pl-mobile-supported-v1';
const visitorKey='pl-mobile-visitor-v1', cacheKey='pl-mobile-cache-v1', demoKey='pl-mobile-reports-v1';
const examples=[
 {id:'demo-1',title:'Rampa ausente (EXEMPLO)',category:'Rampa ausente',description:'Registro fictício, utilizado somente para demonstração.',address:'Rua Exemplo, 800',neighborhood:'Liberdade',status:'recebido',supports_count:0,created_at:'2026-11-07T10:00:00Z',example:true},
 {id:'demo-2',title:'Piso irregular (EXEMPLO)',category:'Piso irregular',description:'Registro fictício, utilizado somente para demonstração.',address:'Av. Exemplo, 1200',neighborhood:'Bela Vista',status:'recebido',supports_count:0,created_at:'2026-11-07T09:00:00Z',example:true}
];
const read=async(k,f)=>{try{const x=await AsyncStorage.getItem(k);return x?JSON.parse(x):f;}catch{return f;}};
const write=(k,v)=>AsyncStorage.setItem(k,JSON.stringify(v));
export const getOwnIds=()=>read(ownKey,[]);
export const getPending=()=>read(pendingKey,[]);
export const getSupported=()=>read(supportedKey,[]);
async function getVisitor(){let id=await AsyncStorage.getItem(visitorKey);if(!id){id='app-'+Date.now()+'-'+Math.random().toString(36).slice(2);await AsyncStorage.setItem(visitorKey,id)}return id;}
function headers(){const key=cfg.supabaseAnonKey;return {apikey:key,'Content-Type':'application/json',...(key.startsWith('sb_publishable_')?{}:{Authorization:'Bearer '+key})};}
async function request(path,opts){const response=await fetch(cfg.apiUrl.replace(/\/$/,'')+path,opts);if(!response.ok)throw Error('HTTP '+response.status);return response.json();}
export async function fetchReports(){
 if(mode==='demo')return read(demoKey,examples);
 if(mode==='api')return request('/api/reports');
 const r=await fetch(cfg.supabaseUrl+'/rest/v1/reports?select=id,title,category,description,address,neighborhood,latitude,longitude,status,supports_count,created_at&order=created_at.desc&limit=300',{headers:headers()});
 if(!r.ok)throw Error('Não foi possível consultar relatos (HTTP '+r.status+').');
 return r.json();
}
async function postReport(payload){
 if(mode==='demo'){
  const r={...payload,id:'demo-'+Date.now()+'-'+Math.random().toString(36).slice(2),status:'recebido',supports_count:0,created_at:new Date().toISOString()};
  await write(demoKey,[r,...await read(demoKey,examples)]);return r;
 }
 if(mode==='api')return request('/api/reports',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 const res=await fetch(cfg.supabaseUrl+'/rest/v1/reports',{method:'POST',headers:{...headers(),Prefer:'return=representation'},body:JSON.stringify(payload)});
 if(!res.ok)throw Error('Falha ao registrar (HTTP '+res.status+').');
 const rows=await res.json();return rows[0];
}
export async function registerReport(payload){
 try{const r=await postReport(payload);await write(ownKey,[r.id,...await getOwnIds()]);return {report:r,queued:false};}
 catch(e){
  if(mode==='demo'||/HTTP 4\d\d/.test(e.message))throw e;
  const p={...payload,id:'pendente-'+Date.now()+'-'+Math.random().toString(36).slice(2),created_at:new Date().toISOString(),pending:true,status:'pendente',supports_count:0};
  await write(pendingKey,[p,...await getPending()]);return {report:p,queued:true};
 }
}
export async function flushPending(){
 if(mode==='demo')return {sent:0,remaining:0};
 let sent=0;const remaining=[];
 for(const r of await getPending()){try{const {id,created_at,pending,...payload}=r;const saved=await postReport(payload);await write(ownKey,[saved.id,...await getOwnIds()]);sent++;}catch{remaining.push(r)}}
 await write(pendingKey,remaining);return {sent,remaining:remaining.length};
}
export async function supportReport(id){
 if((await getSupported()).includes(id))throw Error('Você já apoiou este relato neste aparelho.');
 if(mode==='demo'){
  const a=await read(demoKey,examples);const r=a.find(x=>x.id===id);if(!r)throw Error('Relato não encontrado.');
  r.supports_count=(r.supports_count||0)+1;await write(demoKey,a);
 }else if(mode==='api'){
  await request('/api/supports',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({report_id:id,device_id:await getVisitor()})});
 }else{
  const res=await fetch(cfg.supabaseUrl+'/rest/v1/supports',{method:'POST',headers:{...headers(),Prefer:'return=minimal'},body:JSON.stringify({report_id:id,device_id:await getVisitor()})});
  if(!res.ok)throw Error(res.status===409?'Você já apoiou este relato.':'Falha ao registrar apoio (HTTP '+res.status+').');
 }
 await write(supportedKey,[id,...await getSupported()]);
}
export async function readAll(){
 const [pending,own,supported]=await Promise.all([getPending(),getOwnIds(),getSupported()]);
 let reports=[],offline=false;
 try{reports=await fetchReports();if(mode!=='demo')await write(cacheKey,reports);}
 catch{offline=true;reports=await read(cacheKey,[]);}
 return {reports:[...pending,...reports],pending,own,supported,offline};
}
