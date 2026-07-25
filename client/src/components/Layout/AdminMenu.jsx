import { NavLink } from "react-router-dom";

function AdminMenu() {
  return (
    <div className="text-center">
      <h4 className="mb-3">Admin Panel</h4>

      <div className="list-group">
        <NavLink
          to="/dashboard/admin/create-category"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${
              isActive ? "active" : "text-dark"
            }`
          }
        >
          Create Category
        </NavLink>

        <NavLink
          to="/dashboard/admin/create-product"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${
              isActive ? "active" : "text-dark"
            }`
          }
        >
          Create Product
        </NavLink>

        <NavLink
          to="/dashboard/admin/products"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${
              isActive ? "active" : "text-dark"
            }`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/dashboard/admin/orders"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${
              isActive ? "active" : "text-dark"
            }`
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/dashboard/admin/users"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${
              isActive ? "active" : "text-dark"
            }`
          }
        >
          Users
        </NavLink>
      </div>
    </div>
  );
}

export default AdminMenu;
