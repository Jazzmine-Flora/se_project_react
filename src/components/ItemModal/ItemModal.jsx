import "./ItemModal.css";
import closeIcon from "../../assets/Cross.svg";
import DeleteItemModal from "../DeleteItemModal/DeleteItemModal";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

function ItemModal({
  activeModal, // Make sure this prop is used
  onClose,
  isOpen,
  card,
  onDelete,
  onConfirm,
}) {
  // The modal should be open when activeModal is "preview" OR when isOpen is true
  const shouldBeOpen = activeModal === "preview" || isOpen;

  const { currentUser } = useContext(CurrentUserContext);

  const isOwn =
    currentUser &&
    card &&
    card.owner &&
    (card.owner === currentUser._id || card.owner._id === currentUser._id);

  return (
    <div className={`modal ${shouldBeOpen ? "modal_opened" : ""}`}>
      <div className="modal__content modal__content_type_image ">
        <button onClick={onClose} className="modal__close" type="button">
          <img className="modal__close-icon" src={closeIcon} alt="close" />
        </button>
        <img src={card.imageUrl} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather: {card.weather}</p>
          {isOwn && (
            <button
              className="modal__delete-btn"
              type="button"
              onClick={onDelete}
            >
              Delete Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
