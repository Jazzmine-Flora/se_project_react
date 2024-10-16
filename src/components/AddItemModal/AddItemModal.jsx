import React, { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./AddItemModal.css";

const AddItemModal = ({ activeModal, handleCloseModal, isOpen, onAddItem }) => {
  const [name, setName] = React.useState("");
  const [link, setUrl] = React.useState("");
  const [weather, setWeather] = React.useState("");
  const handleNameChange = (e) => {
    console.log(e.target.value);
    setName(e.target.value);
  };

  const handleUrlChange = (e) => {
    console.log(e.target.value);
    setUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem(e, { name, link });
  };

  const handleWeatherChange = (e) => {
    console.log(e.target.value);
    setWeather(e.target.value);
  };

  return (
    <ModalWithForm
      buttonText="Add garment"
      title="New garment"
      activeModal={activeModal}
      onClose={handleCloseModal}
      isOpen={isOpen}
      onSubmit={handleSubmit}
    >
      <label htmlFor="name" className="modal__label">
        <p className="input__title">Name</p>
        <input
          className="modal__input"
          type="text"
          id="name"
          placeholder="Name"
          onChange={handleNameChange}
          value={name}
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
          onChange={handleUrlChange}
          value={link}
          required
        />
      </label>
      <fieldset className="modal__fieldset">
        <legend className="modal__legend">Select the weather type:</legend>
        <label htmlFor="hot" className="modal__label modal__label_type_radio">
          <input
            className="modal__radio-input"
            type="radio"
            id="hot"
            name="weather"
            onChange={handleWeatherChange}
            required
          />
          Hot
        </label>
        <label htmlFor="warm" className="modal__label modal__label_type_radio">
          <input
            className="modal__radio-input"
            type="radio"
            id="warm"
            name="weather"
            onChange={handleWeatherChange}
            required
          />
          Warm
        </label>
        <label htmlFor="cold" className="modal__label modal__label_type_radio">
          <input
            className="modal__radio-input"
            type="radio"
            id="cold"
            name="weather"
            onChange={handleWeatherChange}
            required
          />
          Cold
        </label>
      </fieldset>
    </ModalWithForm>
  );
};

export default AddItemModal;
