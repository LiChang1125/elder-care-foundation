import {staticHosting} from '../site.js';
import {loadPublicCalendar} from '../public-hosting.js';
import {siteUrl} from "../site.js";
import {useState,useEffect,useCallback,useRef} from 'react';
import {localEvents} from '../content.js';
export default function Events({onEvent}){
 const [records,setRecords]=useState([]),[view,setView]=useState('weihai'),[source,setSource]=useState('loading');
 const [busy,setBusy]=useState(false),[failed,setFailed]=useState(false),[query,setQuery]=useState(''),[month,setMonth]=useState(''),[updated,setUpdated]=useState('');
 const request=useRef(null);
 const refresh=useCallback(async()=>{
  request.current?.abort();
  const controller=new AbortController();request.current=controller;
  setBusy(true);setFailed(false);
  try{
   let data;
   if(staticHosting)data=await loadPublicCalendar(controller.signal);
   else {const response=await fetch('/api/events',{signal:controller.signal});if(!response.ok)throw Error('Unavailable');data=await response.json();}
   if(!Array.isArray(data.events))throw Error('Invalid calendar');
   if(request.current!==controller)return;
   setRecords(data.events);setSource(data.source);setUpdated(data.as_of||'');
  }catch(error){if(error.name!=='AbortError'&&request.current===controller)setFailed(true);}
  finally{if(request.current===controller&&!controller.signal.aborted)setBusy(false);}
 },[]);
 useEffect(()=>{refresh();return()=>request.current?.abort();},[refresh]);
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'});
 const upcoming=(view==='weihai'?localEvents:records).filter(e=>e.event_date>=today);
 const months=[...new Set(upcoming.map(e=>e.event_date.slice(0,7)))].sort();
 const term=query.trim().toLocaleLowerCase();
 const list=upcoming.filter(e=>(!month||e.event_date.startsWith(month))&&(!term||[e.event_name,e.city,e.country,e.description].filter(Boolean).join(' ').toLocaleLowerCase().includes(term)));
 const switchView=next=>{setView(next);setMonth('');setQuery('');};
 const filtered=Boolean(query||month);
 return <section className="section events" id="events"><div className="container">
  <header className="section-heading"><h2>A community to be part of.</h2><p>Connection begins with showing up.</p></header>
  <div className="event-tabs" role="group" aria-label="Event location"><button aria-pressed={view==='weihai'} onClick={()=>switchView('weihai')}>In Weihai</button><button aria-pressed={view==='all'} onClick={()=>switchView('all')}>Across our network</button></div>
  <div className="event-filters"><label className="field">Find an activity<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search activities or places"/></label><label className="field">Month<select value={month} onChange={e=>setMonth(e.target.value)}><option value="">All upcoming dates</option>{months.map(m=><option key={m} value={m}>{new Date(m+'-01T12:00:00').toLocaleDateString('en-US',{month:'long',year:'numeric'})}</option>)}</select></label>{filtered&&<button className="text-button" onClick={()=>{setMonth('');setQuery('');}}>Clear filters</button>}{view==='all'&&<button className="calendar-refresh" onClick={refresh} disabled={busy}><svg className={busy?'refresh-spinning':''} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M19 8a8 8 0 1 0 1 7M19 3v5h-5"/></svg>{busy?'Updating calendar…':'Refresh calendar'}</button>}</div>
  <p className="event-results" role="status" aria-live="polite">{view==='all'&&busy&&records.length===0?'Loading upcoming activities…':view==='all'&&failed&&records.length===0?'Calendar temporarily unavailable':`${list.length} ${list.length===1?'activity':'activities'}${filtered?' matching your search':' to explore'}`}</p>
  {view==='all'&&failed&&<p className="notice" role="alert">We couldn’t refresh the calendar. {records.length?'Previously loaded activities are still shown.':'Please try again.'}</p>}
  <div className="article-grid event-results-grid" aria-busy={view==='all'&&busy}>{list.map((e,i)=><article key={e.event_id} className="event-card"><button className="image-button" onClick={()=>onEvent(e)} aria-label={`View ${e.event_name}`}><img loading="lazy" src={siteUrl(`/images/${e.image||['community.png','guidance.png','nutrition.png'][i%3]}`)} alt="Community support and shared activities" width="600" height="400"/><span className="date-badge"><b>{new Date(e.event_date+'T12:00:00').getDate()}</b>{new Date(e.event_date+'T12:00:00').toLocaleDateString('en-US',{month:'short'})}</span></button><p className="event-place">{e.city}{e.country&&e.country!=='China'?` · ${e.country}`:''}</p><h3>{e.event_name}</h3><p>{e.description||'Find out more about this upcoming event and ways to take part.'}</p><div className="event-actions"><button className="text-link" onClick={()=>onEvent(e)}>Event details</button></div></article>)}</div>
  {list.length===0&&!(view==='all'&&busy)&&<div className="empty-state"><h3>{filtered?'Let’s find another way to connect.':'Our next gatherings will be announced here.'}</h3><p>{filtered?'Try a different search or clear your filters to see every upcoming activity.':'Please check back for new dates.'}</p>{filtered&&<button className="button" onClick={()=>{setMonth('');setQuery('');}}>Show all activities</button>}</div>}
  <p className="events-note">{view==='weihai'?'Times and meeting arrangements are confirmed with our team before attendance.':updated?`${source==='live'?'Organization calendar':'Last available calendar'} · ${new Date(updated).toLocaleString('en-GB',{timeZone:'Asia/Shanghai',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})} China time`:'Upcoming activities from our organization’s calendar.'}</p>
 </div></section>;
}
