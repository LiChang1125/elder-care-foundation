import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {getPublicData} from './apex.mjs';
import {createRegistrationStore,validateRegistration,RegistrationError} from './registrations.mjs';
import {localEvents} from '../src/content.js';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const registrationFile=process.env.REGISTRATIONS_FILE||path.resolve(root,'../elder-care-website-private/registrations.json');
const saveRegistration=createRegistrationStore(registrationFile);
const registrationLimit={start:Date.now(),count:0};
const production=process.argv.includes('--production');
const vite=production?null:await(await import('vite')).createServer({root,server:{middlewareMode:true,host:'127.0.0.1'},appType:'spa'});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{try{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/api/registrations'){
   res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
   if(req.method!=='POST'){res.writeHead(405,{Allow:'POST'});res.end(JSON.stringify({error:'Use the event registration form.'}));return;}
   const allowedOrigins=[`http://localhost:${process.env.PORT||5173}`,`http://127.0.0.1:${process.env.PORT||5173}`];
   if(!allowedOrigins.includes(req.headers.origin)||!String(req.headers['content-type']).startsWith('application/json')){res.writeHead(403);res.end(JSON.stringify({error:'Please register from this website.'}));return;}
   try{
     if(Date.now()-registrationLimit.start>60000){registrationLimit.start=Date.now();registrationLimit.count=0;}
     if(++registrationLimit.count>20)throw new RegistrationError('Too many requests. Please wait a minute.',429);
     let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>8192)throw new RegistrationError('Registration request is too large.',413);}
     let input;try{input=JSON.parse(body);}catch{throw new RegistrationError('Invalid registration form.');}
     let events=localEvents;if(!localEvents.some(e=>String(e.event_id)===String(input?.eventId))){try{events=(await getPublicData('events')).events;}catch{throw new RegistrationError('The event calendar is unavailable. Please try again.',503);}}
     const record=validateRegistration(input,events);const result=await saveRegistration(record);res.writeHead(result.duplicate?200:201);res.end(JSON.stringify(result));
   }catch(e){res.writeHead(e.status||500);res.end(JSON.stringify({error:e instanceof RegistrationError?e.message:'Unable to save registration. Please try later.'}));}return;
 }
 if(pathname.startsWith('/api/')){res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');if(req.method!=='GET'){res.writeHead(405,{Allow:'GET'});res.end(JSON.stringify({error:'Read-only API'}));return;}const kind=pathname.slice(5);if(!['impact','events','health'].includes(kind)){res.writeHead(404);res.end(JSON.stringify({error:'Not found'}));return;}if(kind==='health'){res.end(JSON.stringify({ok:true,mode:production?'production-preview':'development',payments:false}));return;}try{res.end(JSON.stringify(await getPublicData(kind)));}catch{res.writeHead(503);res.end(JSON.stringify({error:'Records temporarily unavailable'}));}return;}
 if(!production){vite.middlewares(req,res);return;}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 const dist=path.join(root,'dist');let file=path.resolve(dist,'.'+decodeURIComponent(pathname));if(!file.startsWith(dist+path.sep)&&file!==dist){res.writeHead(403);res.end();return;}try{if(!(await stat(file)).isFile())throw Error();}catch{if(path.extname(pathname)){res.writeHead(404);res.end();return;}file=path.join(dist,'index.html');}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(req.method==='HEAD'?undefined:await readFile(file));
 }catch{res.writeHead(500);res.end('Unable to serve this request.');}}).listen(Number(process.env.PORT||5173),'127.0.0.1',()=>console.log(`Elder Care Foundation: http://localhost:${process.env.PORT||5173} (${production?'built preview':'development'})`));
