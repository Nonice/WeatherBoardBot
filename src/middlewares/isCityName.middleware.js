function isCityName(ctx, next) {
  if (ctx.session.cityName) {
    next();
  }
}

module.exports = { isCityName };
