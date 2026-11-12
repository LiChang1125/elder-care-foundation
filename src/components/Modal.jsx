import {useEffect,useRef} from 'react';
export default function Modal({title,children,onClose}){
 const ref=useRef(null);
 useEffect(()=>{const previous=document.activeElement;const dialog=ref.current;dialog.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=old;previous?.focus();};},[]);
 useEffect(()=>{ref.current?.querySelector('h2')?.focus();},[title]);
 return <dialog ref={ref} className="modal" aria-labelledby="dialog-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}}><div className="modal-inner"><button className="close-button" aria-label="Close dialog" onClick={onClose}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 6 12 12M6 18 18 6"/></svg></button><h2 id="dialog-title" tabIndex={-1}>{title}</h2>{children}</div></dialog>;
}
