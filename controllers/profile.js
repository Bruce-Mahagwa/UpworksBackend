// files
const Profile = require("../models/Profile");
const connectDB = require("../db/connect")
// modules
const fs = require("fs");
// dependencies
const jwt = require("jsonwebtoken");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

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

async function uploadToS3(path, originalFileName, mimeType) {
  await start()
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env["S3_ACCESS_KEY"],
      secretAccessKey: process.env["S3_SECRET_ACCESS_KEY"]
    },
  })
}
async function addProfile(req, res) {
  await start()
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
async function getProfile(req, res) {
  await start()
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
  await start()
  const { path, originalFileName, mimetype } = req.files[0];
  await uploadToS3(path, originalname, mimetype)
  const parts = originalname.split(".");
  const postfix = parts[parts.length - 1];
  let newPath = path + "." + postfix;
  newPath = newPath.replace("uploads/", "");
  const data = await client.send(new PutObjectCommand({
    Bucket: "bruceupworkphotos",
    Body: fs.readFileSync(path),
    Key: newPath,
    ContentType: mimetype,
    ACL: "public-read"
  }))
  return `https://bruceupworkphotos.s3.amazonaws.com/${newPath}`

}

module.exports = { addProfile, addProfileImage, getProfile}; 
