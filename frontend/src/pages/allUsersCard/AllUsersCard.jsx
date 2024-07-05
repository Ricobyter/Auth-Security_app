import React, { useEffect } from 'react';
import './AllUsersCard.scss';
import PageMenu from '../../components/pageMenu/PageMenu';
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../redux/features/auth/authSlice';
import { Spinner } from '../../components/loader/Loader';


function AllUsersCard() {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { users, isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div className='all-users-card'>
      <div className='mt-10'>
        <PageMenu />
      </div>
      <div className='card-container'>
        {isLoading && <Spinner />}
        {
          users.map((user, index) => {
            const { photo, name, email } = user;
            return (
              <div key={index} className='card'>
                <img src={photo} alt="profile pic" width="60px" />
                <div>
                  <h3>{name}</h3>
                  <p>{email}</p>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default AllUsersCard;
