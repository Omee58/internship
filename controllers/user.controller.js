const subscriptionModel = require("../models/subscription.model");
const userModel = require("../models/user.model");
const crypto = require("crypto");

let newSubscrition_id;
module.exports = {
  // Home/Login Page (GET)
  showLoginPage: function (req, res) {
    const token = req.cookies.token;
    if (token && token != "" && token != "undefined")
      return res.redirect("/profile");

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
  profilePage: async function (req, res) {
    const userPlan = await subscriptionModel
      .find({ userId: req.LoginUser._id, paymentSuccessful: true })
      .populate("planId");
    res.render("profile", { user: req.LoginUser, plans: userPlan });
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

  // Handle Update (POST)
  showSubscriptionPage: async function (req, res) {
    try {
      res.render("subscription", { plans: req.allPlans, user: req.LoginUser });
    } catch (err) {
      console.error("Error creating Razorpay plans:", err);
      res.status(500).send("Failed to load subscription page");
    }
  },

  subscriberInsertRecord: async function (req, res) {
    if (req.order.status === "created") {
      const newSubscription = await subscriptionModel.create({
        userId: req.LoginUser._id,
        planId: req.body.planId,
      });

      newSubscrition_id = newSubscription._id;
    }
  },

  // Delete User (GET or DELETE)
  deleteUser: async function (req, res) {
    const id = req.params.id;
    await userModel.findOneAndDelete({ _id: id });
    res.clearCookie("token");
    res.redirect("/");
  },

  // delete all the active Subscription
  deleteSubscription: async function (req, res) {
    const deletedData = await subscriptionModel.deleteMany({});
    res.send(deletedData);
  },

  // vwrify the payment
  verifyPayment: async function (req, res) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      console.log("Payment verified successfully");

      const updatedData = await subscriptionModel.findOneAndUpdate(
        { _id: newSubscrition_id },
        { paymentSuccessful: true },
        { new: true }
      );

      res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      console.log("Invalid signature, possible tampering");
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  },
  // Logout (GET)
  logoutPage: function (req, res) {
    res.clearCookie("token");
    res.redirect("/");
  },
};