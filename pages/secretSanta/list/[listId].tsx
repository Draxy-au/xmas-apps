import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "./List.module.css";

type ListProps = {
  listname: string;
  assigned: string;
  assignedUsername: string;
  username: string;
  email: string;
  id: string;
};

function List({
  listname,
  assigned,
  assignedUsername,
  username,
  email,
  id,
}: ListProps) {
  const router = useRouter();
  const [reveal, setReveal] = useState(false);

  function handleReveal() {
    setReveal(true);
  }

  return (
    <>
      <div className={styles.list}></div>
      <div className={styles.secretSanta}>
        <div className={styles.contentArea}>
          <div className={styles.heading}>SECRET SANTA</div>
          <div className={styles.info}>
            <div>
              This Secret Santa was created using a randomiser to work out
              assignments!
            </div>
            <div>
              Even the list creator does not know who is assigned to whom. To
              see who you were assigned, click the Reveal button below!
            </div>
          </div>
        </div>
        <div className={styles.listArea}>
          {reveal ? (
            <div>
              <div className={styles.assignName}>{assignedUsername}</div>
              <div className={styles.assignEmail}>{assigned}</div>
            </div>
          ) : (
            <button className={styles.reveal} onClick={handleReveal}>
              REVEAL
            </button>
          )}
        </div>
      </div>
    </>
  );
}

type Data = {
  listName: string;
  listCreator: string;
};

export async function getServerSideProps(context) {
  const { listId } = context.query;
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
    `${process.env.API_SERVER}/api/secretsanta/${listId}`,
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

  const listData = await res.json();

  const assignee = listData.list.assignments.filter(
    (item) => item[0] === email
  );

  const assigned = assignee[0][1];

  let assignedUsername = "";

  listData.list.listitems.forEach((item) => {
    if (item.email === assigned) {
      assignedUsername = item.name;
    }
  });

  return {
    props: {
      listname: listData.list.listname,
      assigned: assigned,
      assignedUsername: assignedUsername,
      username,
      email,
      id,
    },
  };
}

export default List;
