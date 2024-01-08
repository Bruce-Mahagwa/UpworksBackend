const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
  image: {
    type: String
  },
  title: {
    type: String
  },
  overview: {
    type: String
  },
  hourly_rate: {
    type: Number
  },
  skills: [String]
});
module.exports = mongoose.model("Profile", ProfileSchema);