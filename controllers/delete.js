// files
const PostJobs = require("../models/PostJobs");
const Proposal = require("../models/Proposal");
const connectDB = require("../db/connect")
// variables
const mongoose = require("mongoose");
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log("App is listening on port " + PORT)
    })
  }
  catch (e) {
    console.log(e);
  }
}
async function deleteClientJob(req, res) {
  await start()
  const {id} = req.body
  const DeleteDoc = await PostJobs.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
  res.json(DeleteDoc);
}

async function deleteFreelancerProposal(req, res) {
  await start()
  const {id} = req.body;
  const DeleteProposalDoc = await Proposal.findOneAndDelete({_id: new mongoose.Types.ObjectId(id)}).exec();
  res.json(DeleteProposalDoc);
}
module.exports = { deleteClientJob, deleteFreelancerProposal }
