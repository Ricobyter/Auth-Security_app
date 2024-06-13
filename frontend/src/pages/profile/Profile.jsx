import React, { useState } from "react";
import "./Profile.scss";
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

export default function Profile() {

    const [profile, setProfile] = useState(initialState)

    const handleImageChange = () => {

    }

    const handleInputChange = () => {

    }
  return (
    <section>
      <div className="container">
        <PageMenu />
        <h2>Your Profile</h2>
        <div className="--flex-start profile">
          <Card cardClass={"card"}>
            <div>
              <div className="profile-photo">
                <div>
                  <img src={avatarImg} alt="Profile Picture" />
                  <h3>Role: Subscriber</h3>
                </div>
              </div>
              <form>
                <p>
                    <label >Change Photo : </label>
                    <input type="file" accept="image/*" name="image" onChange={handleImageChange}/>
                </p>
                <p>
                    <label >Name</label>
                    <input type="text" name="name" value={profile.name} onChange={handleInputChange}/>
                </p>
                <p>
                    <label >Email</label>
                    <input type="email" name="email" disabled value={profile.email} onChange={handleInputChange}/>
                </p>
                <p>
                    <label >Phone</label>
                    <input type="text" name="phone" disabled value={profile.phone} onChange={handleInputChange}/>
                </p>
                <p>
                    <label >Bio</label>
                    <textarea  name="bio" cols="30" rows='10' value={profile.bio} onChange={handleInputChange}/>
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
