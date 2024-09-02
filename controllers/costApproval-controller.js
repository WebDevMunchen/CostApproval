const CostApproval = require("../models/costApproval-model.js");
const User = require("../models/user-model.js");
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
  const { month, year, status } = req.query;
  let query = {};

  if (month) {
    query.month = month;
  }

  if (year) {
    query.year = year;
  }

  if (status) {
    query.status = status;
  }

  const approvals = await CostApproval.find(query).populate("creator");

  res.json(approvals);
});

const getAllLiquidityApprovals = asyncWrapper(async (req, res, next) => {
  const { liquidity } = req.query;
  let query = {};

  // Convert the liquidity query parameter to a boolean if it exists
  if (liquidity !== undefined) {
    query.liquidity = liquidity === 'true'; // Convert 'true'/'false' string to boolean
  }

  const approvals = await CostApproval.find(query).populate("creator");

  res.json(approvals);
});


const approveInquiry = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.sendersAbbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

const declineInquiry = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message, declineReason } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    declineReason,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.sendersAbbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

const approveLiqudity = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.sendersAbbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

const declineLiquidity = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message, liquidityReason } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    liquidityReason,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.sendersAbbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

module.exports = {
  createNewApproval,
  getUserApprovals,
  getSingleApproval,
  editApproval,
  deleteApproval,
  getAllApprovals,
  approveInquiry,
  declineInquiry,
  approveLiqudity,
  declineLiquidity,
  getAllLiquidityApprovals
};
