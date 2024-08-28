const express = require("express");

const { authenticate } = require("../middlewares/authenticate.js");
const {
  createBudget,
  getAllBudgets,
  editBudget,
} = require("../controllers/budget-controller.js");

const budgetRoute = express.Router();

budgetRoute.route("/getAllBudgets").get(authenticate, getAllBudgets);
budgetRoute.route("/createBudget").post(authenticate, createBudget);
budgetRoute.route("/editBudget/:id").put(authenticate, editBudget);

module.exports = budgetRoute;
