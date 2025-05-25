import "./ModalWithForm.css";
import closeIcon from "../../assets/close icon.svg";

function ModalWithForm({
  children,
  buttonText,
  secondaryButtonText,
  onSecondaryClick,
  title,
  isOpen,
  onClose,
  onSubmit,
  isValid,
  className,
}) {
  return (
    <div className={`modal ${isOpen && "modal_opened"}`}>
      <div className={`modal__content ${className || ""}`}>
        {" "}
        {/* Make sure className is added here */}
        <h2 className="modal__title">{title}</h2>
        <button onClick={onClose} className="modal__close" type="button">
          <img className="modal__close-icon" src={closeIcon} alt="close" />
        </button>
        <form
          onSubmit={(e) => {
            console.log("ModalWithForm - Form submission triggered");
            onSubmit(e);
          }}
          className="modal__form"
        >
          {children}
          <div className="modal__button-container">
            <button type="submit" className="modal__submit" disabled={!isValid}>
              {buttonText}
            </button>
            <p className="modal__or">or</p>
            {secondaryButtonText && (
              <button
                type="button"
                className="modal__secondary-button"
                onClick={onSecondaryClick}
                // disabled={!isValid}
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalWithForm;
