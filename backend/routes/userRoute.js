const express = require("express");
const { registerUser, loginUser, logoutUser, getUser, updateUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/getUser", protect ,getUser)
router.patch("/updateUser", protect ,updateUser)

router.delete("/:id", protect ,deleteUser)

module.exports = router