/*
  transformStandartDataForOutputToUser

  print - transform
  WeatherData - standart api service data
  '' - to message | for output

  transformStandartDataForOutputToUser
*/

function transformStandartDataForOutputToUser(weatherData) {
  return (
    `📍Погода за вашими координатами \n` +
    `🌡️ Температура: ${weatherData.temp}°C \n` +
    `🌀 Швидкість вітру: ${weatherData.speedwind}м/c \n` +
    `🪟 За вікном зараз ${weatherData.status} `
  );
}

module.exports = { transformStandartDataForOutputToUser };
