const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String, default: "India" },
});
const userModel = mongoose.model("user22", userSchema);
module.exports = userModel;
