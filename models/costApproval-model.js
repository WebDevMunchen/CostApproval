const { Schema, model } = require("mongoose");

// Helper functions to get the current year and month in German
const getCurrentYear = () => new Date().getFullYear();

const getCurrentMonth = () => {
  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  return monthNames[new Date().getMonth()];
};

const updateSchema = new Schema({
  message: { type: String },
  date: { type: Date },
  sendersFirstName: {type: String},
  sendersLastName: {type: String},
  sendersAbbreviation: {type: String},
  liquidityReason: {type: String},
  declineReason: {type: String}
});

const costApprovalSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  typeOfExpense: {
    type: String,
    enum: ["Bereich", "Projekt", "Kontrakt"],
    required: true,
  },
  title: { type: String, required: true },
  additionalMessage: { type: String, required: true },
  expenseAmount: { type: Number, required: true },
  expenseAmountCent: { type: Number, required: true, default: 0 },
  liquidity: { type: Boolean, default: false },
  liquidityStatus: { type: String, enum: ["In Prüfung", "Genehmigt", "Abgelehnt"] },
  approver: { type: String, enum: ["Ben", "Tobias", "Sandra", "Marion"], required: true },
  fileURL: { type: String },
  dateOfCreation: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  priority: { type: String, enum: ["Dringend", "Kann warten", "Mittel"], required: true },
  lastUpdate: [updateSchema],
  status: {
    type: String,
    enum: [
      "Neu",
      "Genehmigt",
      "Abgelehnt",
      "In Prüfung",
      "Ja zum späteren Zeitpunkt",
    ],
    default: "Neu",
  },
  reason: { type: String },

  // New fields for year and month (in German)
  year: { type: Number, default: getCurrentYear },
  month: { type: String, default: getCurrentMonth },
});

const CostApproval = model("CostApproval", costApprovalSchema);

module.exports = CostApproval;
