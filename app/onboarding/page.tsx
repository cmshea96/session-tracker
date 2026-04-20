"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OnboardingPage() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log("onboarding getUser result", { user, error });

      if (!user) {
        router.push("/login");
        return;
      }

      if (user.email) {
        setContactEmail(user.email);
      }

      const savedBusinessName = user.user_metadata?.business_name;
      if (savedBusinessName) {
        setBusinessName(savedBusinessName);
      }

      setCheckingUser(false);
    }

    loadUser();
  }, [router]);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in");
      }

      if (!businessName || !contactName || !contactEmail) {
        throw new Error("Please fill in all required fields");
      }

      const parsedRoomCount =
        roomCount.trim() === "" ? 0 : parseInt(roomCount, 10);

      if (Number.isNaN(parsedRoomCount) || parsedRoomCount < 0) {
        throw new Error("Room count must be a valid number");
      }

      const { error: insertError } = await supabase.from("businesses").insert({
        owner_id: user.id,
        name: businessName,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        room_count: parsedRoomCount,
      });

      if (insertError) {
        throw insertError;
      }

      router.push("/sessions");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (checkingUser) {
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
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </main>
    );
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
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          padding: "2rem",
          borderRadius: "0.75rem",
          background: "white",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Set up your business
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#6b7280",
            marginBottom: "1.5rem",
          }}
        >
          Add your business details to finish setting up your account.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div>
            <label
              htmlFor="businessName"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Business name
            </label>
            <input
              id="businessName"
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
            <label
              htmlFor="contactName"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Contact name
            </label>
            <input
              id="contactName"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="contactEmail"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Contact email
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="contactPhone"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Contact phone
            </label>
            <input
              id="contactPhone"
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="roomCount"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Number of rooms/spaces
            </label>
            <input
              id="roomCount"
              type="number"
              min="0"
              value={roomCount}
              onChange={(e) => setRoomCount(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.6rem",
                borderRadius: "0.4rem",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#b91c1c", fontSize: "0.85rem" }}>{error}</p>
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
            {loading ? "Saving..." : "Finish setup"}
          </button>
        </form>
      </div>
    </main>
  );
}