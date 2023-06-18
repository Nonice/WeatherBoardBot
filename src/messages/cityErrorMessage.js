function cityErrorMessage(message) {
  if (message === 'city not found') {
    return 'Місто не знайдено. Спробуйте ще раз.';
  }

  return message;
}

module.exports = { cityErrorMessage };
