import { Link } from "react-router-dom";

import "./Header.css";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";

function Header({
  handleAddClick,
  weatherData,
  isLoggedIn,
  onLoginClick = { handleLogin },
  currentUser,
  onLogout, // Add a comma here
  onSignupClick, // Move this inside the props object
}) {
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  return (
    <header className="header">
      <Link to="/">
        <img className="header__logo" src={logo} alt="WTWR logo" />
      </Link>

      <p className="header__text">
        {currentDate}, {weatherData.city}
      </p>

      <ToggleSwitch />

      {isLoggedIn ? (
        <>
          <button
            onClick={handleAddClick}
            type="button"
            className="header__add-clothes-btn"
          >
            + Add clothes
          </button>
          <Link to="/profile" className="header__link">
            <div className="header__user">
              <p className="header__username">{currentUser?.name || "User"}</p>
              <img
                src={currentUser?.avatar || avatar}
                alt="User avatar"
                className="header__avatar"
              />
            </div>
          </Link>
          {/* <button className="header__button" onClick={onLogout}>
            Log out
          </button> */}
        </>
      ) : (
        <div className="header__buttons">
          <button className="header__button" onClick={onSignupClick}>
            Sign up
          </button>
          <button className="header__button" onClick={onLoginClick}>
            Log in
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
