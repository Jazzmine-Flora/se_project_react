import React, { useContext, useState } from "react";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";

import "./Main.css";
// import { defaultClothingItems } from "../../utils/constants";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";

import { CurrentUserContext } from "../../contexts/CurrentUserContext";
// import "App.jsx";
// import "./ItemCard.css";

function Main({
  weatherData,
  onCardClick,
  clothingItems,
  onCardLike,
  isLoggedIn,
  onDelete,
}) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);
  console.log(currentTemperatureUnit);
  const temp = weatherData?.temperature?.[currentTemperatureUnit];

  return (
    <main>
      <WeatherCard
        weatherData={weatherData}
        currentTemperatureUnit={currentTemperatureUnit}
      />
      <section className="cards">
        <p className="cards__text">
          Today is {weatherData.temp?.[currentTemperatureUnit]} &deg;{" "}
          {currentTemperatureUnit} / You may want to wear:
        </p>
        <ul className="cards__list">
          {clothingItems
            .filter((item) => {
              return item.weather === weatherData.type;
            })
            .map((item) => {
              return (
                <ItemCard
                  key={item._id}
                  item={item}
                  onCardClick={onCardClick}
                  isLoggedIn={isLoggedIn}
                  onCardLike={onCardLike}
                  currentUser={currentUser}
                  onDelete={onDelete}
                />
              );
            })}
        </ul>
      </section>
    </main>
  );
}

export default Main;
