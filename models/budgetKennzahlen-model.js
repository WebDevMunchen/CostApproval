const { Schema, model } = require("mongoose");

const budgetKennzahlenSchema = new Schema({
    year: {type: Number},
    month: {type: String},
    amount: {type: Number},
    usedAmount: {type: Number, default: 0},
    usedAmountCent: {type: Number, default: 0},
    department: { type: String, required: true }
});

const BudgetKennzahlen = model("KennzahlenBudget", budgetKennzahlenSchema);
module.exports = BudgetKennzahlen;
