import { useEffect } from "react";
import { supabase } from "../lib/supabase";
export function useSupabaseDeepLink(){
  useEffect(()=>{
    const handleCode=async(code:string)=>{ try{ await supabase.auth.exchangeCodeForSession(code);}catch{} };
    (window as any).electronAPI?.getPendingSupabaseCode?.().then((c:string|null)=>{ if(c) void handleCode(c); }).catch(()=>{});
    const unsub=(window as any).electronAPI?.onSupabaseOAuthCode?.((c:string)=>{ void handleCode(c); });
    const hash=window.location.hash;
    if(hash.includes("code=")){ const p=new URLSearchParams(hash.slice(1)); const c=p.get("code"); if(c) void handleCode(c); }
    return ()=>{ if(typeof unsub==="function") unsub(); };
  },[]);
}
