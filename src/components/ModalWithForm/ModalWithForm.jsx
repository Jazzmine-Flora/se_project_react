import "./ModalWithForm.css";
import closeIcon from "../../assets/close icon.svg";

function ModalWithForm() {
  return (
    <div className="modal">
      <div className="modal__content">
        <h2 className="modal__title">New Garments</h2>
        <button className="modal__close" type="button">
          <img className="modal__close-icon" src={closeIcon} alt="close" />
        </button>
        <form className="modal__form">
          <label htmlFor="name" className="modal__label">
            <p className="input__title">Name</p>
            <input
              className="modal__input"
              type="text"
              id="name"
              placeholder="Name"
              required
            />
          </label>
          <label htmlFor="imageUrl" className="modal__label">
            <p className="input__title">Image</p>
            <input
              className="modal__input"
              type="url"
              id="imageUrl"
              placeholder="Image URL"
              required
            />
          </label>
          <fieldset className="modal__fieldset">
            <legend className="modal__legend">Select the weather type:</legend>
            <label
              htmlFor="hot"
              className="modal__label modal__label_type_radio"
            >
              <input
                className="modal__radio-input"
                type="radio"
                id="hot"
                required
              />
              Hot
            </label>
            <label
              htmlFor="warm"
              className="modal__label modal__label_type_radio"
            >
              <input
                className="modal__radio-input"
                type="radio"
                id="warm"
                required
              />
              Warm
            </label>
            <label
              htmlFor="cold"
              className="modal__label modal__label_type_radio"
            >
              <input
                className="modal__radio-input"
                type="radio"
                id="cold"
                required
              />
              Cold
            </label>
          </fieldset>
          <button
            className="modal__submit modal__submit_disabled"
            type="submit"
          >
            Add garment
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
