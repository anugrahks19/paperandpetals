"use client";
import { useState } from "react";

import { ArrowRight, CheckCircle2 } from "lucide-react";
const products=["Handmade cards","Thoughtful gift boxes","Mini paintings","Something else"];
export default function BookingForm({initialProduct}:{initialProduct:string}){
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [receipt,setReceipt]=useState("");
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setError(""); setBusy(true);
    const form=new FormData(e.currentTarget);
    const payload=Object.fromEntries(form.entries());
    try{
      const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json() as {error?:string;id?:string};
      if(!res.ok) throw new Error(data.error||"Something went wrong.");
      setReceipt(data.id||"saved");
    }catch(err){setError(err instanceof Error?err.message:"Could not send the request.");}
    finally{setBusy(false);}
  }
  if(receipt) return <div className="booking-form"><div className="success"><CheckCircle2 size={38} style={{margin:"0 auto 15px",color:"#60775e"}}/><h2>Your idea is on its way!</h2><p>Thank you for sharing it. Your booking request has been saved. We’ll use your contact details to discuss the design, price and timeline before confirming the order.</p><p style={{fontSize:11}}>Reference: {receipt.slice(0,8).toUpperCase()}</p><a href="/" className="button button-dark">Back to the studio <ArrowRight size={17}/></a></div></div>;
  return <form className="booking-form" onSubmit={submit}><h2>Tell us your lovely idea</h2><p className="intro">A few details help us imagine and plan your handmade piece.</p><div className="form-grid">
    <div className="field"><label htmlFor="name">Your name *</label><input id="name" name="name" required minLength={2} maxLength={100} placeholder="What should we call you?"/></div>
    <div className="field"><label htmlFor="email">Email address *</label><input id="email" type="email" name="email" required placeholder="you@example.com"/></div>
    <div className="field"><label htmlFor="phone">Phone / WhatsApp *</label><input id="phone" name="phone" required minLength={7} maxLength={25} placeholder="+91 ..."/></div>
    <div className="field"><label htmlFor="product">What would you like? *</label><select id="product" name="product" defaultValue={products.includes(initialProduct)?initialProduct:""} required><option value="" disabled>Choose a creation</option>{products.map(p=><option key={p}>{p}</option>)}</select></div>
    <div className="field"><label htmlFor="occasion">Occasion *</label><input id="occasion" name="occasion" required minLength={2} maxLength={100} placeholder="Birthday, anniversary, just because..."/></div>
    <div className="field"><label htmlFor="neededBy">Needed by</label><input id="neededBy" name="neededBy" type="date"/></div>
    <div className="field full"><label htmlFor="budget">Approximate budget (optional)</label><select id="budget" name="budget" defaultValue=""><option value="">Let’s discuss it</option><option>Under ₹300</option><option>₹300–₹500</option><option>₹500–₹800</option><option>₹800+</option></select></div>
    <div className="field full"><label htmlFor="notes">Your idea & personal touches *</label><textarea id="notes" name="notes" required minLength={10} maxLength={2000} placeholder="Tell us about the person, colours, message, style or anything that matters..."/></div>
    <div className="field full" style={{position:"absolute",left:"-10000px"}} aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
  </div><p className="field-help">Submitting this form is an enquiry, not a paid order. We’ll confirm availability, price, timing and delivery with you first.</p>{error&&<div className="error" role="alert">{error}</div>}<button className="button button-dark" type="submit" disabled={busy}>{busy?"Sending your request...":"Send my request"} <ArrowRight size={18}/></button></form>;
}


