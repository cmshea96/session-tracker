"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password || !businessName) {
        throw new Error("Please fill in all fields");
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If email confirmation is off, user should have a session and can go straight to onboarding
      if (data.session) {
        router.push("/onboarding");
        return;
      }

      // If email confirmation is on, send them to login with a friendly message later if needed
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "2rem",
          borderRadius: "0.75rem",
          background: "white",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Sign up
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "1.5rem" }}>
          Create an account for your business to start tracking sessions.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div>
            abel
              htmlFor="business"
              style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}
            >
              Business name
            </label>
            <input
              id="business"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div>
            abel
              htmlFor="email"
              style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}
            >
              Work email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              style={{
                width: "100%",
                padding: "0.5rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div>
            abel
              htmlFor="password"
              style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: "0.5rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.6rem 0.8rem",
              borderRadius: "0.4rem",
              border: "none",
              background: loading ? "#6b7280" : "#111827",
              color: "white",
              fontWeight: 500,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.85rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{ color: "#111827", fontWeight: 500, textDecoration: "none" }}
          >
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}