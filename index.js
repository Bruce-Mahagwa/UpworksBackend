//dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
require("dotenv").config()
// files and modules
const connectDB = require("./db/connect");
// models
const User = require("./models/User");
const Profile = require("./models/Profile");
const PostJobs = require("./models/PostJobs");
const Proposal = require("./models/Proposal");
const { registerFreelancer, registerClient, login, logout, fetchAllFreelancers } = require("./controllers/auth");
const { profileHandler } = require("./controllers/refresh");
const { addProfile, addProfileImage, getProfile } = require("./controllers/profile");
const { postJob, getPostedJobs, getAllAvailableJobs } = require("./controllers/postjob");
const { deleteClientJob, deleteFreelancerProposal } = require("./controllers/delete");
// variables
const PORT = 3001;
const app = express();
//  middleware
app.use(express.json());
app.use(cors({  credentials: true, origin: "https://upworks-backend.onrender.com" }));
app.use(cookieParser())
app.use("/uploads", express.static(__dirname + "/uploads"))
// begin of routes
app.post("/register/freelancer", registerFreelancer);
app.post("/register/client", registerClient);

// login
app.post("/login", login);
// profile 
app.get("/profile", profileHandler);
//logout
app.post("/logout", logout);
//add profile
app.post("/addprofile", addProfile);
app.post("/uploads", upload.array("photos", 100), addProfileImage);
app.get("/checkProfile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ProfileDoc = await Profile.findOne({ owner: id }).exec();
    res.json(ProfileDoc);
  }
  catch (e) {
    console.log(e);
    res.status(404).json("could not check for the profile");
  }
})
//update profile
app.put("/updatetitle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body
    const ProfileDoc = await Profile.findOneAndUpdate({ owner: id }, { title: title }, { returnOriginal: false });
    console.log(ProfileDoc.title)
    res.json(ProfileDoc);
  }
  catch(e) {
    console.log(e)
    res.status(404).json("cannot update title")
  }
})
app.put("/updateskills/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { skills } = req.body
    const ProfileDoc = await Profile.findOneAndUpdate({ owner: id }, { skills: skills.split(",") }, { returnOriginal: false });
    res.json(ProfileDoc);
  }
  catch(e) {
    console.log(e)
    res.status(404).json("cannot update skills")
  }
})
app.put("/updateoverview/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { overview } = req.body
    const ProfileDoc = await Profile.findOneAndUpdate({ owner: id }, { overview: overview }, { returnOriginal: false });
    res.json(ProfileDoc);
  }
  catch(e) {
    console.log(e)
    res.status(404).json("cannot update overview")
  }
})
app.put("/updateimage/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body
    const ProfileDoc = await Profile.findOneAndUpdate({ owner: id }, { image: image }, { returnOriginal: false });
    res.json(ProfileDoc);
  }
  catch(e) {
    console.log(e)
    res.status(404).json("cannot update image")
  }
})
app.put("/updatehours/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { hourly_rate } = req.body
      const ProfileDoc = await Profile.findOneAndUpdate({ owner: id }, { hourly_rate: hourly_rate }, { returnOriginal: false });
      res.json(ProfileDoc);
    }
    catch(e) {
      console.log(e)
      res.status(404).json("cannot update hours")
  }
})

// client post jon
app.post("/postjob", postJob);
app.get("/getpostedjobs", getPostedJobs)
// delete client job
app.delete("/deleteclientjob", deleteClientJob);
// get all available jobs
app.get("/allavailablejobs", getAllAvailableJobs);
// get single job
app.get("/singlejob/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const SingleJob = await PostJobs.findById(id).exec();
    res.json(SingleJob);
  }
  catch(e) {
    console.log(e)
    res.status(404).json("cannot find single job")
  }
})
//edit posted job
app.put("/editjob/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, skills, experience } = req.body;
    const EditDoc = await PostJobs.findOneAndUpdate({ _id: id }, { title: title, description: description, price: price, skills: skills.split(","), experience: experience }, { returnOriginal: false });
    res.json(EditDoc);
  }
  catch(e) {
    console.log(e)
    res.status(404).json("cannot edit job")
  }
})
// post a proposal
app.post("/submitproposal/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { price, proposaltext, specific_job } = req.body;
    const ProposalDoc = await Proposal.create({
      owner: id, specific_job: specific_job, price, description: proposaltext
    });
    res.json(ProposalDoc);
  }
  catch(e) {
    console.log(e)
    res.status(404).json("cannot submit proposal")
  }
})
// get freelancer proposals
app.get("/freelancerproposals/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const AllProposals = await Proposal.find({ owner: id }).populate("specific_job").exec();
    res.json(AllProposals);
  }
  catch (e) {
    console.log(e);
    res.status(404).json("we cannot fetch proposals")
  }
})
app.delete("/deletefreelancerproposal", deleteFreelancerProposal)
// get all freelancers
app.get("/allfreelancers", fetchAllFreelancers);
app.get("/individualprofiles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const Profiles = await Profile.find({ owner: id })
    res.json(Profiles)
  }
  catch(e) {
    console.log(e)
    res.status(404).json("cannot find profile");
  }
})
// end of routes

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
start();
