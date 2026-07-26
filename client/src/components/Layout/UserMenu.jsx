import { NavLink } from "react-router-dom";
import "../../css/UserMenu.css";

function UserMenu() {
  return (
    <div className="user-menu text-center">
      <h4 className="user-title">Dashboard</h4>

      <div className="list-group user-sidebar">
        <NavLink
          end
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${isActive ? "active" : ""}`
          }
        >
          <i className="fa-solid fa-user me-2"></i>
          Profile
        </NavLink>

        <NavLink
          end
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${isActive ? "active" : ""}`
          }
        >
          <i className="fa-solid fa-box me-2"></i>
          Orders
        </NavLink>
      </div>
    </div>
  );
}

export default UserMenu;
