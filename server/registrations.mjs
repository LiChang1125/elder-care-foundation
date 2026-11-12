import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
export class RegistrationError extends Error{constructor(message,status=400){super(message);this.status=status;}}
export function validateRegistration(input,events,today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'})){
 if(!input||typeof input!=='object')throw new RegistrationError('Please complete the registration form.');
 const event=events.find(e=>String(e.event_id)===String(input.eventId));
 if(!event||event.event_date<today)throw new RegistrationError('This event is not open for registration.');
 const name=typeof input.name==='string'?input.name.trim():'';const email=typeof input.email==='string'?input.email.trim().toLowerCase():'';
 if(name.length<1||name.length>100||/[\r\n\x00-\x1f]/.test(name))throw new RegistrationError('Please enter a name of 1–100 characters.');
 if(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))throw new RegistrationError('Please enter a valid email address.');
 if(!Number.isInteger(input.attendees)||input.attendees<1||input.attendees>6)throw new RegistrationError('Select between 1 and 6 attendees.');
 if(input.consent!==true)throw new RegistrationError('Please agree to save your registration information.');
 return {eventId:String(event.event_id),eventName:event.event_name,eventDate:event.event_date,eventCity:event.city,eventSource:event.local?'local-preview':'apex',name,email,attendees:input.attendees,consent:true};
}
export function createRegistrationStore(file){let queue=Promise.resolve();return async function save(input){const task=queue.then(async()=>{await mkdir(path.dirname(file),{recursive:true});let rows;try{rows=JSON.parse(await readFile(file,'utf8'));if(!Array.isArray(rows))throw Error('Invalid store');}catch(e){if(e.code==='ENOENT')rows=[];else throw new RegistrationError('Registration storage is unavailable. Please try later.',503);}const duplicate=rows.find(r=>r.eventId===input.eventId&&r.email===input.email);if(duplicate)return {reference:duplicate.reference,status:'PENDING',duplicate:true};if(rows.length>=2000)throw new RegistrationError('Registration storage is full. Please contact the team.',503);const row={...input,reference:'ECF-'+randomUUID().slice(0,8).toUpperCase(),status:'PENDING',createdAt:new Date().toISOString()};rows.push(row);await writeFile(file+'.tmp',JSON.stringify(rows,null,2),{mode:0o600});await rename(file+'.tmp',file);return {reference:row.reference,status:row.status,duplicate:false};});queue=task.catch(()=>{});return task;};}
