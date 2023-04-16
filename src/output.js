function printWeatherData(weatherData) {
  return (
    '📍Погода за вашими координатами \n🌡️ Температура: ' +
    weatherData.temp +
    '°C \n🌀 Швидкість вітру: ' +
    weatherData.speedwind +
    'м/c \n🪟 За вікном зараз ' +
    weatherData.status
    //📍Місто: Запоріжжя 🌡️ Температура: ##.  🌀 Швидкість вітру: ##.  🪟 За вікном зараз.
  );
}

module.exports = { printWeatherData };
