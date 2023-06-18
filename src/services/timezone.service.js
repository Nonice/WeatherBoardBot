async function checkedTimezone({ text, session }) {
  const timezone = Number(text);

  if (isNaN(timezone) || timezone < -11 || timezone > 14) {
    return 'Недійсно! Спробуйте ще раз.';
  }

  session.timezone = timezone;
  session.inputState = null;

  return `Часовий пояс встановлено UTC+${timezone}`;
}

module.exports = { checkedTimezone };
