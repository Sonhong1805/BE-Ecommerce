const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fileManager = require("../fileManager");
const FILE_USERS = require("../constants/file_users");
const FILE_PRODUCTS = require("../constants/file_products");
const nextId = require("../helpers/nextId");

exports.getUsers = async (req, res) => {
  const data = await fileManager.readFile(FILE_USERS);
  res.status(200).json({
    status: "success",
    data,
  });
};

exports.getMe = async (req, res) => {
  const data = await fileManager.readFile(FILE_USERS);
  const { userId } = req;

  let user = data.users.find((item) => item.id === userId);
  user = { ...user };
  user.password = undefined;

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

exports.updateMeWithAvatar = async (req, res) => {
  try {
    const { file, userId } = req;
    const { dataInfo } = req.body;
    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);
    const userInfo = JSON.parse(dataInfo);
    if (!user) {
      return res.status(404).json({ status: "fail" });
    }
    const fileName = file.filename;

    if (file) {
      user.avatar = fileName;
    }

    Object.assign(user, userInfo);

    await fileManager.saveFile(data, FILE_USERS);

    res.status(200).json({
      status: "success",
      user,
      fileName,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};

exports.updateMeWithoutAvatar = async (req, res) => {
  try {
    const { userId } = req;
    const { dataInfo } = req.body;
    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);
    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    Object.assign(user, dataInfo);

    await fileManager.saveFile(data, FILE_USERS);

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};

exports.changePassword = async (req, res) => {
  const data = await fileManager.readFile(FILE_USERS);
  const { userId } = req;
  const { password } = req.body;

  let user = data.users.find((item) => item.id === userId);
  user.password = password;

  await fileManager.saveFile(data, FILE_USERS);

  res.status(200).json({
    status: "success",
  });
};

exports.addToAddress = async (req, res) => {
  try {
    const { userId } = req;
    const { dataAddress } = req.body;
    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    const userAddress = user.address ?? [];

    const objAddress = {
      ...dataAddress,
      isDefault: !userAddress.some((address) => address.isDefault),
    };

    userAddress.push(objAddress);
    user.address = userAddress;

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

exports.addressDetail = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.body;
    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    const userAddress = user.address || [];
    const addressDetail = userAddress.find((address) => address.id === id);

    res.status(200).json({
      status: "success",
      addressDetail,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};

exports.editAddress = async (req, res) => {
  try {
    const { userId } = req;
    const { dataAddress } = req.body;
    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    const { id } = dataAddress;
    const userAddress = user.address || [];
    const currentUserAddress = userAddress.find((address) => address.id === id);

    Object.assign(currentUserAddress, dataAddress);

    user.address = userAddress;

    await fileManager.saveFile(data, FILE_USERS);

    res.status(200).json({
      status: "success",
      dataAddress,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};

exports.changeDefaultAddress = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.body;
    const data = await fileManager.readFile(FILE_USERS);
    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    const userAddress = user.address || [];
    const updateUserAddress = userAddress.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));

    user.address = updateUserAddress;

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

exports.addToEvaluates = async (req, res) => {
  try {
    const { userId } = req;
    const { dataEvaluates } = req.body;
    const dataUsers = await fileManager.readFile(FILE_USERS);
    const user = dataUsers.users?.find((user) => user.id === userId);
    const dataProducts = await fileManager.readFile(FILE_PRODUCTS);
    const product = dataProducts.products?.find(
      (product) => product.slug === dataEvaluates.slug
    );

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    const userEvaluates = user.evaluates || [];
    dataEvaluates.id = nextId(userEvaluates);
    userEvaluates.unshift(dataEvaluates);
    user.evaluates = userEvaluates;

    const productEvaluates = product.evaluates || [];
    const newProductEvaluate = {
      ...dataEvaluates,
      id: nextId(productEvaluates),
    };
    productEvaluates.unshift(newProductEvaluate);
    product.evaluates = productEvaluates;

    await fileManager.saveFile(dataUsers, FILE_USERS);
    await fileManager.saveFile(dataProducts, FILE_PRODUCTS);

    res.status(200).json({
      status: "success",
      dataEvaluates,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${uuidv4()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  const { mimetype } = file;

  if (mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an images", 422), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadAvatar = upload.single("avatar");
