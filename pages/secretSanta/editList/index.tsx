import { getSession } from "next-auth/react";
import Link from "next/link";
import styles from "./EditList.module.css";

type List = {
  _id: string;
  userid: string;
  email: string;
  listname: string;
  listitems: string[];
};

type EditListProps = {
  listsData: { message: string; lists: List[] };
  username: string;
  id: string;
  email: string;
};

function EditList({ listsData, username, id, email }: EditListProps) {
  return (
    <div className={styles.editList}>
      <div className={styles.content}>
        {listsData.lists.length > 0 ? (
          <>
            <div className={styles.heading}>Edit Secret Santa List</div>
            <div className={styles.lists}>
              {listsData.lists.map((item) => {
                return (
                  <div key={item._id}>
                    <Link href={`/secretSanta/list/edit/${item._id}`}>
                      <button className={styles.listItem}>
                        {item.listname}
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className={styles.heading}>No Drafts Found</div>
        )}
      </div>
    </div>
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
    `${process.env.API_SERVER}/api/secretsanta/user/${encodeURIComponent(
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

export default EditList;
