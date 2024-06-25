const nextId = (list) => {
  if (!list || list.length === 0) {
    return 1;
  }
  const maxId = Math.max(...list.map((item) => item.id));
  return maxId + 1;
};

module.exports = nextId;
