const userModel = require("../models/userModel");

module.exports = {
  // Home/Login Page (GET)
  showLoginPage: function (req, res) {
    const token = req.cookies.token;
    
    if (token && token != '' && token != 'undefined' ) return res.redirect("/profile");

    const error = req.query.error;
    res.render("login", { error });
  },

  // Handle Login (POST)
  handleLogin: async function (req, res) {
    res.cookie("token", req.token);
    res.redirect("/profile");
  },

  // Register Page (GET)
  showRegisterPage: function (req, res) {
    const error = req.query.error;
    res.render("register", { error });
  },

  // (POST) register 
  redirectOtpPage: async function (req, res) {
    res.redirect("/otp-verification");
  },

  redirectProfilePage: function (req, res) {
    res.redirect("/profile");
  },

  showOtpVerificationPage: function (req, res) {
    res.render("verifyOtp", { otp: req.session.otp });
  },

  // Profile Page (GET)
  profilePage: function (req, res) {
    res.render("profile", { user: req.LoginUser });
  },

  // Update Page (GET)
  showUpdatePage: function (req, res) {
    res.render("update", { user: req.LoginUser });
  },

  // Handle Update (POST)
  updateUser: async function (req, res) {
    const { FirstName, LastName, email, dob, password } = req.body;
    const _id = req.LoginUser._id;

    await userModel.findOneAndUpdate(
      { _id },
      { FirstName, LastName, email, DOB: dob, password },
      { new: true }
    );

    res.redirect("/profile");
  },

  // Delete User (GET or DELETE)
  deleteUser: async function (req, res) {
    const id = req.params.id;
    await userModel.findOneAndDelete({ _id: id });
    res.clearCookie("token");
    res.redirect("/");
  },

  // Logout (GET)
  logoutPage: function (req, res) {
    res.clearCookie("token");
    res.redirect("/");
  },

};