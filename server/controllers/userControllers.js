const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require("uuid");
const { mailTransport, generateOTP } = require('./emailControllers');

const VERIFICATION_SECRET = "verification_secret";
const MAILTRAP_USERNAME = "aashiqrockz67@gmail.com";
const JWT_SECRET_KEY = "jwt_secret_key";
const VERIFY_OTP_SECRET = "verify_otp_secret";

module.exports.register = async (req, res, next) => {
    try {
        // Take input
        const { username, email, password } = req.body;

        // Check username if exists
        // const checkUsername = await User.findOne({ username });
        // if (checkUsername)
        //     return res.json({ message: "Username already exists", status: false });

        // Check email if exists
        const checkEmail = await User.findOne({ email });
        if (checkEmail)
            return res.json({ message: "Email already exists", status: false });


        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verified: false
        })

        //EMAIL SENDING
        const token = jwt.sign({ email }, VERIFICATION_SECRET, {
            expiresIn: '10m'
        });

        const url = `http://localhost:5000/user/confirmation/${token}`;
        await mailTransport().sendMail({
            from: MAILTRAP_USERNAME,
            to: email,
            subject: "Verify your email account",
            html: `<a href="${url}">${url}</a>`
        });

        // save the user
        await newUser.save();
        console.log(`account verification link sent to ${email}`);
        return res.json({ message: `account verification link sent to ${email}.`, status: true });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.verifyEmail = async (req, res, next) => {
    try {
        const token = req.params['token'];

        jwt.verify(token, VERIFICATION_SECRET, async (err, user) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Invalid Token.", status: false });
            }

            await User.updateOne({ username: user.username }, { $set: { verified: true } })
            return res.redirect("http://localhost:3000")
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        // Take input
        const { email, password } = req.body;
        // check if username exists
        console.log(email, password);
        const existingUser = await User.findOne({ email })
        if (!existingUser)
            return res.json({ message: "Email not found", status: false });

        // compare passwords
        const checkPassword = await bcrypt.compare(password, existingUser.password);
        if (!checkPassword)
            return res.json({ message: "Incorrect Password", status: false });

        const token = jwt.sign({ email }, JWT_SECRET_KEY, {
            expiresIn: '10m'
        });

        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 30000 // 30 secs
        });
        
        return res.json({ message: "Login Successfull", username: existingUser.username, accuracy: existingUser.accuracy, wpm: existingUser.wpm, status: true })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.getUsernameFromMail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { username } = await User.findOne({ email })
        return res.json({ status: true, username })
    } catch (error) {
        console.log(error);
        return res.json({ status: false, message: "cannot find user name from email" })
    }
}

module.exports.verifyToken = async (req, res, next) => {
    try {
        
        const token = req.cookies['access_token'];
        
        if (!token) {
            return res.json({ message: "No token found", status: false });
        }

        jwt.verify(token, JWT_SECRET_KEY, (err, tokenDetails) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Invalid Token.", status: false });
            }
            req.email = tokenDetails.email;
        })

        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.getUsername = async (req, res, next) => {
    try {
        const email = req.email;

        const { username } = await User.findOne({ email })
        if (!username)
            return res.json({ message: "No user found", status: false });

        return res.json({ message: "Token verified Successfully", username, status: true })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies['access_token'];

        let email;
        jwt.verify(token, JWT_SECRET_KEY, (err, tokenDetails) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Invalid Token" });
            }
            email = tokenDetails.email;
        })

        const newToken = jwt.sign({ email }, JWT_SECRET_KEY, {
            expiresIn: '10m'
        })

        res.cookie('access_token', newToken, {
            httpOnly: true,
            sameSite: true,
            maxAge: 30000 // 30 secs
        })

        next();

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        checkEmail = await User.findOne({ email });
        if (!checkEmail)
            return res.json({ message: "Email not found" })

        const otp = generateOTP();
        const otp_token = jwt.sign({ otp }, VERIFY_OTP_SECRET, {
            expiresIn: '10m'
        });

        res.cookie('otp_token', otp_token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 600000 // 600s = 10m
        })

        await mailTransport().sendMail({
            from: MAILTRAP_USERNAME,
            to: email,
            subject: "Forgot Password OTP",
            html: `<h1>${otp}</h1>`
        });
        console.log(otp);
        return res.json({ message: "otp sent", status: true });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.verifyOTP = async (req, res, next) => {
    try {
        const { otp } = req.body;

        const otp_token = req.cookies['otp_token'];
        if (!otp_token) {
            return res.json({ message: "No token found", status: false });
        }

        jwt.verify(otp_token, VERIFY_OTP_SECRET, (err, tokenDetails) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Invalid Token", status: false })
            }
            console.log(tokenDetails);
            if (otp != tokenDetails.otp)
                return res.json({ message: "Wrong otp", status: false })
        })
        return res.json({ message: "otp verification successfull", status: true })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.setPassword = async (req, res, next) => {
    try {
        const { password } = req.body;

        const otp_token = req.cookies['otp_token'];
        if (otp_token)
            res.clearCookie('otp_token');

        const token = req.cookies['access_token'];
        if (!token)
            return res.json({ message: "token not found", status: false });

        jwt.verify(token, JWT_SECRET_KEY, async (err, tokenDetails) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Invalid Token", status: false })
            }
            const email = tokenDetails.email;
            const hashedPassword = await bcrypt.hash(password, 10);

            await User.updateOne({ email }, { $set: { password: hashedPassword } })
        })
        return res.json({ message: "password changed successfully", status: true })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.logout = async (req, res, next) => {
    try {
        const token = req.cookies['access_token'];
        if (token)
            res.clearCookie('access_token');
        return res.json({ message: "User logged out successfully", status: true })
    } catch (error) {
        console.log(error);
        next(error);
    }
}
