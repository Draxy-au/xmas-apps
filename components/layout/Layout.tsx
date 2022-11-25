import Link from "next/link";
import { ReactNode, useContext } from "react";
import NotificationContext from "../../contexts/notificationContext";
import NavMenu from "../navMenu/NavMenu";
import Notification from "../notification/Notification";
import HomeIcon from "@mui/icons-material/Home";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  const { notification, display } = useContext(NotificationContext);

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Link href='/'>
          <span className={styles.logo}>
            <HomeIcon />
            <span>
              <span style={{ color: "#3de76d" }}>X</span>
              <span style={{ color: "rgb(226, 112, 112)" }}>m</span>
              <span style={{ color: "#3DD1E7" }}>a</span>
              <span style={{ color: "yellow" }}>s</span>
              <span style={{ color: "rgb(226, 112, 112)" }}> A</span>
              <span style={{ color: "#3de76d" }}>p</span>
              <span style={{ color: "#3DD1E7" }}>p</span>
              <span style={{ color: "yellow" }}>s</span>
            </span>
          </span>
        </Link>
        <NavMenu />
      </div>
      <div>{children}</div>
      {display ? (
        <Notification
          title={notification ? notification.title : ""}
          status={notification ? notification.status : ""}
          text={notification ? notification.text : ""}
        />
      ) : null}
    </div>
  );
}

export default Layout;
