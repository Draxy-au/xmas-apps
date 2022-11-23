import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import NotificationContext from "../../../../contexts/notificationContext";
import { randomAssign } from "../../../../lib/util";

import styles from "./AddSantas.module.css";

type ListProps = {
  listId: string;
  listData: {
    message: string;
    list: {
      _id: string;
      userid: string;
      email: string;
      listname: string;
      finalised: boolean;
      listitems: {
        name: string;
        email: string;
      }[];
    };
  };
  email: string;
  id: string;
  username: string;
};

function List({ listId, listData, email, id, username }: ListProps) {
  const router = useRouter();
  const { showNotification } = useContext(NotificationContext);
  const [includeSelf, setIncludeSelf] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [listMembers, setListMembers] = useState([]);

  function containsEmail(
    cEmail: string,
    listItems: { name: string; email: string }[]
  ) {
    let found = false;
    listItems.forEach((item) => {
      if (cEmail === item.email) {
        found = true;
      }
    });
    return found;
  }

  useEffect(() => {
    if (
      listData &&
      listData.list.listitems &&
      listData.list.listitems.length > 0
    ) {
      if (listData.list.finalised) {
        router.push("/secretSanta");
      }
      if (containsEmail(email, listData.list.listitems)) {
        setIncludeSelf(true);
      } else {
        setIncludeSelf(false);
      }
      const filteredList = listData.list.listitems.filter(
        (item) => item.email !== email
      );
      setListMembers([...filteredList]);
    }
  }, []);

  function includeSelfHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setIncludeSelf((prev) => !prev);
  }

  function newEmailHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setNewEmail(event.target.value);
  }

  function newNameHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setNewName(event.target.value);
  }

  function handleAddMember(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setListMembers((prev) => [
      ...prev,
      { name: newName, email: newEmail.toLowerCase() },
    ]);
    setNewName("");
    setNewEmail("");
  }

  function handleRemoveMember(member: string) {
    setListMembers((prev) => prev.filter((m) => m !== member));
  }

  async function handleSaveBtn(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const result = await fetch(`/api/secretsanta/${listId}`, {
      method: "PATCH",
      body: JSON.stringify({
        listitems: includeSelf
          ? [{ name: username, email: email }, ...listMembers]
          : listMembers,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.ok) {
      showNotification(
        "SUCCESS",
        "Saved",
        "Saved Secret Santa list as draft.",
        3000
      );
      router.push("/secretSanta");
    }
  }

  async function handleStartBtn(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // Add an Are you sure? prompt

    const allEmails: string[] = listMembers.map(
      (item: { name: string; email: string }) => {
        return item.email;
      }
    );

    const assignments = randomAssign(
      includeSelf ? [email, ...allEmails] : allEmails
    );

    const result = await fetch(`/api/secretsanta/${listId}`, {
      method: "PATCH",
      body: JSON.stringify({
        listitems: includeSelf
          ? [{ name: username, email: email }, ...listMembers]
          : listMembers,
        finalised: true,
        assignments: assignments,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.ok) {
      showNotification(
        "SUCCESS",
        "Secret Santa Started",
        "Emailing members...",
        5000
      );
      router.push("/secretSanta/lists");
    }
  }

  return (
    <>
      <div className={styles.list}></div>
      <div className={styles.addSantas}>
        <div className={styles.contentArea}>
          <div className={styles.heading}>SECRET SANTA</div>
          <div className={styles.info}>
            Please add all the email addresses of the people who will be
            included in this secret santa. This list can be updated, to add and
            remove more people, up until you <b>FINALISE the list</b> and the
            Secret Santa is started!
          </div>
        </div>
        <div className={styles.listArea}>
          <div className={styles.listHeading}>{listData.list.listname}</div>
          <div className={styles.includeSelf}>
            <p>Are you included?</p>
            <input
              type='checkbox'
              className={styles.checkbox}
              checked={includeSelf}
              onChange={includeSelfHandler}
            />
          </div>
          <div className={styles.addName}>
            <input
              className={styles.inputName}
              type='text'
              value={newName}
              onChange={(e) => newNameHandler(e)}
              placeholder='Name of person...'
            />
            <input
              type='email'
              className={styles.inputName}
              value={newEmail}
              onChange={(e) => newEmailHandler(e)}
              placeholder='Email of person...'
            />
            <button onClick={(e) => handleAddMember(e)}>ADD PERSON</button>
          </div>
          <div className={styles.currentList}>
            <div className={styles.memberHeading}>MEMBERS</div>
            {includeSelf && <div className={styles.memberRow}>{username}</div>}
            {listMembers.length > 0 &&
              listMembers.map((member, key) => {
                return (
                  <div key={key} className={styles.memberRow}>
                    {member.name} [{member.email}]
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveMember(member)}
                    >
                      X
                    </button>
                  </div>
                );
              })}
            <button className={styles.saveBtn} onClick={handleSaveBtn}>
              SAVE &amp; CLOSE LIST
            </button>
            <button className={styles.finalBtn} onClick={handleStartBtn}>
              START SECRET SANTA
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

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

  return {
    props: {
      listId: listId,
      listData: listData,
      username,
      id,
      email,
    },
  };
}

export default List;
