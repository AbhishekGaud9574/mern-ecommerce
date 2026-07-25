import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import * as bootstrap from "bootstrap";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "", // Added phone field
    password: "",
    role: "0", // Default role is "User"
  });
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "", // Added phone field
    role: "0",
  });

  // Fetch Users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-users");
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        toast.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Handle Input Change for Adding User
  const handleInputChange = (e) => {
    setNewUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (newUser.password.length < 6) {
      return toast.error("Password must be 6 characters");
    }

    if (!/^\d{10}$/.test(newUser.phone)) {
      return toast.error("Phone number must be 10 digits");
    }

    try {
      setActionLoading(true);

      const { data } = await axios.post("/api/v1/auth/add-user", {
        ...newUser,
        role: Number(newUser.role),
      });

      if (data.success) {
        toast.success("User Added Successfully");

        setUsers((prev) => [...prev, data.user]);

        setNewUser({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "0",
        });

        // Close Bootstrap Modal
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("addUserModal"),
        );

        modal.hide();
      } else {
        toast.error("Failed to add user");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Edit User Click
  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    try {
      const { data } = await axios.put(
        `/api/v1/auth/update-user/${editingUser}`,
        {
          ...editForm,
          role: Number(editForm.role),
        },
      );

      if (data.success) {
        toast.success("User updated successfully!");
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUser
              ? {
                  ...user,
                  ...editForm,
                  role: Number(editForm.role),
                }
              : user,
          ),
        );
        setEditingUser(null);
      } else {
        toast.error("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);

    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    });
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const { data } = await axios.delete(`/api/v1/auth/delete-user/${userId}`);

      if (data.success) {
        toast.success("User deleted successfully!");
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Layout title="Dashboard - Manage Users">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Users</h1>
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
              {/* Search Box */}
              <div className="search-box position-relative">
                <i className="fa-solid fa-search search-icon"></i>

                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Add User Button */}
              <button
                className="btn btn-primary add-user-btn"
                data-bs-toggle="modal"
                data-bs-target="#addUserModal"
              >
                <i className="fa-solid fa-user-plus me-2"></i>
                Add User
              </button>
            </div>

            {/* Add User Modal */}
            <div
              className="modal fade"
              id="addUserModal"
              tabIndex="-1"
              aria-labelledby="addUserModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow rounded-4">
                  {/* Header */}
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title fw-bold" id="addUserModalLabel">
                      <i className="fa-solid fa-user-plus me-2"></i>
                      Add New User
                    </h5>

                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      data-bs-dismiss="modal"
                    ></button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleAddUser}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            Full Name
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Full Name"
                            name="name"
                            value={newUser.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            Email Address
                          </label>

                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            Phone Number
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Phone Number"
                            name="phone"
                            value={newUser.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            Password
                          </label>

                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter Password"
                            name="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-12 mb-3">
                          <label className="form-label fw-semibold">
                            User Role
                          </label>

                          <select
                            className="form-select"
                            name="role"
                            value={newUser.role}
                            onChange={handleInputChange}
                          >
                            <option value="0">👤 User</option>
                            <option value="1">🛡️ Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="btn btn-primary"
                      >
                        {actionLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-user-plus me-2"></i>
                            Add User
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* User List */}
            {loading ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(
                        (user) =>
                          user.name
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          user.email
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                      )
                      .map((user, index) => (
                        <tr key={user._id}>
                          <td>{index + 1}</td>

                          {/* Avatar + Name */}
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  user.name,
                                )}&background=0D6EFD&color=fff&bold=true`}
                                alt={user.name}
                                className="user-avatar me-3"
                              />

                              {editingUser === user._id ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  value={editForm.name}
                                  onChange={handleEditChange}
                                />
                              ) : (
                                <span className="fw-semibold">{user.name}</span>
                              )}
                            </div>
                          </td>

                          {/* Email */}
                          <td>
                            {editingUser === user._id ? (
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={editForm.email}
                                onChange={handleEditChange}
                              />
                            ) : (
                              user.email
                            )}
                          </td>

                          {/* Role */}
                          <td>
                            {editingUser === user._id ? (
                              <select
                                className="form-select"
                                name="role"
                                value={editForm.role}
                                onChange={handleEditChange}
                              >
                                <option value="0">User</option>
                                <option value="1">Admin</option>
                              </select>
                            ) : Number(user.role) === 1 ? (
                              <span className="badge bg-danger px-3 py-2">
                                <i className="fa-solid fa-user-shield me-1"></i>
                                Admin
                              </span>
                            ) : (
                              <span className="badge bg-primary px-3 py-2">
                                <i className="fa-solid fa-user me-1"></i>
                                User
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td>
                            <span className="badge bg-success px-3 py-2">
                              <i className="fa-solid fa-circle me-1"></i>
                              Active
                            </span>
                          </td>

                          {/* Actions */}
                          <td>
                            {editingUser === user._id ? (
                              <>
                                <button
                                  className="btn btn-success btn-sm me-2"
                                  onClick={handleSaveEdit}
                                >
                                  <i className="fa-solid fa-check">✔</i>
                                </button>

                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => setEditingUser(null)}
                                >
                                  <i className="fa-solid fa-xmark">❌</i>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-outline-primary btn-sm me-2"
                                  onClick={() => handleEditClick(user)}
                                >
                                  <i className="fa-solid fa-pen">✏️</i>
                                </button>

                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Users;
