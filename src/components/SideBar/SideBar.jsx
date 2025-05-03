import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import "./SideBar.css";

function SideBar({ onEditProfile }) {
  // Add onEditProfile prop here
  const currentUser = useContext(CurrentUserContext); // Add this line to use context

  return (
    <div className="sidebar">
      <nav className="sidebar__nav">
        <nav className="sidebar__nav-container">
          <img
            className="sidebar__avatar"
            src={currentUser?.avatar || avatar} // Use user's avatar if available
            alt="Sidebar Avatar"
          />
          <p className="sidebar__username">{currentUser?.name || "Taliba"}</p>
        </nav>
        <ul className="sidebar__nav-list">
          <li className="sidebar__nav-item">
            <button
              className="sidebar__nav-link sidebar__nav-link_active"
              type="button"
              onClick={onEditProfile}
            >
              Change profile data
            </button>
          </li>
          <li className="sidebar__nav-item">
            <button className="sidebar__nav-link" type="button">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SideBar;
