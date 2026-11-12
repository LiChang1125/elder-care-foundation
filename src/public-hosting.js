import {siteUrl} from './site.js';
const publicCalendar='https://oracleapex.com/ords/db_courses/ecf-public/v1/events';
export async function loadPublicCalendar(signal) {
 try {
  const response=await fetch(publicCalendar,{signal:AbortSignal.any([signal,AbortSignal.timeout(8000)])});
  if(!response.ok)throw Error('Unavailable');
  const data=await response.json();
  if(!Array.isArray(data.items))throw Error('Invalid calendar');
  const events=data.items.map(e=>({event_id:e.event_id,event_name:String(e.event_name).slice(0,200),event_date:e.event_date,city:String(e.city||'').slice(0,100),country:String(e.country||'').slice(0,100)}));
  return {events,source:'live',as_of:new Date().toISOString()};
 }catch(error){
  if(signal.aborted)throw error;
  const response=await fetch(siteUrl('/calendar.json'),{signal});
  if(!response.ok)throw Error('Calendar unavailable');
  return {...await response.json(),source:'snapshot'};
 }
}
export function saveLocalRegistration(input,event,storage=localStorage,today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'})) {
 const name=String(input.name||'').trim(),email=String(input.email||'').trim().toLowerCase();
 if(String(input.eventId)!==String(event.event_id)||event.event_date<today)throw Error('This event is not open for registration.');
 if(!name||name.length>100||/[\r\n\x00-\x1f]/.test(name))throw Error('Please enter your name.');
 if(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('Please enter a valid email address.');
 if(!Number.isInteger(input.attendees)||input.attendees<1||input.attendees>6||input.consent!==true)throw Error('Please complete the form and consent.');
 const key='ecf-registration-requests-v1';let rows;
 try{rows=JSON.parse(storage.getItem(key)||'[]');if(!Array.isArray(rows))throw Error();}catch{throw Error('Browser storage is unavailable. Please allow local storage and try again.');}
 const prior=rows.find(r=>r.eventId===String(event.event_id)&&r.email===email);
 if(prior)return {reference:prior.reference,status:'PENDING',duplicate:true};
 const record={eventId:String(event.event_id),eventName:event.event_name,eventDate:event.event_date,name,email,attendees:input.attendees,reference:'ECF-'+crypto.randomUUID().slice(0,8).toUpperCase(),createdAt:new Date().toISOString(),status:'PENDING'};
 try{storage.setItem(key,JSON.stringify([...rows,record]));}catch{throw Error('Your browser could not save this request. Please check available storage.');}
 return {reference:record.reference,status:record.status,duplicate:false};
}
