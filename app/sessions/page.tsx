import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type SessionRow = {
  id: number;
  room_name: string;
  check_in: string;
  check_out: string | null;
  duration_minutes: number | null;
  business_id?: string | null;
};

export default async function SessionsPage() {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("check_in", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <main style={{ maxWidth: 960, margin: "2rem auto", fontFamily: "sans-serif" }}>
        <h1>Sessions</h1>
        <p style={{ color: "red" }}>Error: {error.message}</p>
      </main>
    );
  }

  const sessions = (data ?? []) as SessionRow[];

  const totalSessions = sessions.length;
  const totalMinutes = sessions
    .filter((s) => s.duration_minutes != null)
    .reduce((sum, s) => sum + (s.duration_minutes as number), 0);
  const avgMinutes = totalSessions > 0 ? totalMinutes / totalSessions : 0;

  const activeNow = sessions.filter((s) => !s.check_out).length;

  return (
    <main style={{ maxWidth: 960, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Sessions Dashboard</h1>

      {/* Summary cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#666" }}>Total sessions</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>{totalSessions}</div>
        </div>

        <div
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#666" }}>Average duration</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>
            {avgMinutes.toFixed(1)} min
          </div>
        </div>

        <div
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#666" }}>Active right now</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 600 }}>{activeNow}</div>
        </div>
      </section>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1.5rem",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>ID</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Business</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Room</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Check-in</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Check-out</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Duration (min)</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{s.id}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {s.business_id ?? "—"}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{s.room_name}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {new Date(s.check_in).toLocaleString()}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {s.check_out ? new Date(s.check_out).toLocaleString() : "—"}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {s.duration_minutes != null ? s.duration_minutes.toFixed(1) : "—"}
              </td>
            </tr>
          ))}
          {sessions.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
                No sessions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
