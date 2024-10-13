import React, { useContext, useState } from "react";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";
import { defaultClothingItems } from "../../utils/constants";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";

// import "App.jsx";
// import "./ItemCard.css";

function Main({ weatherData, handleCardClick }) {
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
          {defaultClothingItems
            .filter((item) => {
              return item.weather === weatherData.type;
            })
            .map((item) => {
              return (
                <ItemCard
                  key={item._id}
                  item={item}
                  onCardClick={handleCardClick}
                />
              );
            })}
        </ul>
      </section>
    </main>
  );
}

export default Main;
