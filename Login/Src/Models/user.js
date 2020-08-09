const mongoose = require("mongoose");
const { Schema } = mongoose;
const bCrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  lastName: String,
  accountType: String,
  debt: String,
});

userSchema.methods.encryptPassword = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
};

userSchema.methods.validatePassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("users", userSchema);
