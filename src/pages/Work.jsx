import {siteUrl} from "../site.js";
import {services} from '../content.js';
import {PageIntro,Steps,Invite} from './Shared.jsx';
export default function Work(){return <>
 <PageIntro title={<>Support that fits<br/>real life.</>} description="For older adults who want to stay independent, and families who want to know someone is there."/>
 <div className="container service-directory">{services.map((s,i)=><section className={`service-detail ${i%2?'reverse':''}`} id={s.id} key={s.id}><img src={siteUrl(`/images/${s.image}`)} alt={s.alt} width="700" height="500" loading={i?'lazy':'eager'}/><div><span className="section-label">0{i+1}</span><h2>{s.title}</h2><p>{s.description}</p><ul className="service-checks">{s.details.map(d=><li key={d}>{d}</li>)}</ul><p className="small">{s.note}</p><a className="button" href={siteUrl("/contact?topic=Finding%20support")}>Ask about this support</a></div></section>)}</div>
 <section className="section mission wave"><div className="container"><h2>There is no wrong first question.</h2><div className="editorial-columns"><article><h3>For older adults</h3><p>Ask about a task, a journey or a moment in the week that would feel easier with someone alongside you.</p></article><article><h3>For families</h3><p>Explore practical support around everyday responsibilities. The older adult’s choices remain at the centre.</p></article><article><h3>For community groups</h3><p>Talk with us about a referral or a local activity. Share only the information needed and with the person’s permission.</p></article></div></div></section>
 <section className="section"><div className="container"><h2>A clear next step, together.</h2><Steps items={[
 ['Start a conversation','Tell us what would help and how you would prefer to be involved.'],
 ['Agree a plan','Discuss the service, timing, availability and any practical arrangements.'],
 ['Stay connected','Review how the support went and what might be useful next.']
 ]}/><p className="small">Services are non-clinical. We do not provide emergency transport, diagnosis or nursing care.</p></div></section><Invite title="Make room for a little more confidence." href={siteUrl("/events")} label="Explore community activities"/>
 </>;}
