const mongoose = require('mongoose');
const Plan = require('./models/plan.model'); // Adjust the path if your model is in a different file
require('dotenv').config()

const plans = [
  {
    name: "Basic",
    price: 99,
    interval: "month",
    razorpayPlanId: "plan_TEST_1",
    features: ["Unlimited access", "Email support", "Standard SLAs"]
  },
  {
    name: "Pro",
    price: 249,
    interval: "month",
    razorpayPlanId: "plan_TEST_2",
    features: ["Unlimited access", "Priority email support", "Standard SLAs"]
  },
  {
    name: "Elite",
    price: 999,
    interval: "year",
    razorpayPlanId: "plan_TEST_3",
    features: ["Unlimited access", "Priority email support", "Priority SLAs"]
  }
];

async function insertPlans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB 849349" );

    // Insert plans (doesn't delete existing ones)
    await Plan.insertMany(plans);
    console.log("Plans inserted successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting plans:", error);
  }
}

insertPlans();
