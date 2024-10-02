const BudgetKennzahlen = require("../models/budgetKennzahlen-model.js");
const CostApprovalKennzahlen = require("../models/kennzahlen-model.js");
const User = require("../models/user-model.js");
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
    deadline,
    selectedMonth,
    leadRole,
    dateRangeStart,
    dateRangeEnd,
  } = req.body;

  const { currentYear } = getCurrentYearAndMonth();

  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  if (!months.includes(selectedMonth)) {
    return next(new ErrorResponse("Invalid month selected.", 400));
  }

  const budget = await BudgetKennzahlen.findOne({
    year: currentYear,
    month: selectedMonth,
    department: leadRole,
  });

  if (!budget) {
    return next(
      new ErrorResponse(
        "No matching budget found for the selected year, month, and department.",
        404
      )
    );
  }

  let setApprover = "";

  if (leadRole === "Anmietung") {
    setApprover = "Sandra Bollmann";
  } else if (leadRole === "Fremdpersonalkosten LL") {
    setApprover = "Tobias Viße";
  } else {
    setApprover = "Ben Cudok";
  }

  let newStatus;

  let updatedUsedAmount = Number(budget.usedAmount) + Number(expenseAmount);
  let updatedUsedAmountCent =
    Number(budget.usedAmountCent) + Number(expenseAmountCent);

  if (updatedUsedAmountCent >= 100) {
    const additionalEuros = Math.floor(updatedUsedAmountCent / 100);
    updatedUsedAmount += additionalEuros;
    updatedUsedAmountCent = updatedUsedAmountCent % 100;
  }

  budget.usedAmount = updatedUsedAmount;
  budget.usedAmountCent = updatedUsedAmountCent;

  await budget.save();

  if (updatedUsedAmount > budget.amount) {
    newStatus = "Neu";
  }

  const newEntry = await CostApprovalKennzahlen.create({
    creator: req.user.id,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver: setApprover,
    deadline,
    status: newStatus,
    department: leadRole,
    month: selectedMonth,
    dateRangeStart,
    dateRangeEnd,
  });

  res.json(newEntry);
});

const getAllKennzahlenInquiries = asyncWrapper(async (req, res, next) => {
  const { year, department, status } = req.query;

  const query = {};

  if (year) {
    query.year = year;
  }

  if (department) {
    query.department = department;
  }

  if (status) {
    query.status = status;
  }

  const allInquiries = await CostApprovalKennzahlen.find(query).populate(
    "creator"
  );

  res.status(200).json(allInquiries);
});

const getUserKennzahlenInquiries = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const { title, status, year, month, department } = req.query;

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

  if (month) {
    query.month = month;
  }

  if (department) {
    query.department = department;
  }

  const approvals = await CostApprovalKennzahlen.find(query)
    .populate("creator")
    .sort({ dateOfCreation: -1 });

  res.json(approvals);
});

const approveKennzahlenInquiry = asyncWrapper(async(req, res, next) => {
  const { id } = req.params;
  const { status, message } = req.body;
  const { id: admin_id } = req.user;

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApprovalKennzahlen.findById(id);
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
    sendersAbbreviation: user.abbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
})

const declineKennzahlenInquiry = asyncWrapper(async(req, res, next) => {
  const { id } = req.params;
  const { status, declineReason, message } = req.body;
  const { id: admin_id } = req.user;

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApprovalKennzahlen.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    declineReason,
    date: currentTime,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.abbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
})

const setKennzahlenInquiryPending = asyncWrapper(async(req, res, next) => {
  const { id } = req.params;
  const { status, pendingReason, message } = req.body;
  const { id: admin_id } = req.user;

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApprovalKennzahlen.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    pendingReason,
    date: currentTime,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.abbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
})

module.exports = {
  createNew,
  getAllKennzahlenInquiries,
  getUserKennzahlenInquiries,
  approveKennzahlenInquiry,
  declineKennzahlenInquiry,
  setKennzahlenInquiryPending
};
