import React, { useState } from "react";
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { GrInsecure } from "react-icons/gr";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/passwordInput/PasswordInput";

export default function LoginWithCode() {
  const [loginCode, setLoginCode] = useState("");

  const handleInputChange = () => {
    // setEmail(e.target.value);
    // setPassword(e.target.value)
  };

  const loginUser = () => {};
  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
          <GrInsecure size={35} color="#999" />
          </div>
          <h2>Enter Acces Code</h2>

          <form onSubmit={loginUser}>
            <input
              type="text"
              required
              placeholder="Access Code"
              name="loginCode"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
            />
            <button className="--btn --btn-primary --btn-block" type="submit">
              Proceed to Login
            </button>
            <span className="--flex-center">Check your registered email for login code</span>
            <div className={styles.links}>
            <p>
            <Link to="/">- Home</Link>
            </p>

            <p className="v-link --color-primary">
           <b>Resend Code</b>
            </p>
          </div>
          </form>

        </div>
      </Card>
    </div>
  );
}
