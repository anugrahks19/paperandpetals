import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
export async function isAdmin(){
  const user=await getChatGPTUser();
  const allowed=(env.ADMIN_EMAILS || "").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
  return !!user && allowed.includes(user.email.toLowerCase());
}
