import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,unlink,rmdir} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createRegistrationStore,validateRegistration} from './registrations.mjs';
const events=[{event_id:1022,event_name:'Workshop',event_date:'2026-11-12',city:'Syracuse'}];
const input={eventId:'1022',name:'Website review',email:'review@example.com',attendees:2,consent:true};
test('registration uses authoritative event details and rejects invalid or expired events',()=>{
 const record=validateRegistration({...input,eventName:'Untrusted title',bank_account:'Discard'},events,'2026-11-11');assert.equal(record.eventName,'Workshop');assert.equal(record.eventSource,'apex');assert.ok(!('bank_account' in record));
 assert.throws(()=>validateRegistration(input,events,'2026-11-13'));assert.throws(()=>validateRegistration({...input,eventId:'9999'},events,'2026-11-11'));
 for(const change of [{consent:false},{email:'bad'},{attendees:7},{attendees:1.5},{name:'\n'}])assert.throws(()=>validateRegistration({...input,...change},events,'2026-11-11'));
});
test('concurrent duplicate registrations persist once, retain event link and expose no personal data in response',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'ecf-registration-test-'));const file=path.join(dir,'records.json');
 try{const store=createRegistrationStore(file);const record=validateRegistration(input,events,'2026-11-11');const results=await Promise.all([store(record),store(record)]);assert.equal(results[0].reference,results[1].reference);assert.equal(results[1].duplicate,true);assert.ok(!('email' in results[0]));const rows=JSON.parse(await readFile(file,'utf8'));assert.equal(rows.length,1);assert.equal(rows[0].eventId,'1022');assert.equal(rows[0].status,'PENDING');}finally{await unlink(file).catch(()=>{});await rmdir(dir);}
});
