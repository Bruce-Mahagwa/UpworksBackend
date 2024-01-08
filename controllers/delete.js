// files
const PostJobs = require("../models/PostJobs");
const Proposal = require("../models/Proposal");
// variables
const mongoose = require("mongoose");
async function deleteClientJob(req, res) {
  const {id} = req.body
  const DeleteDoc = await PostJobs.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
  res.json(DeleteDoc);
}

async function deleteFreelancerProposal(req, res) {
  const {id} = req.body;
  const DeleteProposalDoc = await Proposal.findOneAndDelete({_id: new mongoose.Types.ObjectId(id)}).exec();
  res.json(DeleteProposalDoc);
}
module.exports = { deleteClientJob, deleteFreelancerProposal }