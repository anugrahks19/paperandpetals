import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { z } from "zod";

const schema=z.object({
  name:z.string().trim().min(2).max(100),
  email:z.string().email().max(200),
  phone:z.string().trim().min(7).max(25),
  product:z.enum(["Handmade cards","Thoughtful gift boxes","Mini paintings","Something else"]),
  occasion:z.string().trim().min(2).max(100),
  neededBy:z.string().max(30).optional().nullable(),
  budget:z.string().max(80).optional().nullable(),
  notes:z.string().trim().min(10).max(2000),
  website:z.string().optional()
});
export async function POST(request:Request){
  try {
    const raw=await request.json();
    const parsed=schema.safeParse(raw);
    if(!parsed.success) return NextResponse.json({error:"Please check the form details and try again."},{status:400});
    if(parsed.data.website) return NextResponse.json({ok:true});
    const {website,...data}=parsed.data;
    const id=crypto.randomUUID();
    await getDb().insert(orders).values({id,...data,neededBy:data.neededBy||null,budget:data.budget||null,status:"new"});
    return NextResponse.json({ok:true,id},{status:201});
  } catch { return NextResponse.json({error:"We could not save your request. Please try again."},{status:500}); }
}
export async function GET(){
  if(!await isAdmin()) return NextResponse.json({error:"Forbidden"},{status:403});
  const rows=await getDb().select().from(orders).orderBy(desc(orders.createdAt));
  return NextResponse.json({orders:rows});
}

