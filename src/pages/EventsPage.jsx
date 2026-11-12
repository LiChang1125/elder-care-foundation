import {siteUrl} from "../site.js";
import Events from '../components/Events.jsx';
import {PageIntro,Steps,Invite} from './Shared.jsx';
export default function EventsPage({onEvent}){return <>
 <PageIntro title={<>A place to meet.<br/>A reason to connect.</>} description="Find a gathering, explore the details and register your interest. Older adults, families, volunteers and supporters are welcome to take the next step." image="community.png" alt="A relaxed gathering of older neighbours"/>
 <Events onEvent={onEvent}/>
 <section className="section mission wave"><div className="container"><h2>Before you join us.</h2><Steps items={[
 ['Find your activity','Read the date, location and introduction before opening the registration form.'],
 ['Register your interest','Choose how many people would like to attend. Your request remains pending until arrangements are confirmed.'],
 ['Plan a comfortable visit','Confirm the time, meeting point and any access needs before setting out. A family member or companion can be included in the attendance request.']
 ]}/></div></section>
 <Invite title="Come as a supporter. Leave more connected." text="See how everyday support works, meet the community and explore ways to contribute your time or resources." href={siteUrl("/get-involved")} label="Ways to get involved"/>
 </>;}
