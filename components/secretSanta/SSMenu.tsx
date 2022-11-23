import Link from "next/link";
import styles from "./SSMenu.module.css";

function SSMenu() {
  return (
    <ul className={styles.ssMenu}>
      <li className={styles.secretSanta}>
        <Link href='/secretSanta/lists'>SECRET SANTA</Link>
      </li>
      <li className={styles.newSS}>
        <Link href='/secretSanta/createList'>Create New Secret Santa</Link>
      </li>
      <li className={styles.editSS}>
        <Link href='/secretSanta/editList'>Edit Saved Secret Santa</Link>
      </li>
    </ul>
  );
}

export default SSMenu;
