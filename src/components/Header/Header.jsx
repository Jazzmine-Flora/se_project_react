import "./Header.css";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar.svg";

function Header({ handleAddClick }) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="WTWR logo" />
      <p className="header__text">Date, Location</p>
      <button
        onClick={handleAddClick}
        type="button"
        className="header__add-clothes-btn"
      >
        + Add clothes
      </button>
      <div className="header__user">
        <p className="header__username">Terrence Tegegne</p>
        <img src={avatar} alt="Terrence Tegegne" className="header__avatar" />
      </div>
    </header>
  );
}

export default Header;
