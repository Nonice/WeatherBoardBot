function transformStandartDataForOutputToUser(weatherData) {
  return (
    `📍Погода за вашими координатами \n` +
    `🌡️ Температура: ${weatherData.temp}°C \n` +
    `🌀 Швидкість вітру: ${weatherData.speedwind}м/c \n` +
    `🪟 За вікном зараз ${weatherData.status} `
  );
}

module.exports = { transformStandartDataForOutputToUser };
