function transformApiDataToStandart(data) {
  const obj = {
    cod: data.cod,
    city: data.name,
    temp: data.main.temp,
    status: data.weather[0].description,
    speedwind: data.wind.speed,
  };

  return obj;
}

module.exports = { transformApiDataToStandart };
