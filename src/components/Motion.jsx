import {useEffect,useRef,useState} from 'react';

// Enhance visible content without making it depend on animation to be readable.
export function useEntranceMotion(){
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets=document.querySelectorAll('main > .page-intro, main > .hero > *, main > section > .container, .service-directory > .service-detail');
  if(!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    entry.target.dataset.motion='entered';
    if(!preference.matches)entry.target.classList.add('enter-view');
    observer.unobserve(entry.target);
   }
  },{threshold:0.08});
  targets.forEach(target=>observer.observe(target));
  return()=>{observer.disconnect();targets.forEach(target=>{target.classList.remove('enter-view');delete target.dataset.motion;});};
 },[]);
}

export function CountUp({value}){
 const ref=useRef(null),[display,setDisplay]=useState(value);
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  setDisplay(value);
  if(!('IntersectionObserver' in window))return;
  const finish=()=>{cancelAnimationFrame(frame);setDisplay(value);};
  const changed=()=>{if(preference.matches)finish();};
  preference.addEventListener('change',changed);
  const observer=new IntersectionObserver(entries=>{
   if(!entries.some(entry=>entry.isIntersecting))return;
   observer.disconnect();
   if(preference.matches)return;
   const start=performance.now();
   setDisplay(0);
   const animate=now=>{
    const progress=Math.min((now-start)/1250,1);
    setDisplay(Math.round(value*(1-Math.pow(1-progress,3))));
    if(progress<1)frame=requestAnimationFrame(animate);
   };
   frame=requestAnimationFrame(animate);
  },{threshold:0.6});
  observer.observe(ref.current);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);preference.removeEventListener('change',changed);};
 },[value]);
 return <strong ref={ref} className="count-up" aria-label={value.toLocaleString('en-US')}><span aria-hidden="true">{display.toLocaleString('en-US')}</span></strong>;
}
