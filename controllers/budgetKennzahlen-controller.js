const BudgetKennzahlen = require("../models/budgetKennzahlen-model.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const asyncWrapper = require("../utils/asyncWrapper.js");

const createBudget = asyncWrapper(async (req, res, next) => {
  const { year, month, amount, usedAmount, usedAmountCent, department } = req.body;

  const match = await BudgetKennzahlen.findOne({ year, month, department });

  if (match) {
    throw new ErrorResponse(
      "Budget already created for this year and month!",
      409
    );
  }

  const newBudget = await BudgetKennzahlen.create({
    year,
    month,
    amount,
    usedAmount,
    usedAmountCent,
    department
  });

  res.status(201).json(newBudget);
});

const editBudget = asyncWrapper(async (req, res, next) => {
  const { year, month, amount, department } = req.body;
  const { id } = req.params;

  const updatedBudget = await BudgetKennzahlen.findByIdAndUpdate(id, {
    year,
    month,
    amount,
    department,
  });

  if (!updatedBudget) {
    throw new ErrorResponse("Budget not found!", 404);
  }

  res.status(201).json(updatedBudget);
});

const getAllBudgets = asyncWrapper(async (req, res, next) => {
  const { year, department } = req.query;

  const query = {};
  if (year) {
    query.year = year;
  }

  if (department) {
    query.department = department;
  }

  const budgets = await BudgetKennzahlen.find(query);

  res.json(budgets);
});

module.exports = {
  createBudget,
  editBudget,
  getAllBudgets,
};
