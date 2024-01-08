const mongoose = require("mongoose");
const PostJobsSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String
  },
  price: {
    type: Number
  },
  description: {
    type: String
  },
  skills: [String],
  experience: {
    type: String
  }
})
module.exports = mongoose.model("PostJobs", PostJobsSchema);