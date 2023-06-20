const mongoose = require("mongoose");
//requiring mongoose(line 1)//

//defining an async function called connectDB(line 5)
const connectDB = async () => {
  //inside this function we have a trycatch block(lines 7-11)//
  try {
    //inside the try we await mongoose.connect and pass in the env variable(line 9)
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
