import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import "../../css/Dashboard.css";

function Dashboard() {
  const [auth] = useAuth();

  return (
    <Layout title="User Dashboard">
      <div className="container-fluid admin-dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <div className="admin-profile-card">
              <h2 className="mb-4">User Information</h2>

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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
