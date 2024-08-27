const express = require("express");
const {
  register,
  login,
  getProfile,
  logout,
} = require("../controllers/user-controller");
const { authenticate } = require("../middlewares/authenticate.js");

const userRouter = express.Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(logout);
userRouter.route("/getProfile").get(authenticate, getProfile);

module.exports = userRouter;
