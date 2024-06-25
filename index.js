const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

const categoryController = require("./controllers/categories.controller");
const productController = require("./controllers/products.controller");
const authController = require("./controllers/auth.controller");
const userController = require("./controllers/user.controller");
const addressController = require("./controllers/address.controller");
const cartController = require("./controllers/cart.controller");
const paymentController = require("./controllers/payment.controller");
const orderedController = require("./controllers/ordered.controller");
const favouritesController = require("./controllers/favourites.controller");
const cancellationsController = require("./controllers/cancellations.controller");
const authenticateJWT = require("./middlewares/authenticateJWT");

const app = express();
app.use(express.static(`${__dirname}/public`));

const port = 3100;

const FILE_USERS = require("./constants/file_users");
const fileManager = require("./fileManager");
const FILE_PRODUCTS = require("./constants/file_products");
const { products } = require("./data/products.data");

(async () => {
  const isExits = await fileManager.fileExists(FILE_USERS);
  if (isExits) {
    const userData = await fileManager.readFile(FILE_USERS);
    await fileManager.saveFile(userData, FILE_USERS);
  } else {
    fileManager.createFile(FILE_USERS);
    let userData = {
      users: [],
    };
    await fileManager.saveFile(userData, FILE_USERS);
  }
})();

// (async () => {
//   fileManager.createFile(FILE_PRODUCTS);
//   let productsData = {
//     products,
//   };
//   await fileManager.saveFile(productsData, FILE_PRODUCTS);
// })();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to my project ecommerce!");
});

app.route("/users").get(userController.getUsers);

app.post("/auth/signup", authController.signup);
app.post("/auth/login", authController.login);
app.route("/auth/forgotPassword").post(authController.forgotPassword);
app.route("/auth/checkExitsEmail").post(authController.checkExitsEmail);
app.route("/auth/loginWithNextAuth").post(authController.loginWithNextAuth);

app.route("/categories").get(categoryController.getCategories);
app.route("/categories/detail").get(categoryController.getCategory);
app.route("/categories/filters").get(categoryController.getFilters);

app.route("/products").get(productController.getProducts);
app.route("/products/detail").get(productController.getDetail);
app.route("/products/all").get(productController.getAll);

app.route("/address/provinces").get(addressController.getProvinces);
app.route("/address/districts").get(addressController.getDistricts);
app.route("/address/wards").get(addressController.getWards);

app.use(authenticateJWT);

app.route("/users/me").get(userController.getMe);
app
  .route("/users/updateMeWithAvatar")
  .patch(userController.uploadAvatar, userController.updateMeWithAvatar);
app
  .route("/users/updateMeWithoutAvatar")
  .patch(userController.updateMeWithoutAvatar);
app.route("/users/changePassword").patch(userController.changePassword);
app.route("/users/addToAddress").post(userController.addToAddress);
app.route("/users/addressDetail").post(userController.addressDetail);
app.route("/users/editAddress").patch(userController.editAddress);
app
  .route("/users/changeDefaultAddress")
  .post(userController.changeDefaultAddress);
app.route("/users/addToEvaluates").post(userController.addToEvaluates);

app.route("/cart").post(cartController.addToCart);
app.route("/cart/increaseQuantity").post(cartController.increaseQuantity);
app.route("/cart/decreaseQuantity").post(cartController.decreaseQuantity);
app.route("/cart/changeQuantity").post(cartController.changeQuantity);
app.route("/cart/changeInputsChecked").post(cartController.changeInputsChecked);
app.route("/cart/delete").delete(cartController.delete);
app.route("/cart/deleteOne").delete(cartController.deleteOne);
app.route("/cart/addAllToCart").post(cartController.addAllToCart);

// app.route("/payment");
app.route("/payment/unpaid").post(paymentController.unpaid);
app.route("/payment/paid").post(paymentController.paid);
app.route("/payment/deleteOne").delete(paymentController.deleteOne);

// app.route("/ordered");
app.route("/ordered/addToOrdered").post(orderedController.addToOrdered);

// app.route("/favourites");
app
  .route("/favourites/addToFavourites")
  .post(favouritesController.addToFavourites);
app.route("/favourites/deleteOne").delete(favouritesController.deleteOne);

// app.route("/cancellations");
app
  .route("/cancellations/addToCancelled")
  .post(cancellationsController.addToCancelled);

app.listen(port, () => {
  console.log(`Ecommerce app listening on port ${port}`);
});
