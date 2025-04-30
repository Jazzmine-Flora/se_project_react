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
  console.log("DeleteItemModal props:", { activeModal, isOpen, selectedCard });
  console.log("DeleteItemModal received selectedCard:", selectedCard);
  const handleOnConfirmDelete = (e) => {
    e.preventDefault();
    console.log("Attempting to delete card:", selectedCard); // Add this line
    if (selectedCard && selectedCard._id) {
      onConfirm(selectedCard._id);
    } else {
      console.error("No selected card or card ID");
    }
  };

  console.log("DeleteItemModal selectedCard ID:", selectedCard?._id);

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
            type="button"
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
