const { Schema, model } = require("mongoose");

const getCurrentYear = () => new Date().getFullYear();

const getCurrentMonth = () => {
  const monthNames = [
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
  return monthNames[new Date().getMonth()];
};

const updateSchema = new Schema({
  message: { type: String },
  date: { type: Date },
  sendersFirstName: { type: String },
  sendersLastName: { type: String },
  sendersAbbreviation: { type: String },
  liquidityDeclineReason: { type: String },
  liquidityPendingReason: { type: String },
  declineReason: { type: String },
  pendingReason: { type: String },
  postponeReason: { type: String },
  updateMessage: { type: String },
});

const costApprovalKennzahlenSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  department: { type: String },
  title: { type: String, required: true },
  additionalMessage: { type: String, required: true },
  expenseAmount: { type: Number, required: true },
  expenseAmountCent: { type: Number, required: true, default: 0 },
  approver: {
    type: String,
    enum: ["Ben Cudok", "Tobias Viße", "Sandra Bollmann"],
  },
  fileURL: { type: String },
  dateOfCreation: { type: Date, default: Date.now },
  deadline: { type: Date },
  priority: { type: String, enum: ["Dringend", "Kann warten", "Mittel"] },
  lastUpdate: [updateSchema],
  status: {
    type: String,
    enum: [
      "Innerhalb des Budgets",
      "Neu",
      "Genehmigt",
      "Abgelehnt",
      "In Prüfung",
    ],
    default: "Innerhalb des Budgets",
  },

  year: { type: Number, default: getCurrentYear },
  month: { type: String, default: getCurrentMonth },
  dateRangeStart: {type: Date, required: true},
  dateRangeEnd: {type: Date, required: true}
});

const CostApprovalKennzahlen = model(
  "KennzahlenCostApproval",
  costApprovalKennzahlenSchema
);

module.exports = CostApprovalKennzahlen;
