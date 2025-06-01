const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  paymentSuccessful : {
    type : Boolean,
    default : false
  }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
