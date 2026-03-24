"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type SessionRow = {
  id: number;
  room_name: string;
  check_in: string;
  check_out: string | null;
  duration_minutes: number | null;
};

export default function HomePage() {
  const [roomName, setRoomName] = useState("");
  const [currentSession, setCurrentSession] = useState<SessionRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("sessions")
        .insert({ room_name: roomName })
        .select()
        .single();

      if (error) throw error;
      setCurrentSession(data as SessionRow);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentSession) return;
    try {
      setLoading(true);
      setError("");

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("sessions")
        .update({ check_out: now })
        .eq("id", currentSession.id)
        .select()
        .single();

      if (error) throw error;
      setCurrentSession(data as SessionRow);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Session Tracker</h1>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Room name
      </label>
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room A"
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={handleCheckIn}
          disabled={loading || !roomName}
          style={{ marginRight: "0.5rem" }}
        >
          Check in
        </button>
        <button
          onClick={handleCheckOut}
          disabled={loading || !currentSession || !!currentSession.check_out}
        >
          Check out
        </button>
      </div>

      {loading && <p>Working...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {currentSession && (
        <section style={{ marginTop: "1rem" }}>
          <h2>Current session</h2>
          <p>ID: {currentSession.id}</p>
          <p>Room: {currentSession.room_name}</p>
          <p>Check-in: {new Date(currentSession.check_in).toLocaleString()}</p>
          <p>
            Check-out:{" "}
            {currentSession.check_out
              ? new Date(currentSession.check_out).toLocaleString()
              : "—"}
          </p>
          <p>Duration (minutes): {currentSession.duration_minutes ?? "—"}</p>
        </section>
      )}
    </main>
  );
}
