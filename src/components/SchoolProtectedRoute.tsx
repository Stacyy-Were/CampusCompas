import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export default function SchoolProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setStatus("denied");
      return;
    }

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setStatus(user ? "allowed" : "denied");
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
