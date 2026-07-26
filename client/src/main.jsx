import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import "./css/Global.css";
import "./css/Responsive.css"
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth.jsx";
import { Toaster } from "react-hot-toast";
import "antd/dist/reset.css";
import { SearchProvider } from "./context/search";
import { CartProvider } from "./context/cart";
import "./axiosSetup";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ProductProvider } from "./context/ProductContext.jsx";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HelmetProvider>
    <AuthProvider>
      <SearchProvider>
        <ProductProvider>
          <CartProvider>
            <BrowserRouter>
              <App />
              <Toaster />
            </BrowserRouter>
          </CartProvider>
        </ProductProvider>
      </SearchProvider>
    </AuthProvider>
  </HelmetProvider>,
);
