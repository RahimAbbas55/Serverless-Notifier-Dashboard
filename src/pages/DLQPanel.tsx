import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchDLQMessages, replayDLQMessage } from "../api/client";
import type { DLQMessage } from "../api/client";
import styles from "./DLQPanel.module.css";

export default function DLQPanel() {
  const [messages, setMessages] = useState<DLQMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replayingId, setReplayingId] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchDLQMessages();
      setMessages(data);
    } catch {
      toast.error("Failed to fetch DLQ messages");
    } finally {
      setLoading(false);
    }
  };

  const handleReplay = async (msg: DLQMessage) => {
    setReplayingId(msg.messageId);
    try {
      const result = await replayDLQMessage(msg.receiptHandle, msg.payload);
      if (result.success) {
        toast.success("Message replayed — removed from DLQ");
        setMessages(prev => prev.filter(m => m.messageId !== msg.messageId));
      } else {
        toast.error("Replay failed");
      }
    } catch {
      toast.error("Replay request failed");
    } finally {
      setReplayingId(null);
    }
  };

  useEffect(() => {
    (async () => { await loadMessages(); })();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Dead Letter Queue</h1>
          <p className={styles.subtitle}>
            Notifications that exceeded the retry limit
          </p>
        </div>
        <button className={styles.refreshBtn} onClick={loadMessages} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && <p className={styles.loading}>Fetching messages...</p>}

      {!loading && messages.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyMark}>✓</span>
          Queue is empty
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className={styles.messageList}>
          {messages.map(msg => (
            <div key={msg.messageId} className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.badges}>
                  <span className={styles.badgeFailed}>Failed</span>
                  <span className={styles.retryCount}>
                    {msg.receivedCount} attempt{msg.receivedCount !== "1" ? "s" : ""}
                  </span>
                </div>
                <span className={styles.msgId}>{msg.messageId.slice(0, 16)}…</span>
              </div>

              <div className={styles.payloadBlock}>
                <p className={styles.payloadLabel}>Payload</p>
                <pre className={styles.payloadPre}>
                  {JSON.stringify(msg.payload, null, 2)}
                </pre>
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.replayBtn}
                  onClick={() => handleReplay(msg)}
                  disabled={replayingId === msg.messageId}
                >
                  {replayingId === msg.messageId ? "Replaying…" : "Replay"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
