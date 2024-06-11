import React, { useState } from "react";
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/passwordInput/PasswordInput";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

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
          <AiOutlineMail size={35} color="#999" />
          </div>
          <h2>Forgot Password</h2>

          <form onSubmit={loginUser}>
            <input
              type="email"
              required
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            <button className="--btn --btn-primary --btn-block" type="submit">
              Get reset email
            </button>
            <div className={styles.links}>
            <p>
            <Link to="/">- Home</Link>
            </p>

            <p>
            <Link to="/login">- Login</Link>
            </p>
          </div>
          </form>

        </div>
      </Card>
    </div>
  );
}
