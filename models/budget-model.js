const { Schema, model } = require("mongoose");

const budgetSchema = new Schema({
    year: {type: Number},
    month: {type: String},
    amount: {type: Number}
});

const Budget = model("Budget", budgetSchema);
module.exports = Budget;
