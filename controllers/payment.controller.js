const FILE_USERS = require("../constants/file_users");
const fileManager = require("../fileManager");

exports.unpaid = async (req, res) => {
  try {
    const { userId } = req;
    const { array } = req.body;

    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    user.payment = array;

    await fileManager.saveFile(data, FILE_USERS);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};

exports.paid = async (req, res) => {
  try {
    const { userId } = req;
    const { paymentIds } = req.body;

    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    let userPayment = user.payment || [];
    let userCart = user.cart || [];

    user.payment = userPayment.filter((item) => !paymentIds.includes(item.id));
    user.cart = userCart.filter((item) => !paymentIds.includes(item.id));

    await fileManager.saveFile(data, FILE_USERS);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.body;

    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    let userPayment = user.payment || [];

    user.payment = userPayment.filter((item) => item.id !== id);

    await fileManager.saveFile(data, FILE_USERS);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};
