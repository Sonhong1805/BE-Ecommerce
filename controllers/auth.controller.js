const jwt = require("jsonwebtoken");
const nextId = require("../helpers/nextId");
const FILE_USERS = require("../constants/file_users");
const fileManager = require("../fileManager");

exports.signup = async (req, res) => {
  try {
    const data = await fileManager.readFile(FILE_USERS);
    const { username, email, password } = req.body;

    const user = {
      id: nextId(data.users),
      username,
      email,
      password,
    };

    data.users.push(user);

    await fileManager.saveFile(data, FILE_USERS);

    res.status(201).json({
      status: "success",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(401).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res) => {
  const data = await fileManager.readFile(FILE_USERS);
  const { email, password } = req.body;

  const user = data.users?.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({
      status: "fail",
    });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
};

exports.forgotPassword = async (req, res) => {
  const data = await fileManager.readFile(FILE_USERS);
  const { email, password } = req.body;

  let user = data.users.find((item) => item.email === email);
  user.password = password;

  await fileManager.saveFile(data, FILE_USERS);

  res.status(200).json({
    status: "success",
  });
};

exports.checkExitsEmail = async (req, res) => {
  const data = await fileManager.readFile(FILE_USERS);
  const { email } = req.body;

  const isExits = data.users.some((item) => item.email === email);

  res.status(200).json({
    status: "success",
    isExits,
  });
};

exports.loginWithNextAuth = async (req, res) => {
  const data = await fileManager.readFile(FILE_USERS);
  const { email, username, avatar } = req.body;

  try {
    const isExitsUser = data.users.some((user) => user.email === email);

    let token = "";

    if (isExitsUser) {
      const currentUser = data.users.find((user) => user.email === email);
      token = jwt.sign({ id: currentUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
      });
    } else {
      const user = {
        id: nextId(data.users),
        email,
        username,
        avatar,
        password: "secret",
      };

      data.users.push(user);

      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
      });

      await fileManager.saveFile(data, FILE_USERS);
    }

    return res.status(200).json({
      status: "success",
      data: {
        token,
      },
    });
  } catch (error) {
    return res.status(401).json({
      status: "fail",
    });
  }
};
