// dependencies
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const connectDB = require("../db/connect")

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

function profileHandler(req, res) {
  await start()
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env["JWT_SECRET"], {}, async (err, user) => {
      if (err) {
        console.log(err);
        throw err;
      }
      else {
        const { firstname, lastname, role, country, email, _id } = await User.findById(user.id)
        res.json({ firstname, lastname, role, country, email, _id });
      }
    })
  }
  else {
    res.status(404).json(null)
  }
}
module.exports = { profileHandler };
