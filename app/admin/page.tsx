
import type { Metadata } from "next";
import { Header } from "../page";
import { getAuth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/admin";
import Dashboard from "./dashboard";
export const dynamic="force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function AdminPage(){
  const { data: session }=await getAuth().getSession();
  const allowed=session?.user?.emailVerified===true && isAdminEmail(session.user.email);
  if(!allowed) return <main><Header/><div className="gate"><span className="eyebrow">STUDIO ONLY</span><h1>Welcome to the studio.</h1><p>{session?.user?"This account is not on the studio admin list. Please sign in with the approved email address.":"Sign in with the approved studio email to see bookings and manage orders."}</p><a href="/admin/sign-in" className="button button-dark">{session?.user?"Switch account":"Sign in to dashboard"}</a><p style={{marginTop:18}}><a href="/">← Back to home</a></p></div></main>;
  return <Dashboard/>;
}


