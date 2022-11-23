import Link from "next/link";
import { getSession } from "next-auth/react";
import styles from "./Lists.module.css";

type List = {
  _id: string;
  userid: string;
  email: string;
  listname: string;
  listitems: string[];
};

type ListsProps = {
  listsData: { message: string; lists: List[] };
  username: string;
  id: string;
  email: string;
};

function Lists({ listsData, username, id, email }: ListsProps) {
  return (
    <>
      <div className={styles.lists}></div>
      <div className={styles.secretSanta}>
        <div className={styles.contentArea}>
          <div className={styles.heading}>Your Secret Santas</div>
          <div className={styles.info}>
            <div>Below are the Secret Santas you have been signed up to!</div>
          </div>
        </div>
        <div className={styles.listArea}>
          {listsData.lists.map((item) => {
            return (
              <div key={item._id}>
                <Link href={`/secretSanta/list/${item._id}`}>
                  <button className={styles.listItem}>{item.listname}</button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const email = session.user.email;
  const result = await fetch(
    `${process.env.API_SERVER}/api/user/${encodeURIComponent(email)}`
  );
  const userData = await result.json();
  const username = userData.username;
  const id = userData.id;

  const res = await fetch(
    `${process.env.API_SERVER}/api/secretsanta/user/lists/${encodeURIComponent(
      email
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const listsData = await res.json();

  return {
    props: {
      listsData: listsData,
      username,
      id,
      email,
    },
  };
}

export default Lists;
