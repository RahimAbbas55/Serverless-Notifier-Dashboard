interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const links = [
    { id: "send", label: "Send Notification" },
    { id: "logs", label: "Logs" },
    { id: "dlq", label: "DLQ Panel" },
  ];

  return (
    <nav style={{
      background: "#1a1a1a",
      borderBottom: "1px solid #2a2a2a",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      height: "52px"
    }}>
      <span style={{
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "14px",
        marginRight: "24px"
      }}>
        Notifier
      </span>

      {links.map(link => (
        <button
          key={link.id}
          onClick={() => setActivePage(link.id)}
          style={{
            background: activePage === link.id ? "#2a2a2a" : "transparent",
            color: activePage === link.id ? "#ffffff" : "#888",
            border: "none",
            padding: "6px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: activePage === link.id ? 500 : 400,
          }}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
}