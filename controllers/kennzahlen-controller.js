const BudgetKennzahlen = require("../models/budgetKennzahlen-model.js");
const CostApprovalKennzahlen = require("../models/kennzahlen-model.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const asyncWrapper = require("../utils/asyncWrapper.js");
const nodemailer = require("nodemailer");

const getCurrentYearAndMonth = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  return { currentYear, currentMonth };
};

const createNew = asyncWrapper(async (req, res, next) => {
  const {
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    status,
  } = req.body;
  const { leadRole } = req.user;

  const { currentYear, currentMonth } = getCurrentYearAndMonth();

  const budget = await BudgetKennzahlen.findOne({
    year: currentYear,
    month: currentMonth,
    department: leadRole,
  });

  if (!budget) {
    return next(
      new ErrorResponse(
        "No matching budget found for the current year, month, and department.",
        404
      )
    );
  }

  const totalUsedAmount = budget.usedAmount + budget.usedAmountCent / 100;

  if (totalUsedAmount > budget.amount) {
    return next(
      new ErrorResponse("The expense exceeds the available budget.", 400)
    );
  }

  const newEntry = await CostApprovalKennzahlen.create({
    creator: req.user.id,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    status,
    department: leadRole
  });

  const updatedUsedAmount = budget.usedAmount + expenseAmount;
  const updatedUsedAmountCent = budget.usedAmountCent + expenseAmountCent;

  const totalCents = updatedUsedAmountCent % 100;
  const additionalEuros = Math.floor(updatedUsedAmountCent / 100);

  budget.usedAmount = updatedUsedAmount + additionalEuros;
  budget.usedAmountCent = totalCents;

  await budget.save();

  res.json(newEntry);
});

const getAllKennzahlenInquiries = asyncWrapper(async (req, res, next) => {
  const { year, department } = req.query;

  const query = {};

  if (year) {
    query.year = year;
  }

  if (department) {
    query.department = department;
  }

  const allInquiries = await CostApprovalKennzahlen.find(query);

  res.status(200).json(allInquiries);
});

const getUserKennzahlenInquiries = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const { title, status, year } = req.query;

  const query = { creator: id };

  if (title) {
    query.title = new RegExp(title, "i");
  }

  if (status) {
    query.status = status;
  }

  if (year) {
    query.year = year;
  }

  const approvals = await CostApprovalKennzahlen.find(query)
    .populate("creator")
    .sort({ dateOfCreation: -1 });

  res.json(approvals);
});

module.exports = { createNew, getAllKennzahlenInquiries, getUserKennzahlenInquiries };
