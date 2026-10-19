import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/admin";

const handlers = auth.handler();
export const GET = handlers.GET;
export async function POST(request:NextRequest, context:{params:Promise<{path:string[]}>}) {
  const path=(await context.params).path.join("/");
  if(path==="sign-up/email" || path==="sign-in/email") {
    return NextResponse.json({error:"Use the studio email code sign-in."},{status:403});
  }
  if(path==="email-otp/send-verification-otp" || path==="sign-in/email-otp") {
    const body=await request.clone().json().catch(()=>null) as {email?:string}|null;
    if(!isAdminEmail(body?.email)) return NextResponse.json({error:"This email is not approved for studio access."},{status:403});
  }
  return handlers.POST(request,context);
}
