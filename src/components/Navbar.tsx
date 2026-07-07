import styles from "./Navbar.module.css";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const links = [
  { id: "send", label: "Send" },
  { id: "logs", label: "Logs" },
  { id: "dlq", label: "DLQ" },
];

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>N</span>
        <span className={styles.logoText}>Notifier</span>
      </div>
      {links.map(link => (
        <button
          key={link.id}
          onClick={() => setActivePage(link.id)}
          className={`${styles.link}${activePage === link.id ? ` ${styles.active}` : ""}`}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
}