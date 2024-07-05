import React, { useEffect } from "react";
import "./UserList.scss";
import PageMenu from "../../components/pageMenu/PageMenu";
import UserStats from "../../components/userStats/UserStats";
import Search from "../../components/search/Search";
import { FaTrashAlt } from "react-icons/fa";
import ChangeRole from "../../components/changeRole/ChangeRole";
import { useDispatch, useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { deleteUser, getUsers } from "../../redux/features/auth/authSlice";
import { shortenText } from "../profile/Profile";
import { Spinner } from "../../components/loader/Loader";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

function UserList() {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch()
  const {users, isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
  dispatch(getUsers())
  }, [dispatch])

const removeUser = async(id) => {
await dispatch(deleteUser(id));
await dispatch(getUsers())
}

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'delete this user ',
      message: 'Are you sure you want to delete this user ?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => removeUser(id)
        },
        {
          label: 'Cancel',
          // onClick: () => alert('Click No')
        }
      ]
    })};



  return (
    <section>
      <div className="container">
        <PageMenu />
        <UserStats />

        <div className="user-list">
          {isLoading && <Spinner/>}
          <div className="table">
            <div className="--flex-between">
              <span>
                <h3>All Users</h3>
              </span>
              <span>
                <Search />
              </span>
            </div>
            {!isLoading && users.length === 0 ? (
              <p>No user found</p>
            ): (
              <table>

              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const {_id, name, email, role} = user;

                  return (
                    <tr key={_id}>
                    <td>{index+1}</td>
                    <td>{shortenText(name, 10)}</td>
                    <td>{email}</td>
                    <td>{role}</td>
                    <td><ChangeRole _id = {_id} email={email}/></td>
                    <td>
                      <span>
                        <FaTrashAlt
                          size={20}
                          color="red"
                          onClick={() =>confirmDelete(_id)}
                        />
                      </span>
                    </td>
                    </tr>
                  )
                })}

              </tbody>
            </table>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}

export default UserList;
