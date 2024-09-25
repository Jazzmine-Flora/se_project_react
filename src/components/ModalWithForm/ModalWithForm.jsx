import "./ModalWithForm.css";
import closeIcon from "../../assets/close icon.svg";

function ModalWithForm({ children, buttonText, title }) {
  return (
    <div className="modal">
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <button className="modal__close" type="button">
          <img className="modal__close-icon" src={closeIcon} alt="close" />
        </button>
        <form className="modal__form">
          {children}
          <button
            className="modal__submit modal__submit_disabled"
            type="submit"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
