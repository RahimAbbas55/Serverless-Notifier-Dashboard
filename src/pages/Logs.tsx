import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchLogs } from "../api/client";
import type { LogEntry } from "../api/client";
import styles from "./Logs.module.css";

type LogLevel = "info" | "warning" | "error" | "critical";

function parseLevel(message: string): LogLevel {
  if (message.includes("[CRITICAL]")) return "critical";
  if (message.includes("[ERROR]"))    return "error";
  if (message.includes("[WARNING]"))  return "warning";
  return "info";
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchLogs();
      setLogs(data);
    } catch {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await loadLogs(); })();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.title}>Logs</h1>
          {!loading && (
            <p className={styles.meta}>{logs.length} entr{logs.length === 1 ? "y" : "ies"}</p>
          )}
        </div>
        <button className={styles.refreshBtn} onClick={loadLogs} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && <p className={styles.loading}>Fetching logs...</p>}

      {!loading && logs.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>○</span>
          No logs found
        </div>
      )}

      {!loading && logs.length > 0 && (
        <div className={styles.logList}>
          {logs.map((log, i) => {
            const level = parseLevel(log.message);
            return (
              <div key={i} className={`${styles.logEntry} ${styles[level]}`}>
                <div className={styles.logMeta}>
                  <span className={`${styles.logLevel} ${styles[level]}`}>{level}</span>
                  <span className={styles.logTime}>{log.timestamp}</span>
                </div>
                <p className={styles.logMessage}>{log.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}