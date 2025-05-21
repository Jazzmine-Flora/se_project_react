import { useState, useContext, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./EditProfileModal.css";
import "../LoginModal/LoginModal.css";

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
    setName("");
    setAvatar("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with values:", { name, avatar });
    try {
      await updateCurrentUser({ name, avatar });
      console.log("Update successful");
      // Don't reset the form here since we want to keep the values
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  // Remove handleClose function as it's redundant

  useEffect(() => {
    if (isOpen && currentUser) {
      console.log("Current user in modal:", currentUser);
      setName(currentUser.name || "");
      setAvatar(currentUser.avatar || "");
    }
  }, [isOpen, currentUser]);

  return (
    <ModalWithForm
      title="Change profile data"
      isOpen={isOpen}
      onClose={onClose} // Use onClose directly
      buttonText="Save"
      onSubmit={handleSubmit}
      isValid={isFormValid}
      className="modal_type_edit-profile"
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
    </ModalWithForm>
  );
};

export default EditProfileModal;
