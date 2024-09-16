const { Schema, model } = require("mongoose");

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
  liquidityDeclineReason: {type: String},
  liquidityPendingReason: {type: String},
  declineReason: {type: String},
  pendingReason: {type: String},
  postponeReason: {type: String},
  updateMessage: {type: String}
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
  liquidityStatus: { type: String, enum: ["Neu", "In Prüfung", "Genehmigt", "Abgelehnt"] },
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

  year: { type: Number, default: getCurrentYear },
  month: { type: String, default: getCurrentMonth },
});

const CostApproval = model("CostApproval", costApprovalSchema);

module.exports = CostApproval;
