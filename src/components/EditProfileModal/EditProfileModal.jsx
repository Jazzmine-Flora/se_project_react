import { useState, useContext, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./EditProfileModal.css";

import { CurrentUserContext } from "../../contexts/CurrentUserContext";

const EditProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  updateCurrentUser,
}) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const isFormValid = name.length > 0 && avatar.length > 0;
  const resetForm = () => {
    console.log("Resetting form...");
    setName("");
    setAvatar("");
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name || "");
      setAvatar(currentUser.avatar || "");
    } else if (!isOpen) {
      setName("");
      setAvatar("");
    }
  }, [isOpen]);
  const handleSubmit = (e) => {
    e.preventDefault();
    updateCurrentUser({ name, avatar });
  };

  return (
    <ModalWithForm
      title="Change profile data"
      isOpen={isOpen}
      onClose={handleClose}
      buttonText="Save"
      onSubmit={handleSubmit}
      isValid={isFormValid}
    >
      <label className="modal__label">
        Name*
        <input
          className="modal__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
      </label>

      <label className="modal__label">
        Avatar URL
        <input
          className="modal__input"
          type="url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Avatar URL"
          required
        />
      </label>

      {/* <button className="modal__submit modal__submit_disabled" type="submit">
        Save
      </button> */}
    </ModalWithForm>
  );
};

export default EditProfileModal;
