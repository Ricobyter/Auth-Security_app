import React, { useState } from "react";
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/passwordInput/PasswordInput";


const initialState = {
    password: "",
    password2: "",
  }
export default function Reset() {
  const [formData, setFormData] = useState(initialState);

  const {password, password2} = formData
  
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
          <MdPassword size={35} color="#999" />
          </div>
          <h2>Reset Password</h2>

          <form onSubmit={loginUser}>
          <PasswordInput
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            <PasswordInput
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={handleInputChange}
            />
            <button className="--btn --btn-primary --btn-block" type="submit">
              Reset Password
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
