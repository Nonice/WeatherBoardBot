function isCityName(ctx) {
  if (ctx.session.cityName) {
    return true;
  }
}

module.exports = { isCityName };
