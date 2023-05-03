/*
  recordDataToObject

  record - transform `Data` to `Object`
  Data - api result
  Object - standart data for service 

  transformApiResultToStandart
*/

function recordDataToObject(data) {
  const obj = {
    city: data.name,
    temp: data.main.temp,
    status: data.weather[0].description,
    speedwind: data.wind.speed,
  };

  return obj;
}

module.exports = { recordDataToObject };
