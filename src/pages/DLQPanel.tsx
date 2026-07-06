import { useState, useEffect } from "react";
import { fetchDLQMessages, replayDLQMessage, DLQMessage } from "../api/client";

export default function DLQPanel() {
  const [messages, setMessages] = useState<DLQMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replayingId, setReplayingId] = useState<string | null>(null);
  const [replayResults, setReplayResults] = useState<Record<string, any>>({});

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDLQMessages();
      setMessages(data);
    } catch (err) {
      setError("Failed to fetch DLQ messages");
    } finally {
      setLoading(false);
    }
  };

  const handleReplay = async (msg: DLQMessage) => {
    setReplayingId(msg.messageId);
    try {
      const result = await replayDLQMessage(msg.receiptHandle, msg.payload);
      setReplayResults(prev => ({
        ...prev,
        [msg.messageId]: result
      }));
      if (result.success) {
        // Remove from list after successful replay
        setMessages(prev => prev.filter(m => m.messageId !== msg.messageId));
      }
    } catch (err) {
      setReplayResults(prev => ({
        ...prev,
        [msg.messageId]: { success: false, error: "Replay request failed" }
      }));
    } finally {
      setReplayingId(null);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 24px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 600 }}>DLQ Panel</h1>
          <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
            Failed notifications that exceeded retry limit
          </p>
        </div>
        <button
          onClick={loadMessages}
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
        <div style={{ color: "#888", fontSize: "13px" }}>
          Fetching DLQ messages...
        </div>
      )}

      {!loading && messages.length === 0 && (
        <div style={{
          padding: "24px",
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "6px",
          textAlign: "center",
          color: "#888",
          fontSize: "13px"
        }}>
          ✓ No failed messages in DLQ
        </div>
      )}

      {!loading && messages.map(msg => (
        <div
          key={msg.messageId}
          style={{
            padding: "16px",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "6px",
            marginBottom: "12px",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px"
          }}>
            <div>
              <span style={{
                fontSize: "11px",
                color: "#f87171",
                fontWeight: 600,
              }}>
                FAILED
              </span>
              <span style={{
                fontSize: "11px",
                color: "#555",
                marginLeft: "12px"
              }}>
                Retried {msg.receivedCount}x
              </span>
            </div>
            <span style={{
              fontSize: "10px",
              color: "#444",
              fontFamily: "monospace"
            }}>
              {msg.messageId.slice(0, 8)}...
            </span>
          </div>

          {/* Payload */}
          <div style={{
            background: "#0f0f0f",
            borderRadius: "4px",
            padding: "10px",
            marginBottom: "12px"
          }}>
            <div style={{ fontSize: "11px", color: "#555", marginBottom: "6px" }}>
              PAYLOAD
            </div>
            <pre style={{
              fontSize: "11px",
              color: "#ccc",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0
            }}>
              {JSON.stringify(msg.payload, null, 2)}
            </pre>
          </div>

          {/* Replay button */}
          <button
            onClick={() => handleReplay(msg)}
            disabled={replayingId === msg.messageId}
            style={{
              background: replayingId === msg.messageId ? "#2a2a2a" : "#1a3a1a",
              color: replayingId === msg.messageId ? "#888" : "#4ade80",
              border: "1px solid",
              borderColor: replayingId === msg.messageId ? "#2a2a2a" : "#2a4a2a",
              borderRadius: "6px",
              padding: "6px 16px",
              fontSize: "12px",
              cursor: replayingId === msg.messageId ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            {replayingId === msg.messageId ? "Replaying..." : "Replay"}
          </button>

          {/* Replay result */}
          {replayResults[msg.messageId] && (
            <div style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "4px",
              background: replayResults[msg.messageId].success ? "#0f2a1a" : "#2a0f0f",
              border: `1px solid ${replayResults[msg.messageId].success ? "#1a4a2a" : "#4a1a1a"}`,
              fontSize: "11px",
              color: replayResults[msg.messageId].success ? "#4ade80" : "#f87171",
            }}>
              {replayResults[msg.messageId].success
                ? "✓ Replayed successfully — message removed from DLQ"
                : `✗ Replay failed: ${replayResults[msg.messageId].error}`
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
}