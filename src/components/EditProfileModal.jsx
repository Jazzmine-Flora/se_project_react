import { useState, useContext, useEffect } from "react";
import ModalWithForm from "./ModalWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

const EditProfileModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const { currentUser, updateCurrentUser } = useContext(CurrentUserContext);

  // Pre-fill form with current user data when modal opens
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateCurrentUser({ name, avatar });
    onClose();
  };

  return (
    <ModalWithForm
      title="Change profile data"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
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
