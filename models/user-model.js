const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  abbreviation: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  department: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  // request: { type: Schema.Types.ObjectId, ref: "CostApprovalRequest" },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = model("User", userSchema);

module.exports = User;
