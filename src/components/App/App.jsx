import { useState } from "react";

import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function App() {
  const [weatherData, setWeatherData] = useState({ type: "cold" });

  return (
    <div className="page">
      <div className="page__container">
        <Header />
        <Main weatherData={weatherData} />
      </div>
      <ModalWithForm buttonText="Add garment" title="New garment">
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
          <label htmlFor="hot" className="modal__label modal__label_type_radio">
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
      </ModalWithForm>
    </div>
  );
}

export default App;
