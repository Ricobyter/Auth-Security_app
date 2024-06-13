import React, { useState } from "react";
import "./ChangePassword.scss";
import Card from "../../components/card/Card";
import PageMenu from "../../components/pageMenu/PageMenu";
import PasswordInput from "../../components/passwordInput/PasswordInput";

const initialState = {
  oldPassword: "",
  password: "",
  password2: "",


};

export default function ChangePassword() {
  const [formData, setFormData] = useState(initialState);

  const {oldPassword, password, password2} = formData

  const handleInputChange = () => {};
  return (
    <section>
      <div className="container">
        <PageMenu />
        <h2>Change Password</h2>
        <div className="--flex-start change-password">
          <Card cardClass={"card"}>
            <div>
              <form>
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
