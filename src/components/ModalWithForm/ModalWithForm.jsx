import "./ModalWithForm.css";
import closeIcon from "../../assets/close icon.svg";

function ModalWithForm({ children, buttonText, title, isOpen, onClose }) {
  return (
    <div className={`modal ${isOpen && "modal_opened"}`}>
      <div className="modal__content">
        <h2 className="modal__title">{title}</h2>
        <button onClick={onClose} className="modal__close" type="button">
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
