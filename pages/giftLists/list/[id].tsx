import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./List.module.css";

type Item = {
  itemName: string;
  itemLink: string;
  itemPrice: string;
  earmark?: boolean;
};

type ListProps = {
  session: Session;
  email: string;
  username: string;
  id: string;
  giftList: Item[];
  listId: string;
};

function List({ session, email, username, id, giftList, listId }: ListProps) {
  const [itemList, _setItemList] = useState<Item[]>(giftList);
  const [listUsername, setListUsername] = useState<string>("");

  async function getUsername(iId: string) {
    const result = await fetch(`/api/user/id/${iId}`);

    if (result.ok) {
      const userDetails = await result.json();
      return userDetails.username;
    }
    return "error";
  }

  useEffect(() => {
    console.log(listId);
    if (listId) {
      const getListOwner = async () => {
        const listuser = await getUsername(listId);
        setListUsername(await listuser);
      };
      getListOwner();
      console.log("ok did this");
    }
  }, [listId]);

  return (
    <>
      <div className={styles.bg}></div>
      <div className={styles.List}>
        <div className={styles.listArea}>
          <div className={styles.listOwner}>{listUsername}&apos;s List</div>
          {itemList.map((item, key) => (
            <div key={key} className={styles.item}>
              <div className={styles.itemName}>{item.itemName}</div>
              <div className={styles.itemInfo}>
                <span>
                  ${item.itemPrice} -{" "}
                  <Link target={"_blank"} href={item.itemLink}>
                    [Link]
                  </Link>
                </span>
              </div>
            </div>
          ))}
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

  const listId = context.query.id;

  const listResult = await fetch(
    `${process.env.API_SERVER}/api/giftlist/list/${listId}`
  );
  if (listResult.ok) {
    const giftList = await listResult.json();

    return {
      props: {
        session,
        email,
        username,
        id,
        giftList: giftList.giftList.giftlist,
        listId,
      },
    };
  }

  return {
    props: {
      session,
      email,
      username,
      id,
      giftList: [],
      listId,
    },
  };
}

export default List;
