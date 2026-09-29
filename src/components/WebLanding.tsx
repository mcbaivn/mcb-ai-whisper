import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { signInWithSocial } from "../lib/auth";

export default function WebLanding() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleGoogle = async () => {
    setError(null);
    const r = await signInWithSocial("google");
    if (r.error) setError(r.error.message);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
        <p className="text-sm text-white/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white px-6">
      <div className="flex size-14 items-center justify-center rounded-2xl shadow-lg" style={{ background: "linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v10M9 10v4M15 9v6" />
        </svg>
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">MCB AI Whisper</h1>
      <p className="mt-2 text-sm text-white/60 text-center max-w-sm">
        {session ? "Bạn đã đăng nhập. Mở app desktop để sử dụng dictation." : "Đăng nhập bằng Google để đồng bộ. App chạy trên máy — web chỉ để đăng nhập."}
      </p>

      {!session ? (
        <div className="mt-8 w-full max-w-[360px]">
          <button
            onClick={handleGoogle}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-[#1f1f1f] shadow-sm hover:bg-zinc-100"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          {error && <p className="mt-3 text-xs text-red-400 text-center">{error}</p>}
          <p className="mt-6 text-center text-xs text-white/40">Bằng việc tiếp tục, bạn đồng ý với Terms & Privacy Policy</p>
        </div>
      ) : (
        <div className="mt-8 w-full max-w-[360px] text-center">
          <p className="text-sm text-white/80 break-all">{session.user.email}</p>
          <p className="mt-2 text-xs text-white/40">Phiên đã lưu — app desktop sẽ tự nhận sau khi bạn đăng nhập trên web (nếu app gọi SSO).</p>
          <button onClick={handleSignOut} className="mt-6 text-sm text-white/60 hover:text-white underline underline-offset-4">Đăng xuất</button>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-start">
            <p className="text-xs font-medium text-white/80">Chưa cài app?</p>
            <p className="mt-1 text-xs text-white/50">Tải bản desktop tại GitHub Releases và đăng nhập lại bằng cùng Google account.</p>
            <a href="https://github.com/mcbaivn/mcb-ai-whisper/releases" target="_blank" rel="noreferrer" className="mt-3 inline-flex h-8 items-center rounded-full bg-white px-4 text-xs font-medium text-black hover:bg-zinc-100">Mở Releases</a>
          </div>
        </div>
      )}
    </div>
  );
}
