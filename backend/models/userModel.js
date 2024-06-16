const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid emaial",
      ],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
      },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://github.com/zinotrust/auth-app-styles/blob/master/assets/avatarr.png"
      },
    phone: {
        type: String,
        default: "+91"
      },
    bio: {
        type: String,
        default: "bio"
      },
    role: {
        type: String,
        required: true,
        default: "subscriber"
        //subscriber, author, admin and suspended
      },
    isVerified: {
        type: Boolean,
        default: false
      },
    userAgents: {
        type: Array,
        required:false,
        default: []
        //subscriber, author, admin and suspended
      },
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", userSchema)
module.exports = User;