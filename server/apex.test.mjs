import test from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeImpact,sanitizeEvents} from './apex.mjs';
const impact={completed_services:3,people_supported:3,support_hours:6,active_programs:3,as_of:'2026-11-11T14:19:29Z',latest_service_date:'2026-11-05'};
test('public aggregate strips unexpected private columns and preserves legitimate zero values',()=>{
 const result=sanitizeImpact({...impact,completed_services:0,donor_email:'private@example.com',beneficiary_name:'Private',bank_account:'Private'});
 assert.equal(result.completed_services,0);assert.equal(result.scope,'All recorded locations');assert.ok(!('donor_email' in result));assert.ok(!('beneficiary_name' in result));assert.ok(!('bank_account' in result));
});
test('bad upstream values cannot become fabricated public statistics',()=>{
 for(const value of [null,undefined,'3',-1,NaN,Infinity])assert.throws(()=>sanitizeImpact({...impact,completed_services:value}));
 assert.throws(()=>sanitizeImpact({...impact,as_of:'not-a-date'}));
});
test('event feed exposes only approved summary fields',()=>{
 const result=sanitizeEvents([{event_id:1,event_name:'Community gathering',event_date:'2026-11-21',city:'Weihai',country:'China',event_street:'Private street',organizer_email:'private@example.com'}]);
 assert.deepEqual(Object.keys(result[0]),['event_id','event_name','event_date','city','country']);
 assert.throws(()=>sanitizeEvents(null));assert.throws(()=>sanitizeEvents([{event_name:'Meeting',event_date:'invalid'}]));
});
