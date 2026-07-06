const BASE_URL : string = "https://lpc0k56hgd.execute-api.us-east-1.amazonaws.com/default/Serverless-Notifier";

// Interface for the notification payload
export interface NotificationPayload {
  channel: string | string[];
  message: string;
  subject?: string;
  recipient?: string;
  level?: "info" | "warning" | "error" | "critical";
}

// Interface for log entries
export interface LogEntry {
  timestamp: string;
  message: string;
  stream: string;
}

// Interface for messages in the Dead Letter Queue (DLQ)
export interface DLQMessage {
  messageId: string;
  receiptHandle: string;
  payload: NotificationPayload;
  receivedCount: string;
}

// Function to send a notification to the server
export const sendNotification = async (payload: NotificationPayload) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
};

// Function to fetch logs from the server
export const fetchLogs = async (): Promise<LogEntry[]> => {
  const response = await fetch(`${BASE_URL}/logs`);
  const data = await response.json();
  return data.logs || [];
};

// Function to fetch messages from the Dead Letter Queue (DLQ)
export const fetchDLQMessages = async (): Promise<DLQMessage[]> => {
  const response = await fetch(`${BASE_URL}/dlq`);
  const data = await response.json();
  return data.messages || [];
};

// Function to replay a message from the DLQ
export const replayDLQMessage = async (
  receiptHandle: string,
  payload: NotificationPayload
) => {
  const response = await fetch(`${BASE_URL}/dlq/replay`, {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiptHandle, payload }),
  });
  return response.json();
};