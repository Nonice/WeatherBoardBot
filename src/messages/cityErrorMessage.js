function cityErrorMessage(message) {
  if (message === 'city not found') {
    return message[0].toUpperCase() + message.slice(1);
  }

  return message;
}

module.exports = { cityErrorMessage };
