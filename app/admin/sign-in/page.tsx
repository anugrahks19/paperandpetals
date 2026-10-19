"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { ArrowRight } from "lucide-react";

export default function AdminSignIn() {
  const [email,setEmail]=useState("");
  const [code,setCode]=useState("");
  const [step,setStep]=useState<"email"|"code">("email");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if(step==="email") {
        const result=await authClient.emailOtp.sendVerificationOtp({email:email.trim().toLowerCase(),type:"sign-in"});
        if(result.error) throw new Error(result.error.message||"Could not send your code.");
        setStep("code");
      } else {
        const result=await authClient.signIn.emailOtp({email:email.trim().toLowerCase(),otp:code.trim()});
        if(result.error) throw new Error(result.error.message||"That code did not work.");
        window.location.assign("/admin");
      }
    } catch(cause) { setError(cause instanceof Error?cause.message:"Please try again."); }
    finally { setBusy(false); }
  }
  return <main className="admin-auth-page"><a href="/" className="admin-auth-brand">paper <em>&</em> petals <small>THE PRIVATE STUDIO</small></a><div className="admin-auth-card"><span className="eyebrow">STUDIO ACCESS</span><h1>{step==="email"?"Welcome back.":"Check your inbox."}</h1><p>{step==="email"?"Enter your approved studio email. We’ll send you a one-time sign-in code.":"Enter the code sent to "+email+"."}</p><form onSubmit={submit}>{step==="email"?<label>Studio email<input name="email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>:<label>One-time code<input name="code" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter your code"/></label>}{error&&<div className="error" role="alert">{error}</div>}<button className="button button-dark" disabled={busy}>{busy?"Please wait…":step==="email"?"Send sign-in code":"Open dashboard"} <ArrowRight size={16}/></button></form>{step==="code"&&<div className="admin-auth-switch">Wrong address? <button onClick={()=>{setStep("email");setCode("");setError("")}}>Use another email</button></div>}<a href="/" className="admin-auth-back">← Back to customer website</a></div></main>;
}
