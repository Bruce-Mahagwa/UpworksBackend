// files
const User = require("../models/User");
// dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// variables
const saltrounds = 5;

async function registerFreelancer(req, res) {
  const { firstname, lastname, email, password, role, country } = req.body.freelancer;
  try {
    const userDoc = await User.create({ firstname, lastname, email, password: bcrypt.hashSync(password, saltrounds), role, country })
    res.json(userDoc)
  }
  catch (e) {
    console.log(e)
  }
}

async function registerClient(req, res) {
  const { firstname, lastname, email, password, role, country } = req.body.client;
  try {
    const userDoc = await User.create({ firstname, lastname, email, password: bcrypt.hashSync(password, saltrounds), role, country })
    res.json(userDoc)
  }
  catch (e) {
    console.log(e)
  }
}

async function login(req, res) {
  const { email, password } = req.body.credentials;
  const user = await User.findOne({ email });
  if (user) {
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (checkPassword) {
      jwt.sign({
        email: user.email, id: user._id, role: user.role, firstname: user.firstname, lastname: user.lastname, country: user.country
      }, process.env["JWT_SECRET"], {}, (err, token) => {
        if (err) {
          console.log(err);
          throw err;
        }
        else {
          res.cookie("token", token).json(user);
        }
      })
    }
    else {
      res.status(404).json(null)
    }
  }
  else {
    res.status(404).json(null);
  }
}
// logout
function logout(req, res) {
  try {
    res.cookie("token", "").json("logged out")
  }
  catch (e) {
    console.log(e);
    res.status(404).json("could not log out");
  }
}
// fetch freelancers
async function fetchAllFreelancers(req, res) {
  try {
    const FreelancerDoc = await User.find({ role: "freelancer" });
    res.json(FreelancerDoc);
  }
  catch (e) {
    console.log(e);
    res.status(404).json("could not fetch freelancers")
  }
}
module.exports = { registerFreelancer, registerClient, login, logout, fetchAllFreelancers }