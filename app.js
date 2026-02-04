// app.js — Duong Sao Toa Sang frontend (Cloudflare Pages)

// 1) CONFIG
export const SUPABASE_URL = "https://ujucoljgaklwdkcckerl.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdWNvbGpnYWtsd2RrY2NrZXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzQ4ODcsImV4cCI6MjA4NTc1MDg4N30.ob2SQH2Zaq2RblmCDsL3avZtwMbh5SVttUWclTTpsoU";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2) LANGUAGE (VI default)
export function getLang(){
  const v = localStorage.getItem("lang");
  return v === "en" ? "en" : "vi";
}
export function setLang(lang){
  localStorage.setItem("lang", lang === "en" ? "en" : "vi");
  location.reload();
}

// 3) Utils
export function esc(s=""){
  return s.replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
export function qs(name){
  return new URLSearchParams(location.search).get(name);
}

// 4) Fetch helpers
export async function fetchPageBySlug(slug){
  const { data, error } = await supabase
    .from("contents")
    .select("id,type,slug,title_vi,title_en,content_vi,content_en,custom_code,status,updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if(error) throw error;
  return data;
}

export async function fetchLatestPosts(limit=12){
  const { data, error } = await supabase
    .from("contents")
    .select("id,type,slug,title_vi,title_en,content_vi,content_en,status,updated_at")
    .eq("type", "post")
    .eq("status", "published")
    .order("updated_at", { ascending:false })
    .limit(limit);

  if(error) throw error;
  return data || [];
}

// 5) Render custom_code safely inside an iframe
// - Không chèn thẳng vào DOM để tránh phá site
export function renderCustomCode(container, code){
  if(!code || !code.trim()) return;

  const wrap = document.createElement("div");
  wrap.className = "card";
  wrap.innerHTML = `
    <div class="small muted">Embedded Block</div>
    <iframe class="embed" sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"></iframe>
  `;

  const iframe = wrap.querySelector("iframe");
  // srcdoc: code chạy bên trong iframe, không đụng site chính
  iframe.srcdoc = `
    <!doctype html>
    <html><head><meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <style>body{margin:0;font-family:system-ui;background:transparent;color:#111}</style>
    </head>
    <body>
      ${code}
    </body></html>
  `;

  container.appendChild(wrap);
}
