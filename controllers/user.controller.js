const userModel = require("../models/userModel");

module.exports = {
  // Home/Login Page (GET)
  indexPage: function (req, res) {
    const token = req.cookies.token;
    if (token) return res.redirect("/profile");

    const error = req.query.error;
    res.render("login", { error });
  },

  // Handle Login (POST)
  loginUser: async function (req, res) {
    res.cookie("token", req.token);
    res.redirect("/profile");
  },

  // Register Page (GET)
  registerPage: function (req, res) {
    const error = req.query.error;
    res.render("register", { error });
  },

  // Handle Register (POST)
  registerUser: async function (req, res) {
    // token already set in middleware after creating user
    res.cookie("token", req.token);
    res.redirect("/profile");
  },

  // Profile Page (GET)
  profilePage: function (req, res) {
    res.render("profile", { user: req.LoginUser });
  },

  // Update Page (GET)
  updatePage: function (req, res) {
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
  deletePage: async function (req, res) {
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