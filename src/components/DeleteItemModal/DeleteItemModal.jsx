import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./DeleteItemModal.css";
import closeIcon from "../../assets/close icon.svg";

function DeleteItemModal({ onConfirm, onClose, isOpen, onSubmit }) {
  return (
    <div className={`modal ${isOpen && "modal_opened"}`}>
      <div className="modal__content">
        <h2 className="modal__title">Delete Confirmation</h2>
        <button onClick={onClose} className="modal__close" type="button">
          <img className="modal__close-icon" src={closeIcon} alt="close" />
        </button>
        <form onSubmit={onSubmit} className="modal__form">
          <p className="modal__text">
            Are you sure you want to delete this item?
          </p>
          <button
            className="modal__submit modal__submit_disabled"
            type="submit"
            onClick={onConfirm}
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default DeleteItemModal;
