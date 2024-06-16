const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
//* express-async-handler --> Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers
const bcrypt = require("bcryptjs");
const {generateToken} = require("../utils")

const  registerUser = asyncHandler(async (req, res) => {
    const {name,email,password} = req.body

    //?Validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please fill all the fields")
    }

    //?Check the password length
    if(password.length < 6){
        res.status(400)
        throw new Error("Password must be atleast 6 characters long")
    }

    //?Check if the user already exists
    const userExist = await User.findOne({email})

    if(userExist){
        res.status(400)
        throw new Error("User already exists")
    }

    //* Creating User
    const user = await User.create({
        name,
        email,
        password
    })


    //? Generate Token
    const token = generateToken(user._id)

    //? Send http only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000*86400), //* One day
        secure: true,
        sameSite : "none"
    })

    if(user){
        const {_id, name, email, password, phone, bio, photo, isVerified} = user

        res.status(201).json({
            _id,
            name,
            email,
            password,
            phone,
            bio,
            photo,
            isVerified,
            token
        })

    }else{
        res.status(400)
        throw new Error("error regestering user")
    }

});

module.exports = {
  registerUser,
};


//? Check register through --> body--> url-encoded