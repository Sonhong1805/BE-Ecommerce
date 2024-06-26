const FILE_USERS = require("../constants/file_users");
const fileManager = require("../fileManager");

exports.addToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { dataCart } = req.body;

    const {
      id,
      name,
      image,
      slug,
      slugCategoryChildren,
      price,
      discount,
      quantity,
      firstChoice,
      secondChoice,
      status,
    } = dataCart;
    const data = await fileManager.readFile(FILE_USERS);

    const user = data.users?.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ status: "fail" });
    }

    const userCart = user.cart || [];

    const isCartExits = userCart.some(
      (item) =>
        item.name === name &&
        item.firstChoice === firstChoice &&
        item.secondChoice === secondChoice
    );

    if (isCartExits) {
      const currentCart = userCart.find(
        (item) =>
          item.name === name &&
          item.firstChoice === firstChoice &&
          item.secondChoice === secondChoice
      );
      currentCart.quantity = currentCart.quantity += quantity;
      currentCart.newPrice = currentCart.newPrice * currentCart.quantity;
      currentCart.status = status;
      await fileManager.saveFile(data, FILE_USERS);
    } else {
      const newPrice = Math.round(price - (price * discount) / 100);
      const cart = {
        id,
        name,
        image,
        slug,
        discount,
        slugCategoryChildren,
        currentPrice: price,
        newPrice,
        quantity,
        firstChoice,
        secondChoice,
        status,
      };

      userCart.unshift(cart);
      user.cart = userCart;
      await fileManager.saveFile(data, FILE_USERS);
    }
    res.status(201).json({
      status: "success",
      dataCart,
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
    });
  }
};

exports.increaseQuantity = async (req, res) => {
  const { userId } = req;
  const { id } = req.body;
  const data = await fileManager.readFile(FILE_USERS);
  const user = data.users?.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ status: "fail" });
  }

  const userCart = user.cart || [];
  const currentCart = userCart.find((item) => item.id === id);
  currentCart.quantity++;
  const discountPrice = Math.round(
    currentCart.currentPrice -
      (currentCart.currentPrice * currentCart.discount) / 100
  );
  currentCart.newPrice = discountPrice * currentCart.quantity;
  await fileManager.saveFile(data, FILE_USERS);
  res.status(201).json({
    status: "success",
    id,
  });
};

exports.decreaseQuantity = async (req, res) => {
  const { userId } = req;
  const { id } = req.body;
  const data = await fileManager.readFile(FILE_USERS);
  const user = data.users?.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ status: "fail" });
  }

  const userCart = user.cart || [];
  const currentCart = userCart.find((item) => item.id === id);
  if (currentCart.quantity <= 1) {
    currentCart.quantity = 1;
  } else {
    currentCart.quantity--;
  }
  const discountPrice = Math.round(
    currentCart.currentPrice -
      (currentCart.currentPrice * currentCart.discount) / 100
  );
  currentCart.newPrice = discountPrice * currentCart.quantity;
  await fileManager.saveFile(data, FILE_USERS);
  res.status(201).json({
    status: "success",
    id,
  });
};

exports.changeQuantity = async (req, res) => {
  const { userId } = req;
  const { id, quantity } = req.body;
  const data = await fileManager.readFile(FILE_USERS);
  const user = data.users?.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ status: "fail" });
  }

  const userCart = user.cart || [];
  const currentCart = userCart.find((item) => item.id === id);
  currentCart.quantity = quantity;
  currentCart.newPrice = currentCart.newPrice * currentCart.quantity;
  await fileManager.saveFile(data, FILE_USERS);
  res.status(201).json({
    status: "success",
  });
};

exports.changeInputsChecked = async (req, res) => {
  const { userId } = req;
  const { inputsChecked } = req.body;
  const data = await fileManager.readFile(FILE_USERS);
  const user = data.users?.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ status: "fail" });
  }

  let userCart = user.cart || [];

  const updateStatus = userCart.map((item) => {
    return { ...item, status: inputsChecked.includes(item.id) };
  });

  user.cart = updateStatus;

  await fileManager.saveFile(data, FILE_USERS);
  res.status(201).json({
    status: "success",
    updateStatus,
  });
};

exports.delete = async (req, res) => {
  const { userId } = req;
  const { inputsChecked } = req.body;
  const data = await fileManager.readFile(FILE_USERS);
  const user = data.users?.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ status: "fail" });
  }

  let userCart = user.cart || [];

  user.cart = userCart.filter((item) => !inputsChecked.includes(item.id));

  await fileManager.saveFile(data, FILE_USERS);
  res.status(201).json({
    status: "success",
  });
};

exports.deleteOne = async (req, res) => {
  const { userId } = req;
  const { id } = req.body;
  const data = await fileManager.readFile(FILE_USERS);
  const user = data.users?.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ status: "fail" });
  }

  let userCart = user.cart || [];

  user.cart = userCart.filter((item) => item.id !== id);

  await fileManager.saveFile(data, FILE_USERS);
  res.status(201).json({
    status: "success",
  });
};

exports.addAllToCart = async (req, res) => {
  const { userId } = req;
  const { arrItems } = req.body;
  const data = await fileManager.readFile(FILE_USERS);
  const user = data.users?.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ status: "fail" });
  }

  let userCart = user.cart || [];

  let newUserCart = [];

  const userCartIds = userCart.map((item) => item.id);
  const arrItemsIds = arrItems.map((item) => item.id);

  const exitIds = userCartIds.some((id) => arrItemsIds.includes(id));

  if (exitIds) {
    newUserCart = userCart.map((item) => {
      if (arrItemsIds.includes(item.id)) {
        return { quantity: item.quantity++, ...item };
      } else {
        return item;
      }
    });
  } else {
    newUserCart = [...userCart, ...arrItems];
  }

  user.cart = newUserCart;

  await fileManager.saveFile(data, FILE_USERS);
  res.status(201).json({
    status: "success",
    arrItems,
  });
};
