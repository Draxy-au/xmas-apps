import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import styles from "./NavMenu.module.css";

function NavMenu() {
  const { data: session, status } = useSession();

  function handleLogout() {
    signOut();
  }

  return (
    <nav className={styles.navMenu}>
      <ul>
        {session && status === "authenticated" ? (
          <li>
            <Link href='/profile'>Profile</Link>
          </li>
        ) : null}
        {!session ? (
          <li>
            <Link href='/signin'>
              <button className={styles.login}>Login</button>
            </Link>
          </li>
        ) : (
          <li>
            <button className={styles.logout} onClick={() => handleLogout()}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavMenu;
