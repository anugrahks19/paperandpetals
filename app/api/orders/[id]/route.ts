import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
const statuses=["new","confirmed","making","ready","dispatched","completed","cancelled"];
const payments=["unpaid","advance-paid","paid"];
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){
  if(!await isAdmin()) return NextResponse.json({error:"Forbidden"},{status:403});
  const {id}=await context.params;
  const body=await request.json().catch(()=>null) as {status?:string;quotedPrice?:string;paymentStatus?:string;deliveryNote?:string;adminNotes?:string}|null;
  if(!body || !statuses.includes(body.status||"") || !payments.includes(body.paymentStatus||"")) return NextResponse.json({error:"Invalid order details"},{status:400});
  for(const [key,max] of [["quotedPrice",30],["deliveryNote",500],["adminNotes",1000]] as const){
    const value=body[key]; if(typeof value!=="string" || value.length>max) return NextResponse.json({error:"Invalid "+key},{status:400});
  }
  const updated=await getDb().update(orders).set({
    status:body.status!, quotedPrice:body.quotedPrice||null, paymentStatus:body.paymentStatus!,
    deliveryNote:body.deliveryNote||null, adminNotes:body.adminNotes||null,
    updatedAt:new Date().toISOString()
  }).where(eq(orders.id,id)).returning();
  if(!updated.length) return NextResponse.json({error:"Order not found"},{status:404});
  return NextResponse.json({order:updated[0]});
}
