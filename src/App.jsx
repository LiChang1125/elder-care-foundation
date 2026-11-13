import {siteUrl,sitePath} from "./site.js";
import {useEffect,useState} from 'react';
import {useEntranceMotion} from './components/Motion.jsx';
import Modal from './components/Modal.jsx';
import Donation from './components/Donation.jsx';
import ContactDraft from './components/ContactDraft.jsx';
import Registration from './components/Registration.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Work from './pages/Work.jsx';
import ImpactPage from './pages/ImpactPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import NewsPage from './pages/NewsPage.jsx';
import Giving from './pages/Giving.jsx';
import Contact from './pages/Contact.jsx';
const routes={'/':'Home','/about':'About us','/our-work':'Our work','/impact':'Our impact','/events':'Events','/news':'News','/get-involved':'Get involved','/contact':'Contact'};
function Brand(){return <img className="brand-logo" src={siteUrl("/images/elder-care-foundation-logo-transparent.png")} alt="Elder Care Foundation" width="1536" height="1024"/>;}
export default function App(){
 useEntranceMotion();
 const [menu,setMenu]=useState(false),[modal,setModal]=useState(null);
 const path=sitePath(window.location.pathname);
 useEffect(()=>{
  document.title=(routes[path]||'Page not found')+' — Elder Care Foundation';
  if(!window.location.hash)return;
  let id;try{id=decodeURIComponent(window.location.hash.slice(1));}catch{return;}
  const frame=requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'}));
  return()=>cancelAnimationFrame(frame);
 },[path]);
 const contact=(topic='General enquiry')=>setModal({kind:'contact',title:'Let’s talk.',topic});
 const donate=()=>setModal({kind:'donate',title:'Give a little. Make a difference.'});
 const event=e=>setModal({kind:'event',title:e.event_name,data:e});
 const story=n=>setModal({kind:'news',title:n.title,data:n});
 const links=[['Home','/'],['About','/about'],['Our work','/our-work'],['Impact','/impact'],['Events','/events'],['News','/news'],['Contact','/contact']];
 const pages={'/':<Home donate={donate}/>,'/about':<About/>,'/our-work':<Work/>,'/impact':<ImpactPage/>,'/events':<EventsPage onEvent={event}/>,'/news':<NewsPage onNews={story}/>,'/get-involved':<Giving donate={donate}/>,'/contact':<Contact/>};
 return <><a className="skip-link" href="#main">Skip to content</a>
 <header className="site-header"><a href={siteUrl("/")} className="brand-link" aria-label="Elder Care Foundation home"><Brand/></a><button className="menu-toggle" aria-expanded={menu} aria-controls="main-nav" aria-label={menu?'Close menu':'Open menu'} onClick={()=>setMenu(!menu)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={menu?'m6 6 12 12M6 18 18 6':'M4 7h16M4 12h16M4 17h16'}/></svg></button><nav id="main-nav" className={menu?'open':''} aria-label="Main navigation">{links.map(([text,href])=><a key={href} href={siteUrl(href)} aria-current={path===href?'page':undefined}>{text}</a>)}<a className="nav-action" href={siteUrl("/get-involved")} aria-current={path==='/get-involved'?'page':undefined}>Get involved</a></nav></header>
 <main id="main">{pages[path]||<section className="page-intro container"><div><h1>Let’s find your way.</h1><p>This page is not available. Explore our services or return to the homepage.</p><a className="button" href={siteUrl("/")}>Return home</a></div></section>}</main>
 <footer className="wave"><div className="container"><div className="footer-top"><div><a href={siteUrl("/")} className="brand-link" aria-label="Elder Care Foundation home"><Brand/></a><p>Practical support. Human connection.<br/>Everyday dignity, here in Weihai.</p></div><div><h3>Explore</h3><a href={siteUrl("/about")}>Our mission</a><a href={siteUrl("/our-work")}>Our work</a><a href={siteUrl("/impact")}>Our impact</a><a href={siteUrl("/news")}>Community news</a></div><div><h3>Take part</h3><a href={siteUrl("/events")}>Upcoming events</a><a href={siteUrl("/get-involved")}>Give support</a><a href={siteUrl("/contact?topic=Volunteering")}>Volunteer with us</a><a href={siteUrl("/contact")}>Contact</a></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Elder Care Foundation</p><button onClick={()=>setModal({kind:'privacy',title:'Your privacy matters.'})}>Privacy & image information</button></div></div></footer>
 {modal&&<Modal title={modal.title} onClose={()=>setModal(null)}>{modal.kind==='registration'?<Registration event={modal.data}/>:modal.kind==='donate'?<Donation/>:modal.kind==='contact'?<ContactDraft topic={modal.topic}/>:modal.kind==='service'?<><img className="modal-image" src={siteUrl(`/images/${modal.data.image}`)} alt={modal.data.alt}/><p>{modal.data.description}</p><ul>{modal.data.details.map(d=><li key={d}>{d}</li>)}</ul><p className="small">{modal.data.note}</p><button className="button" onClick={()=>contact('Finding support')}>Ask about support</button></>:modal.kind==='event'?<><img className="modal-image" src={siteUrl(`/images/${modal.data.image||'community.png'}`)} alt="Community gathering illustration"/><p className="news-meta">{modal.data.event_date} · {modal.data.city}{modal.data.country?`, ${modal.data.country}`:''}</p><p>{modal.data.description||'This upcoming community event is listed in our organization’s calendar. Register your interest below to request a place; the organizer will need to confirm the full programme and attendance arrangements.'}</p>{modal.data.time&&<p>{modal.data.time}</p>}<p>Please confirm the time and meeting point with our team before attending.</p><button className="button" onClick={()=>setModal({kind:'registration',title:'Register your interest',data:modal.data})}>Register your interest</button></>:modal.kind==='news'?<article><p className="news-meta">{modal.data.category} · {modal.data.date}</p><img className="modal-image" src={siteUrl(`/images/${modal.data.image}`)} alt="Community life illustration"/>{modal.data.paragraphs.map(p=><p key={p}>{p}</p>)}<p className="small">Image: AI-created community illustration.</p></article>:<><p>This website uses no advertising trackers. Enquiry drafts remain on your device and are not submitted. Event registration requests are saved on this computer, associated with the selected event, and await separate confirmation. No payment details are collected.</p><p>The impact section displays aggregate service statistics. Names and personal records are not exposed.</p><p>Community images are AI-created illustrations, not documentary photographs of named participants. Community notes describe our service approach. Service journeys explain how support can work and are not personal testimonials. Prospective community connections are not confirmed partnerships.</p></>}</Modal>}
 </>;
}
