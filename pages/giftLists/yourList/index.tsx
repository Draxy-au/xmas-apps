import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./YourList.module.css";

type Item = {
  itemName: string;
  itemLink: string;
  itemPrice: string;
};

type YourListProps = {
  session: Session;
  email: string;
  username: string;
  id: string;
  giftList: Item[];
};

function YourList({ session, email, username, id, giftList }: YourListProps) {
  const [itemList, setItemList] = useState<Item[]>(giftList);
  const [newItem, setNewItem] = useState<Item>({
    itemName: "",
    itemLink: "",
    itemPrice: "",
  });
  const [error, setError] = useState(false);
  const router = useRouter();

  function handleAddItem() {
    if (
      newItem.itemName.length < 1 ||
      newItem.itemLink.length < 1 ||
      newItem.itemPrice.length < 1
    ) {
      setError(true);
      return;
    }
    setError(false);
    if (itemList.length > 0) {
      setItemList((prev) => [...prev, newItem]);
    } else {
      setItemList([newItem]);
    }
    setNewItem({
      itemName: "",
      itemLink: "",
      itemPrice: "",
    });
  }

  function handleRemoveItem(name) {
    setItemList(itemList.filter((item) => item.itemName !== name));
  }

  async function handleSave() {
    const result = await fetch(`/api/giftlist/${email}`, {
      method: "POST",
      body: JSON.stringify({
        id: id,
        email: email,
        listItems: itemList,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.ok) {
      console.log("Result OK");
      console.log("Result: ", await result.json());
    } else {
      console.log("Result NOT OK");
    }
    router.push("/");
  }

  return (
    <>
      <div className={styles.bg}></div>
      <div className={styles.yourList}>
        <div className={styles.infoArea}>
          <div className={styles.heading}>Your Wish List</div>
          <div className={styles.info}>
            Here you can add gift ideas that you would like to recieve. After
            Saving your list, please consider that someone may have already
            chosen to get something before removing items.
          </div>
        </div>
        <div className={styles.addItemArea}>
          <input
            className={styles.iName}
            type='text'
            placeholder='Item Name...'
            value={newItem.itemName}
            onChange={(e) =>
              setNewItem({ ...newItem, itemName: e.target.value })
            }
          />

          <input
            className={styles.iLink}
            type='text'
            placeholder='Item Link...'
            value={newItem.itemLink}
            onChange={(e) =>
              setNewItem({ ...newItem, itemLink: e.target.value })
            }
          />

          <input
            className={styles.iPrice}
            type='text'
            placeholder='Item Price...'
            value={newItem.itemPrice}
            onChange={(e) =>
              setNewItem({ ...newItem, itemPrice: e.target.value })
            }
          />
          {error ? (
            <div className={styles.formError}>Please fill in all fields.</div>
          ) : null}
          <button className={styles.addItemBtn} onClick={handleAddItem}>
            Add Item
          </button>
        </div>
        <div className={styles.listArea}>
          <div className={styles.heading}></div>

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
                <button
                  className={styles.remove}
                  onClick={() => handleRemoveItem(item.itemName)}
                >
                  X
                </button>
              </div>
            </div>
          ))}

          <div className={styles.buttonArea}>
            <button className={styles.save} onClick={handleSave}>
              Save and Close
            </button>
          </div>
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

  const listResult = await fetch(
    `${process.env.API_SERVER}/api/giftlist/${encodeURIComponent(email)}`
  );
  if (listResult.ok) {
    const giftList = await listResult.json();

    console.log(giftList.giftList.giftlist);
    return {
      props: {
        session,
        email,
        username,
        id,
        giftList: giftList.giftList.giftlist,
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
    },
  };
}

export default YourList;
