const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema({
  imageURL: String,
  title: String,
  description: String,
  price: String,
});

module.exports = mongoose.model("foods", foodSchema);
