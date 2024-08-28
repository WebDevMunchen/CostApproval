const { Schema, model } = require("mongoose");

const budgetSchema = new Schema({
    year: {type: Number, required: true},
    month: {type: String, required: true},
    amount: {type: Number, required: true}
});

const Budget = model("Budget", budgetSchema);
module.exports = Budget;
