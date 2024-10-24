import "./ItemModal.css";
import closeIcon from "../../assets/Cross.svg";
import DeleteItemModal from "../DeleteItemModal/DeleteItemModal";

function ItemModal({
  activeModal,
  onClose,
  isOpen,
  card,
  onDelete,
  onConfirm,
}) {
  return (
    <div className={`modal ${isOpen && "modal_opened"}`}>
      <div className="modal__content modal__content_type_image ">
        <button onClick={onClose} className="modal__close" type="button">
          <img className="modal__close-icon" src={closeIcon} alt="close" />
        </button>
        <img src={card.imageUrl} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather: {card.weather}</p>
          <button
            className="modal__delete-btn"
            type="button"
            onClick={onDelete}
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
