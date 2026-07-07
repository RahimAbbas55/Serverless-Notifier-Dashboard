import { useState } from "react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import SendNotification from "./pages/SendNotification";
import Logs from "./pages/Logs";
import DLQPanel from "./pages/DLQPanel";

export default function App() {
  const [activePage, setActivePage] = useState("send");

  const renderPage = () => {
    if (activePage === "send") return <SendNotification />;
    if (activePage === "logs") return <Logs />;
    if (activePage === "dlq") return <DLQPanel />;
    return <SendNotification />;
  };

  return (
    <>
      <Toaster theme="dark" position="bottom-right" richColors />
      <div style={{ minHeight: "100vh" }}>
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        {renderPage()}
      </div>
    </>
  );
}