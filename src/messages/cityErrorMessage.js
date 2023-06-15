function cityErrorMessage(message) {
  if (message === 'city not found') {
    return 'City not found. Try again';
  }

  return message;
}

module.exports = { cityErrorMessage };
