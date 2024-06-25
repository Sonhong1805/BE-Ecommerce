const randomId = () => {
  const number = Math.floor(Math.random() * 1000000000000000);
  return number;
};

module.exports = randomId;
