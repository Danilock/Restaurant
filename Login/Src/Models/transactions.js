const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  imageURL: String,
  dish: String,
  user: String,
  email: String,
  amount: String,
  date: String,
  status: Boolean,
});

module.exports = mongoose.model("transactions", transactionSchema);
