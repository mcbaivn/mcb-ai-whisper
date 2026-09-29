import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";
export function useAuth(){
  const [session,setSession]=useState<Session|null>(null);
  const [isLoaded,setIsLoaded]=useState(false);
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ setSession(data.session??null); setIsLoaded(true); });
    const {data:sub}=supabase.auth.onAuthStateChange((_e,ns)=>{ setSession(ns); setIsLoaded(true); });
    return ()=>sub.subscription.unsubscribe();
  },[]);
  const user: any = session?.user ? {...session.user, name: (session.user.user_metadata?.full_name as string)||(session.user.user_metadata?.name as string)||session.user.email||"", emailVerified: Boolean(session.user.email_confirmed_at)} : null;
  return { isSignedIn: Boolean(session?.user), isGracePeriodOnly:false, isLoaded, session: session?{user,session}:null, user, refetch: async()=>{ const {data}=await supabase.auth.getSession(); setSession(data.session??null);} };
}
