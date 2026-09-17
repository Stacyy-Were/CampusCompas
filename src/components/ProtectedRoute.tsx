import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "admin" | "denied">("loading");

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setStatus("denied");
      return;
    }

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("denied");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setStatus(profile?.role === "admin" ? "admin" : "denied");
    })();
  }, []);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <p className="font-mono text-xs text-white/50">Checking access...</p>
      </main>
    );
  }

  if (status === "denied") return <Navigate to="/login" replace />;

  return <>{children}</>;
}
