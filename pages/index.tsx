import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import Head from "next/head";

import useSWR from "swr";
import Loader from "../components/loading/Loader";
import MenuItems from "../components/menu/MenuItems";

import styles from "../styles/Home.module.css";

type HomeProps = {
  session: Session;
  loggedIn: boolean;
  username: string;
  email: string;
  id: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Home({ session, loggedIn, username, email, id }: HomeProps) {
  const { data, error } = useSWR(`/api/user/${session?.user?.email}`, fetcher);

  if (!data && loggedIn) return <Loader />;

  return (
    <div className={styles.container}>
      <Head>
        <title>Xmas Apps</title>
        <meta name='description' content='Some fun Xmas Apps!' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <MenuItems />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        session: null,
        loggedIn: false,
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

export default Home;
