const Budget = require("../models/budget-model.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const asyncWrapper = require("../utils/asyncWrapper.js");

const createBudget = asyncWrapper(async (req, res, next) => {
  const { year, month, amount } = req.body;

  const newBudget = await Budget.create({
    year,
    month,
    amount,
  });

  const match = await Budget.findOne({ year, month });

  if (match) {
    throw new ErrorResponse(
      "Budget already created for this year and month!",
      409
    );
  }

  res.status(201).json(newBudget);
});

const editBudget = asyncWrapper(async (req, res, next) => {
  const { year, month, amount } = req.body;
  const { id } = req.params;

  const updatedBudget = await Budget.findByIdAndUpdate(id, {
    year,
    month,
    amount,
  });

  if (!updatedBudget) {
    throw new ErrorResponse("Budget not found!", 404);
  }

  res.status(201).json(updatedBudget);
});

const getAllBudgets = asyncWrapper(async (req, res, next) => {
  const budgets = await Budget.find({});

  res.json(budgets);
});

module.exports = {
  createBudget,
  editBudget,
  getAllBudgets,
};
