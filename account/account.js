// /account/account.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const SUPABASE_URL = "https://ujucoljgaklwdkcckerl.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdWNvbGpnYWtsd2RrY2NrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzQ4ODcsImV4cCI6MjA4NTc1MDg4N30.ob2SQH2Zaq2RblmCDsL3avZtwMbh5SVttUWclTTpsoU";

export const supabase = createClient(Shttps://ujucoljgaklwdkcckerl.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdWNvbGpnYWtsd2RrY2NrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzQ4ODcsImV4cCI6MjA4NTc1MDg4N30.ob2SQH2Zaq2RblmCDsL3avZtwMbh5SVttUWclTTpsoU);

export function esc(s=""){ return String(s).replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m])); }

export async function getMe(){
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function requireLogin(){
  const me = await getMe();
  if(!me){
    location.href = "/account/index.html";
    throw new Error("Not logged in");
  }
  return me;
}

export async function logout(){
  await supabase.auth.signOut();
  location.href = "/account/index.html";
}

// Lưu lịch sử xem đơn giản (giai đoạn 1) — dùng localStorage theo user email
export function logLocalView({ slug, title_vi, type }){
  const key = "dstd_local_history";
  const raw = localStorage.getItem(key);
  const arr = raw ? JSON.parse(raw) : [];
  arr.unshift({ slug, title_vi, type, at: new Date().toISOString() });
  const trimmed = arr.slice(0, 200);
  localStorage.setItem(key, JSON.stringify(trimmed));
}

export function readLocalHistory(){
  const key = "dstd_local_history";
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}
