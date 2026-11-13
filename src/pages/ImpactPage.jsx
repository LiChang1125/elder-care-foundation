import {useState} from 'react';
import {siteUrl} from "../site.js";
import {CountUp} from '../components/Motion.jsx';
import {PageIntro,Steps,Invite} from './Shared.jsx';
export default function ImpactPage(){
 const [volunteers,setVolunteers]=useState(100),[hours,setHours]=useState(2);
 return <><PageIntro title={<>Small acts.<br/>A lasting difference.</>} description="Look at the community we are working towards, the activity recorded so far and the care behind every measure."/>
 <section className="section annual-goals wave"><div className="container"><header className="section-heading"><h2>Our next chapter: 2027.</h2><p>Annual service goals — what we aim to build with our community.</p></header><div className="goal-figures"><div><CountUp value={1200}/><span>support visits to work towards</span></div><div><CountUp value={2400}/><span>volunteer hours to mobilize</span></div><div><CountUp value={100}/><span>regular volunteers to bring together</span></div></div><p className="small centered">Forward-looking goals, not services already delivered. Delivery depends on community participation, funding and service capacity.</p></div></section>

 <div className="container record-link"><a className="text-link" href={siteUrl("/#community-records")}>View our activity and community records on the homepage →</a></div>
 <section className="section capacity-section"><div className="container two-column"><div><h2>A small commitment.<br/>A shared possibility.</h2><p>Explore how regular volunteering could add up over a year. Adjust the number of people and monthly hours to see the potential.</p><p className="small">This is a planning calculation, not a count of completed work.</p></div><div className="capacity-calculator"><label htmlFor="volunteers">Volunteers <strong>{volunteers}</strong></label><input id="volunteers" type="range" min="10" max="200" step="10" value={volunteers} onChange={e=>setVolunteers(Number(e.target.value))}/><label htmlFor="monthly-hours">Hours per person each month <strong>{hours}</strong></label><input id="monthly-hours" type="range" min="1" max="8" value={hours} onChange={e=>setHours(Number(e.target.value))}/><output aria-live="polite"><strong>{(volunteers*hours*12).toLocaleString('en-US')}</strong> potential volunteer hours a year</output><p className="small">{volunteers} people × {hours} hours × 12 months</p></div></div></section>
 <section className="section"><div className="container"><h2>Care that can be followed through.</h2><Steps items={[
 ['Listen & plan','A request becomes a service case with an agreed programme and a clear next step.'],
 ['Deliver & record','Completed support is recorded with the service date, time and outcome.'],
 ['Connect support & funding','The internal system links received contributions, programme spending and service delivery. A pledge is a promise; a received donation is recorded separately.']
 ]}/></div></section><Invite title="Help turn next year’s goals into everyday support."/>
 </>;
}
