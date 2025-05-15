const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('\n-------------------------\nFailed to connect to MongoDB, Error is :\n-------------------------\n Error is : ', err);
  });

module.exports = mongoose;
