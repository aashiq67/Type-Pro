const express = require('express');
const {
    register,
    verifyEmail,

    login,
    verifyToken,
    getUsername,
    refreshToken,

    getUsernameFromMail,

    forgotPassword,
    verifyOTP,
    setPassword,

    logout
} = require("./../controllers/userControllers")

const router = express.Router();

router.post("/register", register);
router.get("/confirmation/:token", verifyEmail)

router.post("/login", login);

router.get("/dashboard", verifyToken, getUsername);
router.get("/refreshToken", refreshToken, verifyToken, getUsername)

router.post("/getusername", getUsernameFromMail);

router.post("/forgotpassword", forgotPassword);
router.post("/verifyotp", verifyOTP);
router.post("/setpassword", setPassword);

router.get("/logout", logout);

module.exports = router;