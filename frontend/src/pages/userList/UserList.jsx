import React from "react";
import "./UserList.scss";
import PageMenu from "../../components/pageMenu/PageMenu";
import UserStats from "../../components/userStats/UserStats";
import Search from "../../components/search/Search";
import { FaTrashAlt } from "react-icons/fa";
import ChangeRole from "../../components/changeRole/ChangeRole";

function UserList() {
  return (
    <section>
      <div className="container">
        <PageMenu />
        <UserStats />

        <div className="user-list">
          <div className="table">
            <div className="--flex-between">
              <span>
                <h3>All Users</h3>
              </span>
              <span>
                <Search />
              </span>
            </div>
            
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
              <td>1</td>
              <td>Rico</td>
              <td>Rico@gmail.com</td>
              <td>Admin</td>
              <td><ChangeRole /></td>
              <td>
                <span>
                  <FaTrashAlt
                    size={20}
                    color="red"
                  />
                </span>
              </td>
            </tbody>
          </table>
          </div>

        </div>
      </div>
    </section>
  );
}

export default UserList;
