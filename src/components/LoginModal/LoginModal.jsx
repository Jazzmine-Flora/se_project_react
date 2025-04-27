import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { login } from "../../utils/auth"; // Adjust the import path as necessary

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    onLogin({ email, password }) // Use the onLogin prop instead of direct login
      .catch((err) => {
        setErrorMessage("Invalid email or password");
        console.error(err);
      });
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
      onSubmit={handleSubmit}
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
