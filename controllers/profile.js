// files
const Profile = require("../models/Profile");
// modules
const fs = require("fs");
// dependencies
const jwt = require("jsonwebtoken");

function addProfile(req, res) {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env["JWT_SECRET"], {}, async (err, user) => {
      if (err) {
        console.log(err)
        throw err;
      }
      else {
        const { image, title, overview, hourly_rate, skills } = req.body.profile;
        const ProfileDoc = await Profile.create({
          owner: user.id, image, title, overview, hourly_rate, skills: skills.split(",")
        })
        res.json(ProfileDoc);
      }
    })
  }
  else {
    res.status(404).json(null)
  }
}
function getProfile(req, res) {
  const { token } = req.cookies;
  jwt.verify(token, process.env["JWT_SECRET"], {}, async (err, user) => {
    if (err) {
      console.log(err);
      throw err;
    }
    else {
      const { id } = user;
      const ProfileDoc = await Profile.find({ owner: id });
      res.json(ProfileDoc)
    }
  })
}
async function addProfileImage(req, res) {
  const { path, originalname } = req.files[0];
  const parts = originalname.split(".");
  const postfix = parts[parts.length - 1];
  let newPath = path + "." + postfix;
  fs.renameSync(path, newPath);
  newPath = newPath.replace("uploads/", "");
  res.json(newPath);
}

module.exports = { addProfile, addProfileImage, getProfile}; 