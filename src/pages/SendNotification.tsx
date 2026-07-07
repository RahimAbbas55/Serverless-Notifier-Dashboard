import { useState } from "react";
import { toast } from "sonner";
import { sendNotification } from "../api/client";
import type { NotificationPayload } from "../api/client";
import styles from "./SendNotification.module.css";

const LEVELS = ["info", "warning", "error", "critical"] as const;
const CHANNELS = ["slack", "email", "both"] as const;

export default function SendNotification() {
  const [channel, setChannel] = useState<typeof CHANNELS[number]>("slack");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [level, setLevel] = useState<typeof LEVELS[number]>("info");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const payload: NotificationPayload = {
      channel: channel === "both" ? ["email", "slack"] : channel,
      message,
      level,
      ...(subject && { subject }),
      ...(recipient && { recipient }),
    };

    try {
      await sendNotification(payload);
      toast.success("Notification sent");
      setMessage("");
      setSubject("");
      setRecipient("");
    } catch {
      toast.error("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Send Notification</h1>
        <p className={styles.subtitle}>Dispatch a message via Slack, email, or both</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div>
            <label className={styles.label}>Channel</label>
            <div className={styles.segGroup}>
              {CHANNELS.map(c => (
                <button
                  key={c}
                  className={`${styles.segBtn}${channel === c ? ` ${styles.segActive}` : ""}`}
                  onClick={() => setChannel(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={styles.label}>Level</label>
            <div className={styles.segGroup}>
              {LEVELS.map(l => (
                <button
                  key={l}
                  className={`${styles.segBtn} ${styles.segBtnLevel} ${l}${level === l ? ` ${styles.segActive}` : ""}`}
                  onClick={() => setLevel(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={styles.label}>Subject</label>
            <input
              type="text"
              className={styles.input}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. High CPU usage detected"
            />
          </div>

          {(channel === "email" || channel === "both") && (
            <div>
              <label className={styles.label}>Recipient Email</label>
              <input
                type="email"
                className={styles.input}
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="someone@example.com"
              />
            </div>
          )}

          <div>
            <label className={styles.label}>Message</label>
            <textarea
              className={styles.textarea}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Notification body..."
              rows={4}
            />
          </div>
        </div>

        <div className={styles.cardFooter}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}