"use client";

import { useState } from "react";
import { useQRCode } from "next-qrcode";

const BASE_URL =
  "https://session-tracker-44zpsorxo-cmshea96s-projects.vercel.app";

export default function QRGeneratorPage() {
  const { Canvas } = useQRCode();
  const [roomName, setRoomName] = useState("");
  const [finalUrl, setFinalUrl] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!roomName) return;
    const encodedRoom = encodeURIComponent(roomName);
    const url = `${BASE_URL}/check?room=${encodedRoom}`;
    setFinalUrl(url);
  };

  return (
    <main
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h1>Room QR Generator</h1>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Room name
      </label>
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room A"
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />

      <button onClick={handleGenerate} disabled={!roomName}>
        Generate QR
      </button>

      {finalUrl && (
        <section style={{ marginTop: "1.5rem" }}>
          <p style={{ wordBreak: "break-all" }}>{finalUrl}</p>
          <div style={{ marginTop: "1rem" }}>
            <Canvas
              text={finalUrl}
              options={{
                errorCorrectionLevel: "M",
                margin: 2,
                scale: 6,
              }}
            />
          </div>
          <p style={{ marginTop: "0.5rem" }}>
            Right-click the QR and save it as an image.
          </p>
        </section>
      )}
    </main>
  );
}
