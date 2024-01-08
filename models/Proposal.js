const mongoose = require("mongoose");
const ProposalSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  specific_job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostJobs"
  },
  price: {
    type: Number
  },
  description: {
    type: String
  }
});
module.exports = mongoose.model("Proposal", ProposalSchema);