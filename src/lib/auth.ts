import { supabase } from "./supabase";
import { openExternalLink } from "../utils/externalLinks";
export const AUTH_URL = (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.VITE_AUTH_URL || "";
export const authClient: any = null;
export type SocialProvider = "google";
export function updateLastSignInTime(): void {}
export function isWithinGracePeriod(): boolean { return false; }
export function getGracePeriodRemainingMs(): number { return 0; }
export async function signOut(): Promise<void> { try{await supabase.auth.signOut();}catch{} try{await (window as any).electronAPI?.authClearSession?.();}catch{} try{localStorage.setItem("isSignedIn","false");}catch{} }
export async function withSessionRefresh<T>(op:()=>Promise<T>):Promise<T>{return op();}
export async function signInWithSocial(provider: SocialProvider): Promise<{error?:Error}>{
  if(provider!=="google") return {error:new Error("Only Google sign-in is supported")};
  try{
    const isElectron=Boolean((window as any).electronAPI);
    const protocol= (isElectron? ((await (window as any).electronAPI?.getOAuthProtocol?.())||"mcb-whisper") : "");
    const redirectTo=isElectron? `${protocol}://auth/callback` : `${window.location.origin}/`;
    if(isElectron){
      const {data,error}=await supabase.auth.signInWithOAuth({provider:"google", options:{redirectTo, skipBrowserRedirect:true} as any});
      if(error) return {error: error as any};
      if((data as any)?.url) openExternalLink((data as any).url);
      return {};
    }
    const {error}=await supabase.auth.signInWithOAuth({provider:"google", options:{redirectTo} as any});
    if(error) return {error: error as any};
    return {};
  }catch(e){ return {error: e instanceof Error? e : new Error("Google sign-in failed")} }
}
export async function signInWithSSO(_e:string):Promise<{error?:Error}>{ return {error:new Error("SSO is disabled — please use Google")} }
export async function requestPasswordReset(_e:string):Promise<{error?:Error}>{ return {error:new Error("Password reset disabled — use Google")} }
export interface AuthActionError extends Error{ code?:string }
export async function updateDisplayName(_n:string):Promise<{error?:AuthActionError}>{ return {error:new Error("Not implemented") as AuthActionError} }
export async function changePassword(_p:any):Promise<{error?:AuthActionError}>{ return {error:new Error("Not implemented") as AuthActionError} }
export const ADMIN_URL=(import.meta as any).env?.VITE_ADMIN_URL||"";
export async function openAdminConsole():Promise<void>{ if(ADMIN_URL) openExternalLink(ADMIN_URL); }
export async function hasCredentialAccount():Promise<boolean>{return false;}
