import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./Register.module.css";
import NotificationContext from "../../contexts/notificationContext";
import { useContext } from "react";

type RegisterProps = {
  setShowLogin: (b: boolean) => void;
};

type RegisterSubmitForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register({ setShowLogin }: RegisterProps) {
  const { showNotification } = useContext(NotificationContext);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("User Name is required")
      .max(16, "Not exceed 16 characters"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "At least 6 characters")
      .max(16, "Not exceed 16 characters"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Password does not match"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: RegisterSubmitForm) => {
    // console.log(JSON.stringify(data, null, 2));
    const { username, email, password } = data;
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (responseData.message && responseData.message !== "Created User!") {
      console.error(responseData.message);
      showNotification("ERROR", "Creating User", responseData.message, 10000);
    } else {
      showNotification(
        "SUCCESS",
        "Account Registered",
        responseData.message,
        10000
      );
      setShowLogin(true);
    }
    reset();
  };

  return (
    <div className={styles.register}>
      <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <span className={styles.heading}>Register</span>
        <input type='text' placeholder='user name' {...register("username")} />
        <input
          type='email'
          placeholder='email address'
          {...register("email")}
        />
        <div className={styles.error}>{errors.email?.message}</div>
        <input
          type='password'
          placeholder='password'
          {...register("password")}
        />
        <div className={styles.error}>{errors.password?.message}</div>
        <input
          type='password'
          placeholder='confirm password'
          {...register("confirmPassword")}
        />
        <div className={styles.error}>{errors.confirmPassword?.message}</div>
        <button type='submit'>Register</button>
        <span
          onClick={() => {
            setShowLogin(true);
          }}
        >
          Already Registered?
        </span>
      </form>
    </div>
  );
}

export default Register;
