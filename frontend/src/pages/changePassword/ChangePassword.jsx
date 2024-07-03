import React, { useState } from "react";
import "./ChangePassword.scss";
import Card from "../../components/card/Card";
import PageMenu from "../../components/pageMenu/PageMenu";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { changePassword, logout, RESET } from "../../redux/features/auth/authSlice";

const initialState = {
  oldPassword: "",
  password: "",
  password2: "",
};

export default function ChangePassword() {
  useRedirectLoggedOutUser("/login");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);

  const {oldPassword, password, password2} = formData

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updatePassword = async(e) => {
    e.preventDefault

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

    await dispatch(changePassword(userData))
    await dispatch(logout())
    await dispatch(RESET(userData))
    navigate("/login")
  }
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

                <div className="--btn --btn-danger --btn-block">
                  Change Profile
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
