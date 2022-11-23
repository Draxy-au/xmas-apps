import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { signIn } from "next-auth/react";

import styles from "./Login.module.css";
import { useRouter } from "next/router";
import { useContext } from "react";
import NotificationContext from "../../contexts/notificationContext";

type LoginProps = {
  setShowLogin: (b: boolean) => void;
};

type LoginSubmitForm = {
  email: string;
  password: string;
};

function Login({ setShowLogin }: LoginProps) {
  const router = useRouter();
  const { showNotification } = useContext(NotificationContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "At least 6 characters")
      .max(16, "Not exceed 16 characters"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: LoginSubmitForm) => {
    // console.log(JSON.stringify(data, null, 2));
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result.ok) {
      showNotification("SUCCESS", "Logged In", "Successfully logged in.", 3000);
      router.push("/");
    }
  };

  return (
    <div className={styles.login}>
      <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
        <span className={styles.heading}>Login</span>
        <input type='text' placeholder='email address' {...register("email")} />
        <div className={styles.error}>{errors.email?.message}</div>
        <input
          type='password'
          placeholder='password'
          {...register("password")}
        />
        <div className={styles.error}>{errors.password?.message}</div>
        <button type='submit'>Login</button>
        <span onClick={() => {}}>Forgot Password?</span>
        <span onClick={() => setShowLogin(false)}>Not Registered?</span>
      </form>
    </div>
  );
}

export default Login;
