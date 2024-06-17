const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
//* express-async-handler --> Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils");
var parser = require("ua-parser-js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //?Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  //?Check the password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be atleast 6 characters long");
  }

  //?Check if the user already exists
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  //* Getting user agent
  const ua = parser(req.headers["user-agent"]);
  const userAgent = [ua.ua];

  //* Creating User
  const user = await User.create({
    name,
    email,
    password,
    userAgent,
  });

  //? Generate Token
  const token = generateToken(user._id);

  //? Send http only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //* One day
    secure: true,
    sameSite: "none",
  });

  if (user) {
    const { _id, name, email, password, phone, bio, photo, isVerified } = user;

    res.status(201).json({
      _id,
      name,
      email,
      password,
      phone,
      bio,
      photo,
      isVerified,
      token,
    });
  } else {
    res.status(400);
    throw new Error("error regestering user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //?Validation
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found. Please sign up");
  }


  //?Check if the password matches
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  //* Getting user agent and triggering 2FA for unknown user agents

  const token = generateToken(user._id);

  if (user && passwordIsCorrect) {
    //? Send http only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //* One day
      secure: true,
      sameSite: "none",
    });

    const { _id, name, email, password, phone, bio, photo, isVerified } = user;

    res.status(200).json({
      _id,
      name,
      email,
      password,
      phone,
      bio,
      photo,
      isVerified,
      token,
    });
  } else {
    res.status(500);
    throw new Error("Something went wrong. Try again later");
  }
});


//? Logout

const logoutUser  = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //* One day
    secure: true,
    sameSite: "none",
  });
  //? To logout, we just expire the cookie

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};

//? Check register through --> body--> url-encoded
