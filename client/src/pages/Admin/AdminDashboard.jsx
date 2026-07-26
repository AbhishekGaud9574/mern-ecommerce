import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import "../../css/Dashboard.css";

function AdminDashboard() {
  const [auth] = useAuth();

  return (
    <Layout title="Admin Dashboard">
      <div className="container-fluid admin-dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <div className="admin-profile-card">
              <h2 className="mb-4">Admin Dashboard</h2>

              <div className="admin-info">
                <strong>Name:</strong>
                <span>{auth?.user?.name}</span>
              </div>

              <div className="admin-info">
                <strong>Email:</strong>
                <span>{auth?.user?.email}</span>
              </div>

              <div className="admin-info">
                <strong>Contact:</strong> <span>{auth?.user?.phone}</span>
              </div>

              <div className="admin-info">
                <strong>Role:</strong>
                <span className="admin-role">
                  {auth?.user?.role === 1 ? "Admin" : "User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
