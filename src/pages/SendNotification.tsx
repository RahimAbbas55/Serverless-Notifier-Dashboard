import { useState } from "react";
import { sendNotification } from "../api/client";
import type { NotificationPayload } from "../api/client";

const LEVELS = ["info", "warning", "error", "critical"] as const;
const CHANNELS = ["slack", "email", "both"] as const;

export default function SendNotification() {
  const [channel, setChannel] = useState("slack");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [level, setLevel] = useState<"info" | "warning" | "error" | "critical">("info");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    const payload: NotificationPayload = {
      channel: channel === "both" ? ["email", "slack"] : channel,
      message,
      level,
      ...(subject && { subject }),
      ...(recipient && { recipient }),
    };

    try {
      const data = await sendNotification(payload);
      setResult({ success: true, data });
    } catch (err) {
      setResult({ success: false, error: "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "6px",
    padding: "8px 12px",
    color: "#e0e0e0",
    fontSize: "13px",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "12px",
    color: "#888",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div style={{ maxWidth: "520px", margin: "40px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "24px" }}>
        Send Notification
      </h1>

      {/* Channel */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Channel</label>
        <select
          value={channel}
          onChange={e => setChannel(e.target.value)}
          style={inputStyle}
        >
          {CHANNELS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Level */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Level</label>
        <select
          value={level}
          onChange={e => setLevel(e.target.value as any)}
          style={inputStyle}
        >
          {LEVELS.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Alert subject"
          style={inputStyle}
        />
      </div>

      {/* Recipient — only show if email */}
      {(channel === "email" || channel === "both") && (
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Recipient Email</label>
          <input
            type="email"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            placeholder="someone@example.com"
            style={inputStyle}
          />
        </div>
      )}

      {/* Message */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Message</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Notification message..."
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !message}
        style={{
          background: loading ? "#2a2a2a" : "#ffffff",
          color: loading ? "#888" : "#000000",
          border: "none",
          borderRadius: "6px",
          padding: "10px 20px",
          fontSize: "13px",
          fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      {/* Result */}
      {result && (
        <div style={{
          marginTop: "16px",
          padding: "12px",
          borderRadius: "6px",
          background: result.success ? "#0f2a1a" : "#2a0f0f",
          border: `1px solid ${result.success ? "#1a4a2a" : "#4a1a1a"}`,
          fontSize: "12px",
          color: result.success ? "#4ade80" : "#f87171",
        }}>
          {result.success ? "✓ Sent successfully" : "✗ Failed to send"}
          <pre style={{
            marginTop: "8px",
            whiteSpace: "pre-wrap",
            color: "#888",
            fontSize: "11px"
          }}>
            {JSON.stringify(result.data || result.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}