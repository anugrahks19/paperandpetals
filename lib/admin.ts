import { getAuth } from "@/lib/auth/server";
export async function isAdmin(){
  const { data: session } = await getAuth().getSession();
  return session?.user?.emailVerified===true && isAdminEmail(session.user.email);
}
export function isAdminEmail(email?:string|null){
  const allowed=(process.env.ADMIN_EMAILS || "").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
  return !!email && allowed.includes(email.toLowerCase());
}
