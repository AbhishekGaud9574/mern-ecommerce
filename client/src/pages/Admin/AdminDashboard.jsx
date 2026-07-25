import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";

function AdminDashboard() {
  const [auth] = useAuth();

  return (
    <Layout title="Admin Dashboard">
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <div className="card shadow p-4">
              <h2 className="mb-4">Admin Dashboard</h2>

              <p>
                <strong>Name:</strong> {auth?.user?.name}
              </p>

              <p>
                <strong>Email:</strong> {auth?.user?.email}
              </p>

              <p>
                <strong>Contact:</strong> {auth?.user?.phone}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {auth?.user?.role === 1 ? "Admin" : "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
