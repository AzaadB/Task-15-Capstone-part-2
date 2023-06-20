const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//Get All Users//
const getAllUsers = asyncHandler(async (req, res) => {
  /*wrapping the function around the asyncHandler(line 7) which will keep us from using a try catch block, 
  but we will still catch the async errors*/
  const users = await User.find().select("-password").lean();
  /*attached to the .find method(line 10) is the .select method and inside it,
  we are saying PLEASE DO NOT return the password when the user data is returned,
  also we are chaining the lean method(line 10) otherwise mongoose will give us a document all the methods attached.
  lean will just instruct mongoose to give us the data in json format without all the methods attached*/
  if (!users?.length) {
    //So if there is no user, then we return a res.status(400) with a json message(line 17)
    //Checking first if the user exists before check the length property(line 15)//
    return res.status(400).json({ message: "user doesn't exist" });
  }
  //but if there is a user, then we send the user as json(line 20)//
  res.json(users);
});

//Create a new user//
const createUser = asyncHandler(async (req, res) => {
  /*wrapping the function around the asyncHandler(line 13) which will keep us from using a try catch block, 
      but we will still catch the async errors*/
  const { username, password, roles } = req.body;
  //destructuring the data from the request body(line 27)

  // Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
  /*.collation({ locale: 'en', strength: 2 })(line 34) and have lean().exec() after, 
  it checks for case insenitivity meaning, if we have users with the same username they will be considerd as a duplicate username,
  doesn't matter if they are lowercase or caps */
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
    //So if there is a duplicate username found, then we return a res.status(409) with a json message(line 37)
  }
  //Hashing the password we recieved(line 43)
  const HashedPassword = await bcrypt.hash(password, 10);
  // The second argumennt passed into the bcrypt.hash() method(line 43) is the salt rounds from bcrypt.//

  //defining our user object(line 47) before saving it//
  const userObj = { username, password: HashedPassword, roles };
  //creating and storing a new user(line 50)//
  const user = await User.create(userObj);

  if (user) {
    /*created */
    res.status(201).json({ message: `New user ${username} created` });
    //for the message we are using a template literal and passing in the username value(line 54)
  } else {
    res.status(400).json({ message: "Invalid user data recieved" });
    //In the else we are saying if the data wasn't saved, then the data that was recieved was not valid(line 56)//
  }
});

//Update a user//
const updateUser = asyncHandler(async (req, res) => {
  /*wrapping the function around the asyncHandler(line 19) which will keep us from using a try catch block, 
      but we will still catch the async errors*/
  const { id, username, roles, active, password } = req.body;
  //recieing more data such as an id, username, roles, active, password all from the req.body(line 64)//

  //Confirming Data(line 68)
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    /*So if the data that we have checked does not check out, 
      then we return a res.status(400) with a json message(line 71)*/
    return res.status(400).json({ message: "Fill all fields please!" });
  }
  const user = await User.findById(id).exec();

  if (!user) {
    //if there is no user we return an error code with a json message(line 77)//
    return res.status(400).json({ message: "User not found" });
  }
  //check for duplicate//
  const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
  //Allow updates to original user//
  
  /*.collation({ locale: 'en', strength: 2 })(line 89) and have lean().exec() after, 
  it checks for case insenitivity meaning, if we have users with the same username they will be considerd as a duplicate username,
  doesn't matter if they are lowercase or caps */

  if (duplicate && duplicate?._id.toString() !== id) {
    //So if no duplicate was found and instead we got the current user, then we return a status code with a json message(line 90)
    return res.status(409).json({ message: "duplicate username" });
  }
  //updating our user with some information that we have recieved(line 93)//
  user.username = username;
  user.roles = roles;
  user.active = active;
  //Since is a mongoose document if we had to set a property that does'nt exist in our userModel, then it would be rejected//

  /*The reason we didn't update a password is, 
    because we don't want a user to update a password everytime they updating something else such as a username or role*/
  if (password) {
    /*In this if statement we say if someone wants to update their password, 
      then we should hash the password again(line 103)*/
    user.password = await bcrypt.hash(password, 10);
    /*Firstly we pass in the password from the req.body, 
      then second argumennt passed into the bcrypt.hash() method(line 103) is the salt rounds from bcrypt.*/
  }
  const updatedUser = await user.save();
  /*Now we are saving the updated user(line 107), 
    but before it saved we haved to await for everything within the update function to happen*/
  res.json({ message: `${updatedUser.username} updated` });
  //for the message we are using a template literal and passing in the updatedUser variable and username value(line 110)
});
//Delete a user//
const deleteUser = asyncHandler(async (req, res) => {
  /*wrapping the function around the asyncHandler(line 24) which will keep us from using a try catch block, 
      but we will still catch the async errors*/
  const { id } = req.body;
  //Only destructuring the id from the req.body(line 117)
  if (!id) {
    /*So if there is no id, then we'll send an error message(line 121)*/
    return res.status(400).json({ message: "User id is required" });
  }
  //Defining our user(line 134)
  const user = await User.findById(id).exec();
  //Calling exec() at the end because we need the other functions(line 134)
  if (!user) {
    //So if there is no user, then we are sending another response(line 138)/
    return res.status(400).json({ message: "user not found" });
  }
  //Defining a result(line 141)//
  const result = await user.deleteOne();
  //In this result we will recieve the whole user object that has been removed(line 141)
  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  //Since the result has all the deleted's user information, we are creating a reply(line 143)
  res.json(reply);
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
