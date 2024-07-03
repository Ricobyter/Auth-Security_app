import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectUser } from "../../redux/features/auth/authSlice";

export const ShowOnLogin = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (isLoggedIn) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export const ShowOnLogout = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export const AdminAuthorLink = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userRole = useSelector(selectUser)

  if (!isLoggedIn & (userRole === "admin" || userRole === "author")) {
    return <>{children}</>;
  } else {
    return null;
  }
};
