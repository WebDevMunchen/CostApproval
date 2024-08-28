const CostApproval = require("../models/costApproval-model.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const asyncWrapper = require("../utils/asyncWrapper.js");

const createNewApproval = asyncWrapper(async (req, res, next) => {
  const {
    typeOfExpense,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    priority,
  } = req.body;

  const creator = req.user.id;
  let liquidity = false;
  let liquidityStatus;

  if (expenseAmount >= 1500) {
    liquidity = true;
    liquidityStatus = "In Prüfung";
  }

  const newExpense = await CostApproval.create({
    creator,
    typeOfExpense,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    liquidity,
    liquidityStatus,
    priority,
  });

  res.status(201).json(newExpense);
});

const editApproval = asyncWrapper(async (req, res, next) => {
  const {
    typeOfExpense,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    priority,
  } = req.body;
  const { id } = req.params;

  const creator = req.user.id;
  let liquidity = false;
  let liquidityStatus;

  if (expenseAmount >= 1500) {
    liquidity = true;
    liquidityStatus = "In Prüfung";
  } else {
    liquidityStatus = null;
  }

  const newExpense = await CostApproval.findByIdAndUpdate(id, {
    creator,
    typeOfExpense,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    liquidity,
    liquidityStatus,
    priority,
  });

  res.status(201).json(newExpense);
});

const deleteApproval = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const approval = await CostApproval.findByIdAndDelete(id);

  if (!approval) {
    throw new ErrorResponse("Approval not found!", 404);
  } else {
    res.json({ message: "Deleted!" });
  }
});

const getUserApprovals = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;

  const approvals = await CostApproval.find({ creator: id })
    .populate("creator")
    .sort({ dateOfCreation: -1 });

  res.json(approvals);
});

const getSingleApproval = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const approval = await CostApproval.findById(id);

  if (!approval) {
    throw new ErrorResponse("Approval not found!", 404);
  } else {
    res.json(approval);
  }
});

const getAllApprovals = asyncWrapper(async (req, res, next) => {
  const currentYear = req.query.year || new Date().getFullYear();
  const currentMonth = req.query.month || new Date().toLocaleString('de-DE', { month: 'long' });

  const approvals = await CostApproval.find({
    year: currentYear,
    month: currentMonth,
  });

  res.json(approvals);
});

module.exports = {
  getAllApprovals,
}

module.exports = {
  createNewApproval,
  getUserApprovals,
  getSingleApproval,
  editApproval,
  deleteApproval,
  getAllApprovals
};
