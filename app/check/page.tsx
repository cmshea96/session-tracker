"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CheckPage() {
  const [room, setRoom] = useState<string | null>(null);
  const [message, setMessage] = useState("Processing...");
  const [error, setError] = useState<string | null>(null);

  // Read ?room= from the browser URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");

    if (!roomParam) {
      setError("Missing room in QR code URL.");
    } else {
      setRoom(roomParam);
    }
  }, []);

  // Once we know the room, talk to Supabase
  useEffect(() => {
    if (!room) return;
    const run = async () => {
      try {
        // 1. Look for an open session for this room
        const { data: openSessions, error: openError } = await supabase
          .from("sessions")
          .select("*")
          .eq("room_name", room)
          .is("check_out", null)
          .limit(1);

        if (openError) {
          setError(openError.message);
          return;
        }

        if (openSessions && openSessions.length > 0) {
          // 2. If open session exists, check OUT
          const session = openSessions[0];
          const now = new Date().toISOString();

          const { error: updateError } = await supabase
            .from("sessions")
            .update({ check_out: now })
            .eq("id", session.id);

          if (updateError) {
            setError(updateError.message);
            return;
          }

          setMessage(`Checked OUT of ${room}. Session ID: ${session.id}`);
        } else {
          // 3. No open session → check IN
          const { data: newSession, error: insertError } = await supabase
            .from("sessions")
            .insert({ room_name: room })
            .select()
            .single();

          if (insertError) {
            setError(insertError.message);
            return;
          }

          setMessage(`Checked IN to ${room}. Session ID: ${newSession?.id}`);
        }
      } catch (err: any) {
        setError(err.message ?? "Unexpected error");
      }
    };

    run();
  }, [room]);

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "2rem auto",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h1>Session Tracker</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <p>{message}</p>
          <p>You can close this tab now.</p>
        </>
      )}
    </main>
  );
}
