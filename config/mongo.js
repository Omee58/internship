const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('\n-------------------------\nFailed to connect to MongoDB, \n Error is : ', err, '\n-------------------------');
  });

module.exports = mongoose;
