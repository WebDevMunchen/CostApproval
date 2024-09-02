const Budget = require("../models/budget-model.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const asyncWrapper = require("../utils/asyncWrapper.js");

const createBudget = asyncWrapper(async (req, res, next) => {
  const { year, month, amount } = req.body;

  const match = await Budget.findOne({ year, month });

  if (match) {
    throw new ErrorResponse(
      "Budget already created for this year and month!",
      409
    );
  }

  const newBudget = await Budget.create({
    year,
    month,
    amount,
  });

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
  const { year } = req.query;

  const query = {};
  if (year) {
    query.year = year;
  }

  const budgets = await Budget.find(query);

  res.json(budgets);
});

module.exports = {
  createBudget,
  editBudget,
  getAllBudgets,
};
