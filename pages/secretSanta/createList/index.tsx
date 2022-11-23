import { Session } from "next-auth/core/types";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { FormEvent, useEffect, useRef, useState } from "react";

import styles from "./CreateList.module.css";

type CreateListProps = {
  session: Session;
  loggedIn: boolean;
  username: string;
  email: string;
  id: string;
};

function CreateList({
  session,
  loggedIn,
  email,
  id,
  username,
}: CreateListProps) {
  const listnameRef = useRef(null);
  const router = useRouter();
  const { status } = useSession();
  const [errorMSG, setErrorMSG] = useState<string>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  async function addListToDB(newList: {
    id: string;
    email: string;
    listname: string;
  }) {
    const response = await fetch("/api/secretsanta/newlist", {
      method: "POST",
      body: JSON.stringify(newList),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.message === "Created List!") {
      return result;
    }
    setErrorMSG("List Name Taken! Please try again.");
    return null;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setErrorMSG("");

    if (status === "authenticated") {
      const newList = {
        id: id,
        email: email,
        listname: listnameRef.current.value,
      };

      const result = await addListToDB(newList);
      if (!result) {
        console.error("Unable to create list");
        return;
      }

      router.push(`/secretSanta/list/edit/${result.listid}`);
    }
  }

  return (
    <div className={styles.createList}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input ref={listnameRef} type='text' placeholder='New List Name...' />
        <div className={styles.error}>{errorMSG ? errorMSG : null}</div>
        <button type='submit'>Create List</button>
      </form>
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

  return {
    props: {
      session: session,
      loggedIn: true,
      username,
      email,
      id,
    },
  };
}

export default CreateList;
