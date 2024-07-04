const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
//* express-async-handler --> Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers
const bcrypt = require("bcryptjs");
const { generateToken, hashToken } = require("../utils");
var parser = require("ua-parser-js");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const Cryptr = require("cryptr");

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

//? Register
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

//?Send Verification Email
const sendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(404);
    throw new Error("User is already verified");
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  //? Create verification token and save
  const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(verificationToken);

  //? Hash token and save
  const hashedToken = hashToken(verificationToken);

  await new Token({
    userId: user._id,
    vToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), //? 60 minutes
  }).save();

  //? Construct Verfication URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

  //? Send email
  const subject = "Verify your account - Auth-App";
  const sent_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@rico.com";
  const template = "verifyEmail";
  const name = user.name;
  const link = verificationUrl;

  try {
    await sendEmail(
      subject,
      sent_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: "Verification Email sent" });
  } catch (error) {
    res.status(500);
    throw new Error("An error occured while sending the email");
  }
});

//? Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //   Validation
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found, please signup");
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  // Trgger 2FA for unknow UserAgent
  const ua = parser(req.headers["user-agent"]);
  const thisUserAgent = ua.ua;
  console.log(thisUserAgent);
  const allowedAgent = user.userAgent.includes(thisUserAgent);

  if (!allowedAgent) {
    // Genrate 6 digit code
    const loginCode = Math.floor(100000 + Math.random() * 900000);
    console.log(loginCode);

    // Encrypt login code before saving to DB
    const encryptedLoginCode = cryptr.encrypt(loginCode.toString());

    // Delete Token if it exists in DB
    let userToken = await Token.findOne({ userId: user._id });
    if (userToken) {
      await userToken.deleteOne();
    }

    // Save Tokrn to DB
    await new Token({
      userId: user._id,
      lToken: encryptedLoginCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * (60 * 1000), // 60mins
    }).save();

    res.status(400);
    throw new Error("New browser or device detected");
  }

  // Generate Token
  const token = generateToken(user._id);

  if (user && passwordIsCorrect) {
    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    const { _id, name, email, phone, bio, photo, role, isVerified } = user;

    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
    });
  } else {
    res.status(500);
    throw new Error("Something went wrong, please try again");
  }
});

//?Send Login Code
const sendLoginCode = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //?Find User LToken
  let userToken = await Token.findOne({
    userId: user._id,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired token");
  }

  const loginCode = userToken.lToken;
  const decryptedLoginCode = cryptr.decrypt(loginCode);

  //? Send Login Code
  const subject = "Login Access Code - Auth-App";
  const sent_to = email; //? Email that we destructured from the params
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@rico.com";
  const template = "loginCode";
  const name = user.name;
  const link = decryptedLoginCode;

  try {
    await sendEmail(
      subject,
      sent_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: `Access code sent to ${email}` });
  } catch (error) {
    res.status(500);
    throw new Error("An error occured while sending the email");
  }
});

const loginWithCode = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { loginCode } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find user Login Token
  const userToken = await Token.findOne({
    userId: user.id,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token, please login again");
  }

  const decryptedLoginCode = cryptr.decrypt(userToken.lToken);

  if (loginCode !== decryptedLoginCode) {
    res.status(400);
    throw new Error("Incorrect login code, please try again");
  } else {
    // Register userAgent
    const ua = parser(req.headers["user-agent"]);
    const thisUserAgent = ua.ua;
    user.userAgent.push(thisUserAgent);
    await user.save();

    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    const { _id, name, email, phone, bio, photo, role, isVerified } = user;

    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
    });
  }
});

//? Verify User
const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  const hashedToken = hashToken(verificationToken);

  const userToken = await Token.findOne({
    vToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired verification token");
  }

  const user = await User.findOne({ _id: userToken.userId });

  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  //? Now verify User
  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: "Account verified" });
});

//? Logout
const logoutUser = asyncHandler(async (req, res) => {
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

//? Get user
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  //? This is becuase we are getting the value of user as req.user in p[rotect middleware]

  if (user) {
    // const { _id, name, email, password, phone, bio, photo, isVerified } = user;
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//? Update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { email, name, phone, bio, photo } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      photo: updatedUser.photo,
      isVerified: updatedUser.isVerified,
      token: updatedUser.token,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//? Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.params.id);
  //? Jo bhi url me diya ho wo h params me aata h

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.status(200).json({ message: " User deleted successfully" });
});

//? Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort("createdAt").select("-password");

  if (!users) {
    res.status(404);
    throw new Error("No users found");
  } else {
    res.status(200).json(users);
  }
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.json(false);
  }

  //?Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    res.json(true);
  }
  res.json(false);
});

//?Upgrade User
const upgradeUser = asyncHandler(async (req, res) => {
  const { role, id } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  } else {
    user.role = role;
    await user.save();

    res.status(200).json({ message: `User upgraded to ${role}` });
  }
});

//?Send Automated Email
const sendAutomatedEmail = asyncHandler(async (req, res) => {
  const { subject, sent_to, reply_to, template, url } = req.body;

  if (!subject || !sent_to || !reply_to || !template) {
    res.status(400);
    throw new Error("Missing email parameter");
  }

  const user = await User.findOne({ email: sent_to });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const sent_from = process.env.EMAIL_USER;
  const name = user.name;
  const link = `${process.env.FRONTEND_URL}${url}`;

  try {
    await sendEmail(
      subject,
      sent_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.status(500);
    throw new Error("An error occured while sending the email");
  }
});

//? Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  let token = await Token.findOne({ userId: user._id });

  if (token) {
    await token.deleteOne();
  }

  //? Create verification token and save
  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  //? Hash token and save
  const hashedToken = hashToken(resetToken);

  await new Token({
    userId: user._id,
    rToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), //? 60 minutes
  }).save();

  //? Construct Reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

  //? Send email
  const subject = "Password Reset Request - Auth-App";
  const sent_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@rico.com";
  const template = "forgotPassword";
  const name = user.name;
  const link = resetUrl;

  try {
    await sendEmail(
      subject,
      sent_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: "Reset Password Email sent" });
  } catch (error) {
    res.status(500);
    throw new Error("An error occured while sending the email");
  }
});

//? Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const hashedToken = hashToken(resetToken);

  const userToken = await Token.findOne({
    rToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired verification token");
  }

  const user = await User.findOne({ _id: userToken.userId });

  //? Now Reset User Password
  user.password = password;
  await user.save();

  res
    .status(200)
    .json({ message: "Password Reset sucessful. Please Login again" });
});

//? Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, password } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please enter old and new password");
  }

  // Check if old password is correct
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();

    res
      .status(200)
      .json({ message: "Password change successful, please re-login" });
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  loginStatus,
  upgradeUser,
  sendAutomatedEmail,
  sendVerificationEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
  sendLoginCode,
  loginWithCode,
};

//? Check register through --> body--> url-encoded


