const User = require("../models/user-model.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const asyncWrapper = require("../utils/asyncWrapper.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = asyncWrapper(async (req, res, next) => {
  const { abbreviation, password, department } = req.body;

  const found = await User.findOne({ abbreviation });

  if (found) {
    throw new ErrorResponse("User already registered!", 409);
  }

  const newUser = await User.create({
    abbreviation,
    password,
    department
  });

  res.status(201).json({
    abbreviation: newUser.abbreviation,
    department: newUser.department,
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { abbreviation, password } = req.body;

  const user = await User.findOne({ abbreviation }).select("+password");

  if (!user) {
    throw new ErrorResponse("User not found!", 404);
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new ErrorResponse("Incorrect password!", 401);
  }

  const payload = { id: user._id, abbreviation: user.abbreviation, firstName: user.firstName, role: user.role };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "480m",
  });

  res
    .cookie("access_token", token, { httpOnly: true, maxAge: 28800000 })
    .json(user);
});

const logout = asyncWrapper(async (req, res, next) => {
  res
    .cookie("access_token", "", { httpOnly: true, maxAge: 0 })
    .json({ success: true });
});

const getProfile = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;

  const userProfile = await User.findById(id);

  res.json(userProfile);
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
};
