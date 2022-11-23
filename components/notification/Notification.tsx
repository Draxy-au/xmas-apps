import { useEffect, useState } from "react";
import { Notification } from "../../types/types";
import styles from "./Notification.module.css";

function Notification({ title, status, text }: Notification) {
  const [notifBG, setNotifBG] = useState("green");

  useEffect(() => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        setNotifBG("green");
        break;
      case "PENDING":
        setNotifBG("orange");
        break;
      case "ERROR":
        setNotifBG("red");
        break;
      default:
        break;
    }
  }, [status]);

  return (
    <div className={styles.notification} style={{ backgroundColor: notifBG }}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.status}>{status}</div>
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
}

export default Notification;
