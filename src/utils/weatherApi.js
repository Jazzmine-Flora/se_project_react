import CurrentTemperatureUnitContext from "../contexts/CurrentTemperatureUnitContext";

export const getWeather = ({ latitude, longitude }, APIkey) => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}&units=metric`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject("Error: ${response.status}");
    }
  });
};

export const filterWeatherData = (data) => {
  const result = {};
  result.city = data.name;
  result.temp = {
    F: Math.round(data.main.temp * 1.8 + 32),
    C: Math.round(data.main.temp),
  };
  result.type = getWeatherType(result.temp.F);
  result.condition = data.weather[0].main.toLowerCase();
  result.isDay = isDay(data.sys, Date.now());
  return result;

  const main = data.main;
  const temperature = main && main.temp;
  const weather = {
    temperature: {
      F: Math.round(temperature * 1.8 + 32),
      C: Math.round(((temperature - 32) * 5) / 9),
    },
  };
  console.log(weather);
  return weather;
};

// export const parseWeatherData = (data) => {
//   const main = data.main;
//   const temperature = main && main.temp;
//   const weather = {
//     temperature: {
//       F: Math.round(temperature * 1.8 + 32),
//       C: Math.round(((temperature - 32) * 5) / 9),
//     },
//   };
//   console.log(weather);
//   return weather;
// };

const isDay = ({ sunrise, sunset }, now) => {
  return sunrise * 1000 < now && now < sunset * 1000;
};

export const getWeatherType = (temperature) => {
  // const temp =
  //   filterWeatherData?.temperature?.[CurrentTemperatureUnitContext] || 999;
  if (temperature > 86) {
    return "hot";
  } else if (temperature >= 69 && temperature < 86) {
    return "warm";
  } else {
    return "cold";
  }
};

// weather.temperature.F = data.main.temp;
// weather.temperature.C = Math.round((data.main.temp - 32) * 5/9);
