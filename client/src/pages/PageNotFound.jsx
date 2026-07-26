import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../css/PageNotFound.css";

function PageNotFound() {
  return (
    <Layout title="404 - Page Not Found">
      <div className="pnf">
        <h1 className="pnf-title">404</h1>

        <h2 className="pnf-heading">Oops! Page Not Found</h2>

        <p className="text-muted mb-4">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link to="/" className="pnf-btn">
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}

export default PageNotFound;
