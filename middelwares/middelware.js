const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

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

  RegisterUser: async function (req, res, next) {
    const { FirstName, LastName, email, dob, password } = await req.body;
    const user = await userModel.create({
      FirstName,
      LastName,
      email,
      DOB: dob,
      password,
    });
    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    req.token = token;
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
