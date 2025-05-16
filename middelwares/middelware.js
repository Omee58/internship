const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports = {
  SetTocken: async function (req, res, next) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user && user.password === password) {
      req.token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      next();
    } else {
      res.redirect("/?error=Invalid%20email%20or%20password");
    }
  },

  UserExist: async function (req, res, next) {
    const { email } = req.body;
    const isUserExist = await userModel.findOne({ email });

    if (!isUserExist) return next();

    res.redirect("/register?error=User's%20email%20already%20exist");
  },

  isUserLogin: async function (req, res, next) {
    const token = req.cookies.token;
    if (token) {
      next();
    } else {
      res.redirect("/");
    }
  },

  sendOtp: async function (req, res, next) {
    const { FirstName, email } = await req.body;
    req.session.user = await req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000);

    req.session.otp = otp;
    console.log("otp : ", otp);

    const mailOptions = {
      to: email,
      subject: "Registration OTP",
      html: `
       <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; padding: 50px 0;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); overflow: hidden;">
    
    <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Verify Your Email</h1>
    </div>

    <div style="padding: 30px;">
      <p style="font-size: 18px; color: #333333; margin-bottom: 20px;">
        Hello <strong>${FirstName}</strong>,
      </p>

      <p style="font-size: 16px; color: #555555; line-height: 1.6;">
        Thank you for signing up! To complete your registration, please use the OTP below to verify your email address.
      </p>

      <div style="margin: 30px 0; text-align: center;">
        <div style="display: inline-block; background-color: #e0e7ff; color: #1e40af; font-size: 32px; font-weight: bold; padding: 12px 24px; border-radius: 8px; letter-spacing: 3px;">
          ${otp}
        </div>
      </div>

      <p style="font-size: 14px; color: #888888;">
        This OTP will expire in 10 minutes. Please do not share it with anyone.
      </p>
    </div>

    <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #999;">
      If you didn't request this, you can ignore this email.
    </div>

  </div>
</div>

      `,
    };

    try {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send("Error sending OTP email.");
        }
      });

      await next();
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  addOTP: async function (req, res, next) {
    req.otp = await req.session.otp;
    await next();
  },

  RegisterUser: async function (req, res, next) {
    const { FirstName, LastName, email, dob, password } = await req.session.user;
    const user = await userModel.create({
      FirstName,
      LastName,
      email,
      DOB: dob,
      password,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    next();
  },

  FindUser: async function (req, res, next) {
    const token = req.cookies.token;
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: data.id });

    req.LoginUser = await user;

    next();
  },
};
