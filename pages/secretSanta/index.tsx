import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SSMenu from "../../components/secretSanta/SSMenu";

import styles from "./SecretSanta.module.css";

function SecretSanta() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return <div className={styles.loading}>Loading...</div>;
  } else {
    return (
      <div className={styles.secretSanta}>
        <SSMenu />
      </div>
    );
  }
}

export default SecretSanta;
