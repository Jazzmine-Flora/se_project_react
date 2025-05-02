import avatar from "../../assets/avatar.svg";

import "./SideBar.css";

function SideBar() {
  return (
    <div className="sidebar">
      <nav className="sidebar__nav">
        <nav className="sidebar__nav-container">
          <img className="sidebar__avatar" src={avatar} alt="Sidebar Avatar" />
          <p className="sidebar__username">Taliba</p>
        </nav>
        <ul className="sidebar__nav-list">
          <li className="sidebar__nav-item">
            <button className="sidebar__nav-link sidebar__nav-link_active">
              Change profile data
            </button>
          </li>
          <li className="sidebar__nav-item">
            <button className="sidebar__nav-link">Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SideBar;
