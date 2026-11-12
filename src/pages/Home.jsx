import {siteUrl} from "../site.js";
import Stories from '../components/Stories.jsx';
import {Arrow,ServiceCards,Invite} from './Shared.jsx';
export default function Home(){return <>
 <section className="hero"><div className="hero-copy"><h1>Life is better,<br/><em>together.</em></h1><p>Practical support. Meaningful connection. A community where older adults can live with confidence and dignity.</p><div className="hero-actions"><a className="button" href={siteUrl("/our-work")}>Find support <Arrow/></a><a className="text-link" href={siteUrl("/about")}>Meet Elder Care</a></div></div><figure className="hero-media"><img src={siteUrl("/images/hero.png")} alt="An older woman and an adult companion sharing a conversation in a coastal garden" width="1448" height="1086" fetchPriority="high"/><figcaption>Everyday support. Lasting connection.</figcaption></figure></section>
 <div className="values container"><span>Stay independent</span><span>Feel connected</span><span>Live with dignity</span></div>
 <ServiceCards/><Stories/><Invite/>
 </>;}
