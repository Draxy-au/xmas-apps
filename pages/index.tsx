import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import Head from "next/head";

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

function Home({ session, loggedIn, username, email, id }: HomeProps) {
  if (!session && loggedIn) return <Loader />;

  return (
    <div className={styles.container}>
      <Head>
        <title>Xmas Apps</title>
        <meta name='description' content='Some fun Xmas Apps!' />
        <link rel='icon' href='/favicon.ico' />
        <meta property='og:title' content='William Hamilton Xmas Apps' />
        <meta property='og:description' content='Some Xmas apps I made.' />
        <meta property='og:image' content='https://www.draxyz.com/og.png' />
        <meta property='og:image:alt' content='Xmas Apps' />
        <meta property='og:type' content='URL' />
        <meta property='og:url' content='https://www.draxyz.com/' />
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
  console.log("Got before fetch");
  const result = await fetch(
    `${process.env.API_SERVER}/api/user/${encodeURIComponent(email)}`
  );
  const userData = await result.json();
  console.log("DEBUG USEDATA:", userData);
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
