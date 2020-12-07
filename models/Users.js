const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  garden: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("User", userSchema);
