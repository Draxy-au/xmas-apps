import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./GiftLists.module.css";

type Item = {
  itemName: string;
  itemLink: string;
  itemPrice: string;
};

type GiftList = {
  _id: string;
  userid: string;
  email: string;
  giftlist: Item[];
};

type GiftListsProps = {
  session: Session;
  email: string;
  username: string;
  id: string;
  giftLists: GiftList[];
};

function GiftLists({
  session,
  email,
  username,
  id,
  giftLists,
}: GiftListsProps) {
  const [lists, setLists] = useState<GiftList[]>(giftLists);
  const [userLists, setUserLists] = useState([]);

  async function getUsername(iemail: string) {
    const result = await fetch(`/api/user/${iemail}`);
    if (result.ok) {
      const userDetails = await result.json();
      return userDetails.username;
    }
    return "error";
  }

  useEffect(() => {
    if (lists.length > 0) {
      lists.forEach(async (item) => {
        const username = await getUsername(item.email);
        const newItem = { ...item, username: username };
        setUserLists((prev) => [...prev, newItem]);
      });
    }
  }, [lists]);

  return (
    <>
      <div className={styles.bg}></div>
      <div className={styles.giftLists}>
        <div className={styles.yourList}>
          <div className={styles.heading}>Your Wish List</div>
          <Link href='/giftLists/yourList'>
            <button className={styles.yourListBtn}>View Wish List</button>
          </Link>
        </div>
        <div className={styles.list}>
          <div className={styles.heading}>Shared Wish Lists</div>
          {userLists.length > 0
            ? userLists.map((item, key) => (
                <Link key={key} href={`/giftLists/list/${item.userid}`}>
                  <button className={styles.sharedListBtn}>
                    {item.username}&apos;s List
                  </button>
                </Link>
              ))
            : null}
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

  const giftListsResult = await fetch(
    `${process.env.API_SERVER}/api/giftlist/lists/${encodeURIComponent(email)}`
  );

  if (!giftListsResult.ok) {
    return {
      props: {
        session,
        email,
        username,
        id,
        giftLists: [],
      },
    };
  }

  const giftLists = await giftListsResult.json();

  return {
    props: {
      session,
      email,
      username,
      id,
      giftLists: giftLists.giftLists,
    },
  };
}

export default GiftLists;
