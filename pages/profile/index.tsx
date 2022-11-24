import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import styles from "./ProfilePage.module.css";
import { useContext, useState } from "react";
import NotificationContext from "../../contexts/notificationContext";

import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

type UpdateProfileForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ProfilePageProps = {
  username: string;
  email: string;
};

function ProfilePage({ username, email }: ProfilePageProps) {
  const { showNotification } = useContext(NotificationContext);
  const router = useRouter();

  const [iUsername, setIUsername] = useState(username);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("User Name is required")
      .max(16, "Not exceed 16 characters"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: UpdateProfileForm) => {
    const { username: iusername } = data;

    if (iusername.toLowerCase() === username.toLowerCase()) {
      showNotification("ERROR", "Not Updated!", "No changes detected.", 10000);
      return;
    }

    const response = await fetch("/api/auth/update", {
      method: "PATCH",
      body: JSON.stringify({
        username: iusername.trim(),
        email: email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (responseData.message && responseData.message !== "Updated User!") {
      console.error(responseData.message);
      showNotification(
        "ERROR",
        "Update Failed for User!",
        responseData.message,
        10000
      );
    } else {
      showNotification(
        "SUCCESS",
        "User Profile Updated!",
        responseData.message,
        10000
      );
    }

    router.push("/");
  };

  return (
    <div className={styles.profilePage}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div>Username:</div>
        <input type='text' defaultValue={iUsername} {...register("username")} />
        <div className={styles.error}>{errors.username?.message}</div>
        <div>Email Address:</div>
        <input type='text' value={email} disabled />
        <div className={styles.error}>{errors.email?.message}</div>
        <button type='submit'>UPDATE</button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        username: null,
        email: null,
      },
    };
  }

  const email = session.user.email;
  const result = await fetch("/api/user/${encodeURIComponent(email)}");
  const userData = await result.json();
  console.log("Debug USERDATA:", userData);
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

export default ProfilePage;
