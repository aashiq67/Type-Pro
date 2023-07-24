require("dotenv").config();
const nodemailer = require('nodemailer');

const MAILTRAP_USERNAME = "aashiqrockz67@gmail.com";
const MAILTRAP_PASSWORD = "kqqgtivpzijbszij";

const mailTransport = () => nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: MAILTRAP_USERNAME,
        pass: MAILTRAP_PASSWORD
    }
});

const generateOTP = () => {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    return OTP;
}

exports.mailTransport = mailTransport;
exports.generateOTP = generateOTP;