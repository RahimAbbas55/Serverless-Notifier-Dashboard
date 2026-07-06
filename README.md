# Serverless Notifier Dashboard

A minimal React dashboard for the [Serverless Notification System](https://github.com/RahimAbbas55/Serverless-Notification-System). Send notifications, monitor CloudWatch logs, and manage failed messages from a Dead Letter Queue — all from one UI.

---

## Features

- **Send Notification** — form to fire Email and/or Slack alerts with level and subject
- **Logs Viewer** — live CloudWatch log entries color-coded by level
- **DLQ Panel** — inspect failed notifications and replay them with one click

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Inline styles (zero dependencies) |
| HTTP | Fetch API |
| Deployment | AWS S3 + Static Hosting |

---

## Project Structure

```
notifier-dashboard/
├── src/
│   ├── api/
│   │   └── client.ts           # All API calls in one place
│   ├── components/
│   │   └── Navbar.tsx          # Navigation bar
│   ├── pages/
│   │   ├── SendNotification.tsx  # Send notification form
│   │   ├── Logs.tsx              # CloudWatch log viewer
│   │   └── DLQPanel.tsx          # DLQ message inspector + replay
│   ├── App.tsx                  # Root component + page routing
│   ├── main.tsx
│   └── index.css
├── .gitignore
└── README.md
```

---

## Prerequisites

- Node.js 18+
- The backend [Serverless Notification System](https://github.com/RahimAbbas55/Serverless-Notification-System) deployed on AWS Lambda
- API Gateway endpoint URL

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/RahimAbbas55/Serverless-Notifier-Dashboard.git
cd Serverless-Notifier-Dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set your API endpoint

Open `src/api/client.ts` and update `BASE_URL`:

```typescript
const BASE_URL = "https://your-api-id.execute-api.your-region.amazonaws.com/default/Serverless-Notifier";
```

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Pages

### Send Notification

Fill in the form and hit Send. The recipient field appears automatically when Email is selected.

| Field | Required | Description |
|---|---|---|
| Channel | Yes | Slack, Email, or Both |
| Level | Yes | info, warning, error, critical |
| Subject | No | Email subject + Slack header |
| Recipient | Email only | Destination email address |
| Message | Yes | Notification body |

### Logs

Fetches the 20 most recent CloudWatch log entries from your Lambda function. Color coded by level — green for info, yellow for warning, red for error, purple for critical. Hit Refresh to reload.

### DLQ Panel

Shows messages that failed all 3 retry attempts. Each message shows:
- Payload that failed
- How many times it was retried
- A Replay button — resends the notification and removes it from the DLQ on success

---

## Deploy to S3

### 1. Build

```bash
npm run build
```

### 2. Create S3 bucket

1. Go to **AWS Console → S3 → Create bucket**
2. Name it e.g. `notifier-dashboard-ui`
3. Uncheck **Block all public access**
4. Enable **Static website hosting** under Properties
5. Set index document to `index.html`

### 3. Upload build output

```bash
aws s3 sync dist/ s3://notifier-dashboard-ui --delete
```

### 4. Set bucket policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::notifier-dashboard-ui/*"
    }
  ]
}
```

Your dashboard will be live at the S3 static website endpoint shown in the bucket Properties tab.

---

## API Endpoints Used

| Method | Path | Description |
|---|---|---|
| `POST` | `/Serverless-Notifier` | Send notification |
| `GET` | `/Serverless-Notifier/logs` | Fetch CloudWatch logs |
| `GET` | `/Serverless-Notifier/dlq` | Fetch DLQ messages |
| `POST` | `/Serverless-Notifier/dlq/replay` | Replay failed message |

---

## Related

- **Backend:** [Serverless-Notification-System](https://github.com/RahimAbbas55/Serverless-Notification-System) — Python + AWS Lambda

---

## Author

**Rahim Abbas**
Backend Engineer · AI Automation
[GitHub](https://github.com/RahimAbbas55) · [LinkedIn](https://www.linkedin.com/in/rahim-abbas-b5520b258/)
