import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { login } from "../../utils/auth"; // Adjust the import path as necessary
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    console.log("LoginModal - Attempting to login with:", { email, password });
    try {
      const response = await onLogin({ email, password });
      if (response && response.token) {
        onClose(); // Only close if we got a successful response
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Invalid email or password");
      console.error("Login error:", err);
    }
  };
  const handleCloseModal = () => {
    onClose();
    setEmail("");
    setPassword("");
    setErrorMessage(""); // Clear error message on close
  };

  return (
    <ModalWithForm
      title="Log in"
      buttonText="Log in"
      isOpen={isOpen}
      onClose={handleCloseModal}
      onOverlayClick={handleCloseModal}
      handleSubmit={handleSubmit}
      isValid={email.length > 0 && password.length > 0}
      onSubmit={handleSubmit}
      className="login-modal"
    >
      <label className="modal__label">
        Email*
        <input
          type="email"
          className="modal__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
      </label>
      <label className="modal__label">
        Password*
        <input
          type="password"
          className="modal__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </label>
      {errorMessage && <p className="modal__error">{errorMessage}</p>}
    </ModalWithForm>
  );
};

export default LoginModal;
