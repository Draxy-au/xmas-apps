import { useState } from "react";
import styles from "SignIn.module.css";
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register";

function SignIn() {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div>
      {showLogin ? (
        <Login setShowLogin={setShowLogin} />
      ) : (
        <Register setShowLogin={setShowLogin} />
      )}
    </div>
  );
}

export default SignIn;
