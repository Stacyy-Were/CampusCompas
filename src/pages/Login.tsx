import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      navigate("/admin");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      setMessage("Account created successfully. Check your email to confirm your account, then log in.");
      setIsLogin(true);
      setFullName("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-white"
      style={{
        backgroundImage: "url('/public/vivash-s-94bcf09b74d7b7735f21e4c27b4d4c71.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none fixed inset-0 bg-black/60" />
      <Navbar />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/15 bg-black/35 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-6 flex rounded-full border border-white/15 bg-black/30 p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-full px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] transition ${
              isLogin ? "bg-white text-black" : "text-white/60"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-full px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] transition ${
              !isLogin ? "bg-white text-black" : "text-white/60"
            }`}
          >
            Sign up
          </button>
        </div>

        <h1 className="font-mono text-2xl">{isLogin ? "Welcome back" : "Create an account"}</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {!isLogin && (
            <input
              required
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 font-mono text-sm placeholder-white/30"
            />
          )}

          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 font-mono text-sm placeholder-white/30"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 font-mono text-sm placeholder-white/30"
          />

          {!isLogin && (
            <input
              required
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 font-mono text-sm placeholder-white/30"
            />
          )}

          {error && <p className="font-mono text-xs text-red-400">{error}</p>}
          {message && <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 font-mono text-xs text-emerald-300">{message}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-white px-6 py-2.5 font-mono text-sm text-black transition hover:scale-105"
          >
            {isLogin ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-xs text-white/60">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setMessage("");
              setFullName("");
              setConfirmPassword("");
            }}
            className="text-white underline underline-offset-4"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </main>
  );
}
