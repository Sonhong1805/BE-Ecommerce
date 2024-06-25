const FILE_USERS = require("../constants/file_users");
const fileManager = require("../fileManager");

exports.addToOrdered = async (req, res) => {
  try {
    const { userId } = req;
    const { dataOrdered } = req.body;
    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    const userOrdered = user.ordered || [];
    userOrdered.unshift(...dataOrdered);
    user.ordered = userOrdered;

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
