import React, { useState } from "react";
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { validateEmail } from "../../redux/features/auth/authService";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, RESET } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch()

  const { isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const forgot = async (e) => {
    e.preventDefault();
    if(!email){
      return toast.error("Please enter your email")
    }

    if(!validateEmail(email)){
      return toast.error("Please enter a valid email")
    }

    const userData = {
      email
    }

    await dispatch(forgotPassword(userData))
    await dispatch(RESET(userData))
  };
  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <AiOutlineMail size={35} color="#999" />
          </div>
          <h2>Forgot Password</h2>

          <form onSubmit={forgot}>
            <input
              type="email"
              required
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
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
