import React, { useState } from "react";
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { IoMdLogIn } from "react-icons/io";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/passwordInput/PasswordInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            <IoMdLogIn size={35} color="#999" />
          </div>
          <h2>Login</h2>
          <div className="--flex-center">
            <button className="--btn --btn-google">Login with Google</button>
          </div>
          <br />
          <p className="--text-center --fw-bold">or</p>

          <form onSubmit={loginUser}>
            <input
              type="email"
              required
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            <PasswordInput
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            {/* <input
              type="password"
              required
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleInputChange}
              
            /> */}
            <button className="--btn --btn-primary --btn-block" type="submit">
              Login
            </button>
          </form>
          <Link to="/forgot">Forgot password</Link>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p>&nbsp; Don't have an account ? &nbsp;</p>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </Card>
    </div>
  );
}
