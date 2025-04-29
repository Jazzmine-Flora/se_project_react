import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./DeleteItemModal.css";
import closeIcon from "../../assets/close icon.svg";

function DeleteItemModal({
  activeModal,
  onConfirm,
  onClose,
  isOpen,
  onSubmit,
  onDelete,
  selectedCard, // Add this line to receive the selected card
}) {
  console.log("DeleteItemModal received selectedCard:", selectedCard);
  const handleOnConfirmDelete = (e) => {
    e.preventDefault();
    console.log("Attempting to delete card:", selectedCard);
    console.log("Selected card ID:", selectedCard?._id);

    if (!selectedCard) {
      console.error("No selected card found");
      return;
    }

    if (!selectedCard._id) {
      console.error("Selected card has no ID");
      return;
    }

    onConfirm(selectedCard._id);
  };

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
          <img
            className="delete-modal__close-icon"
            src={closeIcon}
            alt="close"
          />
        </button>
        <form className="modal__form">
          <button
            className="delete-modal__submit"
            type="submit"
            onClick={handleOnConfirmDelete}
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
