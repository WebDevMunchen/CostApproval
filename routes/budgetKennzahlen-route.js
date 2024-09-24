const express = require("express");

const { authenticate } = require("../middlewares/authenticate.js");
const { getAllBudgets, createBudget, editBudget } = require("../controllers/budgetKennzahlen-controller.js");


const budgetKennzahlenRoute = express.Router();

budgetKennzahlenRoute.route("/getAllKennzahlenBudgets").get(authenticate, getAllBudgets);
budgetKennzahlenRoute.route("/createKennzahlenBudget").post(authenticate, createBudget);
budgetKennzahlenRoute.route("/editKennzahlenBudget/:id").put(authenticate, editBudget);

module.exports = budgetKennzahlenRoute;
