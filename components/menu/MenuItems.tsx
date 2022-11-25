import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./MenuItems.module.css";

function MenuItems() {
  const { data: session, status } = useSession();
  return (
    <ul className={styles.menuItems}>
      <li>
        {session ? (
          <Link href='/secretSanta'>
            <button
              className={styles.button}
              style={{ backgroundColor: "#e73d3d" }}
            >
              Secret Santa
            </button>
          </Link>
        ) : (
          <Link href='/signin'>
            <button
              className={styles.button}
              style={{ backgroundColor: "#e73d3d" }}
            >
              Secret Santa
            </button>
          </Link>
        )}
      </li>
      <li>
        {session ? (
          <Link href='/giftLists'>
            <button
              className={styles.button}
              style={{ backgroundColor: "#3de76d" }}
            >
              Wish Lists
            </button>
          </Link>
        ) : (
          <Link href='/signin'>
            <button
              className={styles.button}
              style={{ backgroundColor: "#3de76d" }}
            >
              Wish Lists
            </button>
          </Link>
        )}
      </li>
      <li>
        {session ? (
          <Link href='/xmasGames'>
            <button
              className={styles.button}
              style={{ backgroundColor: "#3DD1E7" }}
            >
              Xmas Games
            </button>
          </Link>
        ) : (
          <Link href='/signin'>
            <button
              className={styles.button}
              style={{ backgroundColor: "#3DD1E7" }}
            >
              Xmas Games
            </button>
          </Link>
        )}
      </li>
    </ul>
  );
}

export default MenuItems;
