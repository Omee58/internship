const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const CookieParser = require("cookie-parser");
const middelware = require("./middelwares/middelware");
const controller = require("./controllers/user.controller");
require("dotenv").config();
const PORT = process.env.PORT || 3030;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(CookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
    secure: false
  }
}));

// ======================= Home / index page =======================
app.get("/", controller.showLoginPage);
app.post("/login", middelware.SetTocken, controller.handleLogin);


// ======================= Register Page =======================
app.get("/register", controller.showRegisterPage);
app.post(
  "/register",
  middelware.UserExist,
  middelware.sendOtp,
  controller.redirectOtpPage
);


// ======================= Profile Page =======================
app.get(
  "/profile",
  middelware.isUserLogin,
  middelware.FindUser,
  controller.profilePage,
);


// ======================= OTP Verification page =======================
app.get("/otp-verification", middelware.addOTP, controller.showOtpVerificationPage);
app.post("/verify-otp", middelware.RegisterUser, controller.redirectProfilePage);


// ======================= Update Page =======================
app.get("/update", middelware.FindUser, controller.showUpdatePage);
app.post("/update", middelware.FindUser, controller.updateUser);


// ======================= Delete Page =======================
app.get("/delete/:id", middelware.isUserLogin, controller.deleteUser);


// ======================= Logout =======================
app.get("/logout", controller.logoutPage);


// =====================================================================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});