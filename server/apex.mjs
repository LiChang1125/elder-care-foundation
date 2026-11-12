import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../data/',import.meta.url);
const base=process.env.APEX_PUBLIC_BASE||'https://oracleapex.com/ords/db_courses/ecf-public/v1/';
const allowed=new Set(['impact','events']);
const pending=new Map(),memory=new Map();
export function sanitizeImpact(row){
 const output={};for(const key of ['completed_services','people_supported','support_hours','active_programs']){const value=row?.[key];if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw Error('Invalid aggregate');output[key]=value;}
 if(!row.as_of||!Number.isFinite(Date.parse(row.as_of)))throw Error('Invalid timestamp');
 return {...output,as_of:row.as_of,latest_service_date:row.latest_service_date,scope:'All recorded locations'};
}
export function sanitizeEvents(items){
 if(!Array.isArray(items))throw Error('Invalid event list');
 return items.map(e=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(e.event_date)||typeof e.event_name!=='string')throw Error('Invalid event');return {event_id:e.event_id,event_name:e.event_name.slice(0,200),event_date:e.event_date,city:String(e.city||'').slice(0,100),country:String(e.country||'').slice(0,100)};});
}
async function load(kind){
 try{const response=await fetch(new URL(kind,base),{headers:{Accept:'application/json'},signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error(`HTTP ${response.status}`);const json=await response.json();const value=kind==='impact'?sanitizeImpact(json.items?.[0]):{events:sanitizeEvents(json.items),as_of:new Date().toISOString()};await writeFile(new URL(`cache-${kind}.json`,root),JSON.stringify(value,null,2));const result={...value,source:'live'};memory.set(kind,{at:Date.now(),value:result});return result;}catch(error){console.warn(`APEX ${kind} refresh unavailable: ${error.message}`);for(const file of [`cache-${kind}.json`,`snapshot-${kind}.json`]){try{const value=JSON.parse(await readFile(new URL(file,root),'utf8'));const clean=kind==='impact'?sanitizeImpact(value):{events:sanitizeEvents(value.events),as_of:value.as_of};return {...clean,source:'snapshot'};}catch{}}throw Error('Records unavailable');}
}
export async function getPublicData(kind){if(!allowed.has(kind))throw Error('Unknown public feed');const saved=memory.get(kind);if(saved&&Date.now()-saved.at<60000)return saved.value;if(!pending.has(kind))pending.set(kind,load(kind).finally(()=>pending.delete(kind)));return pending.get(kind);}
