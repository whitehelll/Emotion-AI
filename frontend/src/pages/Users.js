import React from "react";

export default function Users() {

  return (

    <div>

      <h1>Users</h1>
      <p>Manage registered users</p>

      <div className="table">

        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registration Date</th>
              <th>Time</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td colSpan="4" className="empty">
                No users found
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );
}