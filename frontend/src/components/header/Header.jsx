import React from "react";
import "./Header.scss";
import { IoMdLogIn } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, RESET } from "../../redux/features/auth/authSlice";


const activeLink = ({isActive}) => (isActive ? 'active' : '')

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const goHome = () => {
    navigate('/')
  }

  const logoutUser = async () => {
    dispatch(RESET());
    await dispatch(logout())
    navigate('/login')
  }
  return (
    <div className="header ">
      <nav>
        <div className="logo" onClick={goHome}>
          <IoMdLogIn size={35} />
          <span>Auth-Help</span>
        </div>
        <ul className="home-links">
          <li className="--flex-center">
            <FaUserCircle size={20} />
            <p className="--color-white">Hi, Rico</p>
          </li>
          <li>
            <button className="--btn --btn-primary">
              <Link to="/login">Login</Link>
            </button>
          </li>
          <li>
            <NavLink className={activeLink} to="/profile">
              Profile
            </NavLink>
          </li>
          <li>
            <button onClick={logoutUser} className="--btn --btn-secondary">Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
