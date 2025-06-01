const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {           // Plan name like "Basic", "Pro", "Elite"
    type: String,
    required: true,
    unique: true,
  },
  price: {          // Price in the smallest currency unit (e.g., paise for INR)
    type: Number,
    required: true,
  },
  interval: {       // Billing interval like "month", "year"
    type: String,
    enum: ['day', 'week', 'month', 'year'],
    required: true,
  },
  razorpayPlanId: { // Razorpay plan identifier
    type: String,
    required: true,
    unique: true,
  },
  features: [       // Optional: array of strings describing plan features
    {
      type: String,
    }
  ],
  createdAt: {      // When the plan was created
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Plan', planSchema);
