import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "../../css/Header.css";

function Header() {
  const [cart] = useCart();
  const [auth, setAuth] = useAuth();
  const categories = useCategory();
  const [showCategory, setShowCategory] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout successfully!");
  };

  const isAdmin = auth?.user?.role === 1; // Check if user is admin

  return (
    <div className="navbar navbar-expand-lg bg-body-tertiary sticky-header">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <Link to="/" className="navbar-brand">
            <img
              src="\images\l1.png"
              alt="E-Commerce"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "10px",
              }}
              className="bounce-effect"
            />
            <span className="bounce-effect">ShopEase</span>
          </Link>

          {/* Conditionally render Search for non-admin users */}
          {!isAdmin && (
            <div className="search-container">
              <SearchInput />
            </div>
          )}

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Conditionally render for non-admin users */}
            {!isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink to="/" className="nav-link" aria-current="page">
                    Home
                  </NavLink>
                </li>
                <li
                  className="nav-item dropdown"
                  onMouseEnter={() => setShowCategory(true)}
                  onMouseLeave={() => setShowCategory(false)}
                >
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCategory(!showCategory);
                    }}
                  >
                    Categories
                  </a>

                  <ul className={`dropdown-menu ${showCategory ? "show" : ""}`}>
                    <li>
                      <Link
                        to="/categories"
                        className="dropdown-item"
                        onClick={() => setShowCategory(false)}
                      >
                        All Categories
                      </Link>
                    </li>

                    {categories?.map((category) => (
                      <li key={category._id}>
                        <Link
                          to={`/category/${category.slug}`}
                          className="dropdown-item"
                          onClick={() => setShowCategory(false)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </>
            )}

            {!auth.user ? (
              !isAdmin && (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Register
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                </>
              )
            ) : (
              <li className="nav-item dropdown position-relative">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowUserMenu(!showUserMenu);
                  }}
                >
                  {auth?.user?.name}
                </a>

                {showUserMenu && (
                  <ul className="dropdown-menu show">
                    <li>
                      <NavLink
                        to={`/dashboard/${isAdmin ? "admin" : "user"}`}
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/login"
                        className="dropdown-item"
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {/* Conditionally render Cart for non-admin users */}
            {!isAdmin && (
              <li className="nav-item">
                <Badge count={cart?.length} showZero>
                  <NavLink to="/cart" className="nav-link" href="#">
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </NavLink>
                </Badge>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
