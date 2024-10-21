import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./DeleteItemModal.css";
import closeIcon from "../../assets/close icon.svg";

function DeleteItemModal({
  activeModal,
  onConfirm,
  onClose,
  isOpen,
  onSubmit,
}) {
  return (
    <div className={`modal ${isOpen && "modal_opened"}`}>
      <div className="delete-modal__content">
        <h2 className="delete-modal__text">
          Are you sure you want to delete this item?
          <br />
          This action is irreversible.
          <br />
        </h2>
        <button onClick={onClose} className="modal__close" type="button">
          <img className="modal__close-icon" src={closeIcon} alt="close" />
        </button>
        <form onSubmit={onSubmit} className="modal__form">
          <button
            className="delete-modal__submit"
            type="submit"
            onClick={onConfirm}
          >
            Yes, delete item
          </button>
          <button className="cancel__submit" type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default DeleteItemModal;
