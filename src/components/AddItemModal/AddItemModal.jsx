import React, { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { api } from "../../utils/api";
import "./AddItemModal.css";

const AddItemModal = ({ activeModal, handleCloseModal, isOpen, onSubmit }) => {
  console.log("AddItemModal props:", {
    activeModal,
    handleCloseModal,
    isOpen,
    onSubmit,
  });
  const [name, setName] = React.useState("");
  const [imageUrl, setUrl] = React.useState("");
  const [weather, setWeather] = React.useState("");

  const handleNameChange = (e) => {
    console.log(e.target.value);
    setName(e.target.value);
  };

  const resetForm = () => {
    setName("");
    setUrl("");
    setWeather("");
  };

  const handleUrlChange = (e) => {
    console.log(e.target.value);
    setUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    console.log("AddItemModal - handleSubmit triggered");
    e.preventDefault();

    console.log("Form values before validation:", { name, imageUrl, weather });

    // Check if all required fields are filled
    if (!name || !imageUrl || !weather) {
      console.log("Validation failed - Missing fields:", {
        name: !name,
        imageUrl: !imageUrl,
        weather: !weather,
      });
      return;
    }

    const newItem = { name, imageUrl, weather };
    console.log("Submitting new item:", newItem);

    try {
      onSubmit(newItem);
      resetForm();
      console.log("onSubmit called successfully");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleWeatherChange = (e) => {
    console.log("Weather selected:", e.target.value);
    setWeather(e.target.value);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <ModalWithForm
      buttonText="Add garment"
      title="New garment"
      activeModal={activeModal}
      onClose={handleCloseModal}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      isValid={name.length > 0 && imageUrl.length > 0 && weather.length > 0}
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
          value={imageUrl}
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
            value="hot"
            checked={weather === "hot"}
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
            value="warm"
            checked={weather === "warm"}
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
            value="cold"
            checked={weather === "cold"}
          />
          Cold
        </label>
      </fieldset>
    </ModalWithForm>
  );
};

export default AddItemModal;
