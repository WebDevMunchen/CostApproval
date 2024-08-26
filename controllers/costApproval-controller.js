const CostApproval = require("../models/costApproval-model.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const asynWrapper = require("../utils/asyncWrapper.js");

const createNewApproval = asynWrapper(async (req, res, next) => {
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
    liquidityStatus = "In Prüfung"
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

const getUserApprovals = asynWrapper(async (req, res, next) => {
  const { id } = req.user;

  const approvals = await CostApproval.find({ creator: id })
    .populate("creator")
    .sort({ dateOfCreation: -1 });

  res.json(approvals);
});

module.exports = { createNewApproval, getUserApprovals };
