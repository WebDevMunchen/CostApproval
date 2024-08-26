const { Schema, model } = require("mongoose");

const costApprovalSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  typeOfExpense: {
    type: String,
    enum: ["Bereich", "Projekt", "Kontrakt"],
    required: true,
  },
  title: { type: String, required: true },
  additionalMessage: { type: String },
  expenseAmount: { type: Number, required: true },
  expenseAmountCent: { type: Number, required: true },
  liquidity: { type: Boolean, default: false },
  liquidityApproved: { type: Boolean, default: false },
  approver: { type: String, enum: ["Ben", "Tobias", "Sandra", "Marion"] },
  fileURL: { type: String },
  dateOfCreation: { type: Date, default: Date.now() },
  deadline: {type: Date, required: true},
  priority: {type: String, enum: ["Dringend", "Kann warten", "Mittel"]},
  lastUpdate: { type: Date },
  status: {
    type: String,
    enum: [
      "Neu",
      "Genehmigt",
      "Abgelehnt",
      "In Prüfung",
      "Ja zum späteren Zeitpunkt",
    ],
  },
  reason: { type: String },
});

const CostApproval = model("CostApproval", costApprovalSchema);

module.exports = CostApproval;
