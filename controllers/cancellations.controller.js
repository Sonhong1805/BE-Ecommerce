const FILE_USERS = require("../constants/file_users");
const fileManager = require("../fileManager");

exports.addToCancelled = async (req, res) => {
  try {
    const { userId } = req;
    const { dataCancellations } = req.body;
    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    const userCancelled = user.cancelled || [];
    userCancelled.unshift(dataCancellations);
    user.cancelled = userCancelled;

    const { items, idOrdered } = dataCancellations;
    const idItems = items.map((item) => item.id);

    const userOrdered = user.ordered || [];

    const currentUserOrdered = userOrdered?.find(
      (item) => item.id === idOrdered
    );

    const updateStatusArr = currentUserOrdered.items.map((item) => {
      if (idItems.includes(item.id)) {
        return { ...item, status: true };
      } else return item;
    });

    currentUserOrdered.items = updateStatusArr;

    user.ordered = userOrdered;

    await fileManager.saveFile(data, FILE_USERS);

    res.status(200).json({
      status: "success",
      dataCancellations,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};
