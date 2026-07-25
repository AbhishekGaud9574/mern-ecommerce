import { NavLink } from "react-router-dom";

function UserMenu() {
  return (
    <div className="text-center">
      <h4>Dashboard</h4>

      <div className="list-group">
        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${
              isActive ? "active" : "text-dark"
            }`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${
              isActive ? "active" : "text-dark"
            }`
          }
        >
          Orders
        </NavLink>
      </div>
    </div>
  );
}

export default UserMenu;
