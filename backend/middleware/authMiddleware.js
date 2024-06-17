const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken")

const protect  = asyncHandler(async (req, res, next) => {
    try {
        //? when logged in, we send cookies. SO we checking for cookies
        const token = req.cookies.token

        if(!token){
            res.status(401);
            throw new Error("Not authorised, no token")
        }

        //?Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        
        //?Get user id from token
        const user = User.findById(verified.id).select("-password")

        if(!user){
            res.status(404);
            throw new Error("User not found")
        }

        if(user.role==='suspended'){
            res.status(400);
            throw new Error("User is suspended.")
        }

        req.user = user

        next()
        
    } catch (error) {
        res.status(400);
        throw new Error("User is not authorised.Please log in");
    }
});

module.exports = protect