import React, { useState } from "react";
import "./ChangePassword.scss";
import Card from "../../components/card/Card";
import avatarImg from "../../assets/avatarr.png";
import PageMenu from "../../components/pageMenu/PageMenu";

const initialState = {
    name: 'Rico',
    email: 'rico@gmail.com',
    phone: '',
    bio: '',
    photo: '',
    role: '',
    isVerified: false
}

export default function ChangePassword() {

    const [profile, setProfile] = useState(initialState)

    const handleImageChange = () => {

    }

    const handleInputChange = () => {

    }
  return (
    <section>
      <div className="container">
        <PageMenu />
        <h2>Change Password</h2>
        <div className="--flex-start profile">
          <Card cardClass={"card"}>
            <div>
              <form>
                <p>
                    <label >Current Password</label>
                    <input type="text" name="name" value={profile.name} onChange={handleInputChange}/>
                </p>
                <p>
                    <label >Email</label>
                    <input type="email" name="email" disabled value={profile.email} onChange={handleInputChange}/>
                </p>
              
                <div className="--btn --btn-primary --btn-block">
                    Update Profile
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
