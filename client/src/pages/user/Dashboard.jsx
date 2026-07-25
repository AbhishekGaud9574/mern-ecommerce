import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

function Dashboard() {
  const [auth] = useAuth();

  return (
    <Layout title="User Dashboard">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <div className="card p-4 shadow" style={{ maxWidth: "500px" }}>
              <h3 className="mb-3">User Information</h3>

              <p>
                <strong>Name:</strong> {auth?.user?.name}
              </p>

              <p>
                <strong>Email:</strong> {auth?.user?.email}
              </p>

              <p>
                <strong>Phone:</strong> {auth?.user?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
