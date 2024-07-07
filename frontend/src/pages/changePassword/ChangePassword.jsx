import React, { useEffect, useState } from "react";
import "./ChangePassword.scss";
import Card from "../../components/card/Card";
import PageMenu from "../../components/pageMenu/PageMenu";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { changePassword, logout, RESET } from "../../redux/features/auth/authSlice";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { Spinner } from "../../components/loader/Loader";
import { sendAutomatedEmail } from "../../redux/features/email/emailSlice";

const initialState = {
  oldPassword: "",
  password: "",
  password2: "",
};

export default function ChangePassword() {
  useRedirectLoggedOutUser("/login");

  const { isLoading, user, isSuccess, isError } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);

  const {oldPassword, password, password2} = formData

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updatePassword = async(e) => {
    e.preventDefault()

    if (!password || !oldPassword || !password2) {
      return toast.error("Please fill all the fields");
    }

    if(password !== password2){
      return toast.error("Password does not match")
    }

    const userData = {
      oldPassword,
      password,
    }

    const emailData ={
      subject: "Password Changed - Auth-APP",
      sent_to : user.email,
      reply_to : "noreply@rico.com",
      template: "changePassword",
      url : "/forgot"
   
    }

    if(oldPassword !== user.password){
      return toast.error("Old Password does not match")
    }

    await dispatch(changePassword(userData))

    await dispatch(sendAutomatedEmail(emailData))
    await dispatch(logout())
    await dispatch(RESET(userData))
    await navigate("/login")


  }
  

  // useEffect(() => {
  //   const emailData ={
  //     subject: "Password Changed - Auth-APP",
  //     sent_to : user.email,
  //     reply_to : "noreply@rico.com",
  //     template: "changePassword",
  //     url : "/forgot"
   
  //   }
  //   if (isSuccess) {
  //     // dispatch(sendAutomatedEmail(emailData))
  //     dispatch(logout())
  //     navigate("/login");
  //   }

  //   if(isError){
  //     toast.error("Something went wrong")
  //   }
  //   dispatch(RESET());
  // }, [ isSuccess, dispatch, navigate, isError]);
  return (
    <section>
      <div className="container">
        <PageMenu />
        <h2>Change Password</h2>
        <div className="--flex-start change-password">
          <Card cardClass={"card"}>
            <div>
              <form onSubmit={updatePassword}>
                <p>
                  <label>Current Password</label>
                  <PasswordInput
                    placeholder="Current Password"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={handleInputChange}
                  />
                </p>
                <p>
                  <label>New Password</label>
                  <PasswordInput
                    placeholder="New Password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                  />
                </p>
                <p>
                  <label>New Confirm Password</label>
                  <PasswordInput
                    placeholder="Confirm New Password"
                    name="password2"
                    value={password2}
                    onChange={handleInputChange}
                  />
                </p>
                {isLoading ? <Spinner/>: (
                <button
                type="submit"
                className="--btn --btn-danger --btn-block"
              >
                Change Password
              </button>
                )}

              </form>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
