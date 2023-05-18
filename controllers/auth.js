const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const role = req.body.role;
  const mobileNumber = req.body.mobileNumber;
  const address = req.body.address;
  const importFlag = req.body.importFlag;


  try {
    const checkUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    console.log(checkUser);
    if(checkUser){
        const error = new Error("User already signed in....so go for login...!");
        error.statusCode = 401;
        throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      username: username,
      password: hashedPw,
      fullName: fullName,
      role: role,
      mobileNumber: mobileNumber,
      address: address,
      importFlag: importFlag
    });
    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;

  try {
    let user;
    if (email === undefined) {
      user = await User.findOne({ username: username });
      if (!user) {
        const error = new Error("A user with this mobile number not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser=user;
    } else {
      user = await User.findOne({ email: email });
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser=user;

    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wromg password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    res
      .status(200).setHeader("x-auth-token", token)
      .json({ token: token, userId: loadedUser._id.toString(), message: "Successfully LogIn" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
