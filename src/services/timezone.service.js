async function checkedTimezone({ text, session }) {
  const timezone = Number(text);

  if (isNaN(timezone) || timezone < -11 || timezone > 14) {
    return 'Not valid! Try again';
  }

  session.timezone = timezone;
  session.inputState = null;

  return `Setted timezone = ${timezone}`;
}

module.exports = { checkedTimezone };
