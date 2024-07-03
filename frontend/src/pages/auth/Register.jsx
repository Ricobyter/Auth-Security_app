import React, { useEffect, useState } from "react";
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { TiUserAddOutline } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import { FaTimes } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";
import { toast } from "react-toastify";
import { validateEmail } from "../../redux/features/auth/authService";
import {useDispatch, useSelector} from 'react-redux'
import { register, RESET, sendVerificationEmail } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
}
export default function Register() {
  const [formData, setFormData] = useState(initialState);

  const {name, email, password, password2} = formData

  const handleInputChange = (e) => {
  const {name, value} = e.target 
  setFormData({...formData, [name]: value})
  };

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {isLoading, isLoggedIn, isSuccess, message} = useSelector((state)=> 
state.auth    
  )

  const[upperCase, setUpperCase] = useState(false)
  const[num, setNum] = useState(false)
  const[sChar, setSChar] = useState(false)
  const[passLength, setPassLength] = useState(false)

  const timesIcon = <FaTimes color="red" size={15} />;
  const checkIcon = <BsCheck2All color="green" size={15} />;

  const switchIcon = (condition) => {
    if(condition){
      return checkIcon
    }
   return timesIcon
  }


useEffect(() => {
  // Check Lower and Uppercase
  if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
    setUpperCase(true);
  } else {
    setUpperCase(false);
  }
  // Check for numbers
  if (password.match(/([0-9])/)) {
    setNum(true);
  } else {
    setNum(false);
  }
  // Check for special character
  if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
    setSChar(true);
  } else {
    setSChar(false);
  }
  // Check for PASSWORD LENGTH
  if (password.length > 5) {
    setPassLength(true);
  } else {
    setPassLength(false);
  }
}, [password]);

  const registerUser = async(e) => {
    e.preventDefault();
    
   if(!name || !password || !email){
    return toast.error("Please fill all the fields")
   }

   if(password.length < 6){
    return toast.error("Password must be at least 6 characters")
   }

   if(!validateEmail(email)){
    return toast.error("Invalid Email")
   }

   if(password !== password2){
    return toast.error("Passwords do not match")
   }


   const userData = {
    name,email, password
   }

  //  console.log(userData)
  await dispatch(register(userData))
  await dispatch(sendVerificationEmail());
  };

  useEffect(()=> {
if(isSuccess && isLoggedIn){
  navigate('/profile')
}

dispatch(RESET())
  }, [isLoggedIn, isSuccess, dispatch, navigate])

  return (
    <div className={`container ${styles.auth}`}>
    {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
          <TiUserAddOutline size={35} color="#999" />
          </div>
          <h2>Register</h2>
          <form onSubmit={registerUser}>
            <input
              type="text"
              required
              placeholder="Name"
              name="name"
              value={name}
              onChange={handleInputChange}
            />
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
            <PasswordInput
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={handleInputChange}
              onPaste={(e) => {
                e.preventDefault();
                toast.error("Cannot paste into input field")

                return false
              }}
            />
            {/* Pasword Strength */}
            <Card cardClass={styles.group}>
              <ul className="form-list">
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(upperCase)}
                     &nbsp; At least one uppercase character
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(num)}
                     &nbsp; At least a single number
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(sChar)}
                     &nbsp; Atleast a single special character
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(passLength)}
                     &nbsp; At least 8 length
                  </span>
                </li>

              </ul>
            </Card>
            <button className="--btn --btn-primary --btn-block" type="submit">
              Register
            </button>
          </form>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p>&nbsp; Already have an account ? &nbsp;</p>
            <Link to="/Login">Login</Link>
          </span>
        </div>
      </Card>
    </div>
  );
}
