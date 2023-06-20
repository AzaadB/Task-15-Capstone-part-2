const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  /*Making the roles data type(line 15) of the schema into an array with the default value for the roles being employee(line 14),
  So if there is no role assigned to a user when we create one they will be assigned the default value of employee(line 17)*/
  roles: [{
    type: String,
    default: "employee"
  }],
  /*So the active data type(line 21) is so, when a new user is created they will be automatically active,
  there is no need for the data to be sent to the API.*/
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("User", UserSchema);
