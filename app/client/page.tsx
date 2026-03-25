import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type SessionRow = {
  id: number;
  room_name: string;
  check_in: string;
  check_out: string | null;
  duration_minutes: number | null;
  business_id: string | null;
};

export default async function ClientPage(props: {
  searchParams: { business_id?: string };
}) {
  const businessId = props.searchParams.business_id;

  if (!businessId) {
    return (
      <main style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif" }}>
        <h1>Client Sessions</h1>
        <p>Please open this link with a ?business_id=... in the URL.</p>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("business_id", businessId)
    .order("check_in", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <main style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif" }}>
        <h1>Client Sessions</h1>
        <p style={{ color: "red" }}>Error: {error.message}</p>
      </main>
    );
  }

  const sessions = (data ?? []) as SessionRow[];

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Client Sessions</h1>
      <p style={{ marginTop: "0.5rem", color: "#555" }}>
        Business: <strong>{businessId}</strong>
      </p>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Room</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Check-in</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Check-out</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{s.room_name}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {new Date(s.check_in).toLocaleString()}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {s.check_out ? new Date(s.check_out).toLocaleString() : "—"}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {s.duration_minutes != null ? `${s.duration_minutes.toFixed(1)} min` : "—"}
              </td>
            </tr>
          ))}
          {sessions.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
                No sessions yet for this business.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
