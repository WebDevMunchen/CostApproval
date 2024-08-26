const { Schema, model } = require("mongoose");

const costApprovalSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  typeOfExpense: {
    type: String,
    enum: ["Bereich", "Projekt", "Kontrakt"],
    required: true,
  },
  title: { type: String, required: true },
  additionalMessage: { type: String, required:true },
  expenseAmount: { type: Number, required: true },
  expenseAmountCent: { type: Number, required: true, default: 0 },
  liquidity: { type: Boolean, default: false },
  liquidityStatus: { type: String, enum: ["In Prüfung", "Genhemigt", "Abgelehnt"] },
  approver: { type: String, enum: ["Ben", "Tobias", "Sandra", "Marion"], required: true },
  fileURL: { type: String },
  dateOfCreation: { type: Date, default: Date.now() },
  deadline: {type: Date, required: true},
  priority: {type: String, enum: ["Dringend", "Kann warten", "Mittel"], required: true},
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
    default: "Neu"
  },
  reason: { type: String },
});

const CostApproval = model("CostApproval", costApprovalSchema);

module.exports = CostApproval;
