function isNotification(ctx) {
  if (ctx.session.notificationCheck) {
    return true;
  }
}

module.exports = { isNotification };
