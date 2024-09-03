import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useLogoutUserMutation,
} from "../state/api/userApi";
import { removeCredentials } from "../state/slice/userSlice";
import LoadingSpinner from "./LoadingSpinner";

const Home = () => {
  const { data: users, error, isLoading, refetch } = useGetUsersQuery();
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();
  const [logoutUser, { isLoading: logoutLoading }] = useLogoutUserMutation();
  const dispatch = useDispatch();

  const handleSelectUser = user => {
    setSelectedUser(user);
  };

  const handleUpdate = async () => {
    if (selectedUser) {
      try {
        await updateUser({
          id: selectedUser._id,
          name: selectedUser.name,
          phone: selectedUser.phone,
        }).unwrap();
        setSelectedUser(null);
        refetch();
        toast.success("User updated successfully");
      } catch (error) {
        toast.error(error?.data?.message);
      }
    }
  };

  const handleDelete = async id => {
    try {
      await deleteUser(id).unwrap();
      refetch();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(removeCredentials()); // Clear user credentials from Redux store
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>{error?.data?.message}</p>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Registered Users</h1>
        <button
          className="btn btn-danger btn-sm d-none d-lg-block"
          onClick={handleLogout}
          disabled={logoutLoading}
        >
          Logout
        </button>
        <button
          className="btn btn-danger btn-sm d-lg-none"
          onClick={handleLogout}
          disabled={logoutLoading}
        >
          Logout
        </button>
      </div>

      {users?.data?.length > 0 && (
        <div className="table-responsive">
          <table
            className="table table-bordered table-striped"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Profession</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.profession}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleSelectUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user._id)}
                      disabled={deleteLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="mt-4">
          <h2>Edit User</h2>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={selectedUser.name}
              onChange={e =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              value={selectedUser.phone}
              onChange={e =>
                setSelectedUser({ ...selectedUser, phone: e.target.value })
              }
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleUpdate}
            disabled={updateLoading}
          >
            Update User
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
