const FILE_USERS = require("../constants/file_users");
const fileManager = require("../fileManager");

exports.addToFavourites = async (req, res) => {
  try {
    const { userId } = req;
    const { dataFavourites } = req.body;
    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    const userFavourites = user.favourites || [];
    dataFavourites.quantity = 1;
    dataFavourites.newPrice = dataFavourites.currentPrice;
    userFavourites.unshift(dataFavourites);
    user.favourites = userFavourites;

    const userCart = user.cart || [];
    user.cart = userCart.filter((item) => item.id !== dataFavourites.id);

    await fileManager.saveFile(data, FILE_USERS);

    res.status(200).json({
      status: "success",
      dataFavourites,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};

exports.deleteOne = async (req, res) => {
  const { userId } = req;
  const { id } = req.body;
  const data = await fileManager.readFile(FILE_USERS);
  const user = data.users?.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ status: "fail" });
  }

  const userFavourites = user.favourites || [];

  user.favourites = userFavourites.filter((item) => item.id !== id);

  await fileManager.saveFile(data, FILE_USERS);
  res.status(201).json({
    status: "success",
    response: user.favourites,
  });
};
