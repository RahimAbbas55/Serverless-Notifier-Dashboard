import { useState, useEffect } from "react";
import { fetchLogs, LogEntry } from "../api/client";

const LEVEL_COLORS: Record<string, string> = {
  INFO: "#4ade80",
  WARNING: "#facc15",
  ERROR: "#f87171",
  CRITICAL: "#c084fc",
};

function getLevelFromMessage(message: string): string {
  if (message.includes("[INFO]")) return "INFO";
  if (message.includes("[WARNING]")) return "WARNING";
  if (message.includes("[ERROR]")) return "ERROR";
  if (message.includes("[CRITICAL]")) return "CRITICAL";
  return "INFO";
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogs();
      setLogs(data);
    } catch (err) {
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 24px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <h1 style={{ fontSize: "18px", fontWeight: 600 }}>Logs</h1>
        <button
          onClick={loadLogs}
          disabled={loading}
          style={{
            background: "#1a1a1a",
            color: "#888",
            border: "1px solid #2a2a2a",
            borderRadius: "6px",
            padding: "6px 14px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div style={{
          padding: "12px",
          background: "#2a0f0f",
          border: "1px solid #4a1a1a",
          borderRadius: "6px",
          color: "#f87171",
          fontSize: "13px",
          marginBottom: "16px"
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ color: "#888", fontSize: "13px" }}>Fetching logs...</div>
      )}

      {!loading && logs.length === 0 && (
        <div style={{ color: "#888", fontSize: "13px" }}>No logs found.</div>
      )}

      {!loading && logs.map((log, index) => {
        const level = getLevelFromMessage(log.message);
        const color = LEVEL_COLORS[level] || "#888";
        return (
          <div
            key={index}
            style={{
              padding: "12px 16px",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              marginBottom: "8px",
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px"
            }}>
              <span style={{
                fontSize: "11px",
                color: color,
                fontWeight: 600,
              }}>
                {level}
              </span>
              <span style={{ fontSize: "11px", color: "#555" }}>
                {log.timestamp}
              </span>
            </div>
            <div style={{
              fontSize: "12px",
              color: "#ccc",
              wordBreak: "break-word",
              lineHeight: "1.5"
            }}>
              {log.message}
            </div>
          </div>
        );
      })}
    </div>
  );
}