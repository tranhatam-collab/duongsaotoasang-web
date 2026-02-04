import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ujucoljgaklwdkcckerl.supabase.co";
const SUPABASE_ANON_KEY = "PASTE_ANON_KEY_HERE"; // dùng anon key của anh

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function esc(s=""){ return String(s).replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m])); }

export async function requireMember(roles=["founder","core","editor","local"]) {
  const { data: sess } = await supabase.auth.getSession();
  if(!sess?.session) { location.href = "/member/index.html"; return null; }

  const user = sess.session.user;
  const email = user.email;

  // check role from profiles
  const { data, error } = await supabase.from("profiles").select("role,email").eq("id", user.id).maybeSingle();
  if(error || !data?.role || !roles.includes(data.role)) {
    await supabase.auth.signOut();
    location.href = "/member/index.html?denied=1";
    return null;
  }
  return { role: data.role, email };
}
