import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";
import "../../css/Layout.css";

function Layout({
  children,
  title = "E-Commerce App",
  description = "Best online shopping platform",
  keywords = "shopping, ecommerce, products, online store",
  author = "E-Commerce App",
}) {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />

        <title>{title}</title>

        <meta name="description" content={description} />

        <meta name="keywords" content={keywords} />

        <meta name="author" content={author} />
      </Helmet>

      <Header />

      <main className="page-content">{children}</main>

      <Footer />
    </>
  );
}

export default Layout;
