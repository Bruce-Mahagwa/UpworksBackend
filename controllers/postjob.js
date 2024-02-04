// files
const PostJobs = require("../models/PostJobs");
const connectDB = require("../db/connect")
// dependencies
const jwt = require("jsonwebtoken");
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
async function postJob(req, res) {
  await start()
  try {
    const { token } = req.cookies;
    const { title, description, price, experience, skills } = req.body;
    if (token) {
      jwt.verify(token, process.env["JWT_SECRET"], {}, async (err, user) => {
        if (err) {
          console.log(err);
          throw err;
        }
        else {
          const PostJobDoc = await PostJobs.create({
            owner: user.id, experience, price, description, title, skills: skills.split(",")
          });
          res.json(PostJobDoc);
        }
      })
    }
  }
  catch(e) {
      res.status(404).json({error: e});
  }
}

async function getPostedJobs(req, res) {
  await start()
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env["JWT_SECRET"], {}, async (err, user) => {
      if (err) {
        console.log(err);
        throw err;
      }
      else {
        const JobsDoc = await PostJobs.find({ owner: user.id });
        res.json(JobsDoc);
      }
    })
  }
  else {
    res.status(404).json(null)
  }
}
async function getAllAvailableJobs(req, res) {
  const AllJobs = await PostJobs.find({}).exec();
  res.json(AllJobs)
}
module.exports = { postJob, getPostedJobs, getAllAvailableJobs }
