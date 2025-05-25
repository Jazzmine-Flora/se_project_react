import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

const RegisterModal = ({
  isOpen,
  onClose,
  onRegister,
  onLogin,
  onLoginClick,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous errors

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    onRegister({ name, avatar, email, password })
      .then(() => {
        // After successful registration, attempt to log in
        return onLogin({ email, password });
      })
      .then(() => {
        // If both registration and login are successful, close the modal
        handleCloseModal();
      })
      .catch((error) => {
        setErrorMessage(
          "Registration failed. Please check your information and try again."
        );
        console.error(error); // For debugging purposes
      });
  };

  const handleCloseModal = () => {
    onClose();
    setName("");
    setEmail("");
    setPassword("");
    setAvatar("");
  };

  return (
    <ModalWithForm
      title="Sign up"
      buttonText="Sign up"
      isOpen={isOpen}
      onClose={handleCloseModal}
      onOverlayClick={handleCloseModal}
      onSubmit={handleSubmit}
      secondaryButtonText={"or Log in"}
      onSecondaryClick={onLoginClick}
    >
      <label className="modal__label">
        Name*
        <input
          className="modal__input"
          type="text"
          name="name"
          minLength="1"
          maxLength="30"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="modal__label">
        Email*
        <input
          className="modal__input"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="modal__label">
        Password*
        <input
          className="modal__input"
          type="password"
          name="password"
          minLength="8"
          maxLength="30"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label className="modal__label">
        Avatar URL
        <input
          className="modal__input"
          type="url"
          name="avatar"
          placeholder="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </label>
      {errorMessage && <p className="modal__error">{errorMessage}</p>}
    </ModalWithForm>
  );
};

export default RegisterModal;
