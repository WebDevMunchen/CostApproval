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

// const createNew = asyncWrapper(async (req, res, next) => {
//   const {
//     title,
//     additionalMessage,
//     expenseAmount,
//     expenseAmountCent,
//     deadline,
//     selectedMonth, // This will be a string (e.g., "Januar")
//     leadRole, // Now passed from the form
//   } = req.body;

//   const { currentYear } = getCurrentYearAndMonth();

//   // Create a mapping of months (as strings)
//   const months = [
//     "Januar",
//     "Februar",
//     "März",
//     "April",
//     "Mai",
//     "Juni",
//     "Juli",
//     "August",
//     "September",
//     "Oktober",
//     "November",
//     "Dezember",
//   ];

//   // Check if selectedMonth is valid
//   if (!months.includes(selectedMonth)) {
//     return next(new ErrorResponse("Invalid month selected.", 400));
//   }

//   // Find the budget for the selected year, month, and department (leadRole)
//   const budget = await BudgetKennzahlen.findOne({
//     year: currentYear,
//     month: selectedMonth,
//     department: leadRole, // Now we use the passed leadRole
//   });

//   if (!budget) {
//     return next(
//       new ErrorResponse(
//         "No matching budget found for the selected year, month, and department.",
//         404
//       )
//     );
//   }

//   let setApprover = "";

//   // Determine the approver based on the selected role
//   if (leadRole === "Anmietung") {
//     setApprover = "Sandra Bollmann";
//   } else if (leadRole === "Fremdpersonalkosten LL") {
//     setApprover = "Tobias Viße";
//   } else {
//     setApprover = "Ben Cudok";
//   }

//   let newStatus;

//   // Update budget amounts
//   let updatedUsedAmount = Number(budget.usedAmount) + Number(expenseAmount);
//   let updatedUsedAmountCent =
//     Number(budget.usedAmountCent) + Number(expenseAmountCent);

//   if (updatedUsedAmountCent >= 100) {
//     const additionalEuros = Math.floor(updatedUsedAmountCent / 100);
//     updatedUsedAmount += additionalEuros;
//     updatedUsedAmountCent = updatedUsedAmountCent % 100;
//   }

//   budget.usedAmount = updatedUsedAmount;
//   budget.usedAmountCent = updatedUsedAmountCent;

//   await budget.save();

//   // Determine status based on used amount
//   if (updatedUsedAmount > budget.amount) {
//     newStatus = "Neu";
//   }

//   // Create a new cost approval entry
//   const newEntry = await CostApprovalKennzahlen.create({
//     creator: req.user.id,
//     title,
//     additionalMessage,
//     expenseAmount,
//     expenseAmountCent,
//     approver: setApprover,
//     deadline,
//     status: newStatus,
//     department: leadRole,
//     month: selectedMonth, // Save the selected month as a string
//   });

//   res.json(newEntry);
// });

const createNew = asyncWrapper(async (req, res, next) => {
  const {
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    deadline,
    selectedMonth, // This will be a string (e.g., "Januar")
    leadRole,
    dateRangeStart,
    dateRangeEnd
  } = req.body;

  const { currentYear } = getCurrentYearAndMonth();

  // Create a mapping of months (as strings)
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

  // Check if selectedMonth is valid
  if (!months.includes(selectedMonth)) {
    return next(new ErrorResponse("Invalid month selected.", 400));
  }

  // Find the budget for the selected year, month, and department (leadRole)
  const budget = await BudgetKennzahlen.findOne({
    year: currentYear,
    month: selectedMonth,
    department: leadRole, // Now we use the passed leadRole
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

  // Determine the approver based on the selected role
  if (leadRole === "Anmietung") {
    setApprover = "Sandra Bollmann";
  } else if (leadRole === "Fremdpersonalkosten LL") {
    setApprover = "Tobias Viße";
  } else {
    setApprover = "Ben Cudok";
  }

  let newStatus;

  // Update budget amounts
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

  // Determine status based on used amount
  if (updatedUsedAmount > budget.amount) {
    newStatus = "Neu";
  }

  // Create a new cost approval entry
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
    dateRangeEnd
  });

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

module.exports = {
  createNew,
  getAllKennzahlenInquiries,
  getUserKennzahlenInquiries,
};
