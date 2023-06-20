const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
/*Brining in bcrypt(line 2) to decrypt the password, 
so that we can read and compare them to what the user is using to authenticate with*/
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//Login access is public//
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  //We are expecting a username and a password, when a user logs in which is the auth process(line 10)//
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
    /*If we do not recieve a username or password(line 12), then we will send a status of 400,
    which is a bad request with a message(line 13)*/
  }
  //Looking for a user in our mongoDB database in the users collection(line 18)
  const foundUser = await User.findOne({ username }).exec();
  /*if we don't find the user or the user isn't active or doesn't exist(line 21), 
  then we return a 401 status with a message saying Unauthorized (line 22)*/
  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  /*if the user does exist, then we will try to match the password that the user has inputed, 
 to the one that is stored in the database by using bcrypt.compare(line 27)*/
  const match = await bcrypt.compare(password, foundUser.password);
  //if the passwords don't match, then we return a 401 status with a message saying Unauthorized(line 28)
  if (!match) return res.status(401).json({ message: "Unauthorized" });
  //defining an accessToken varible and using jwt that was created(line 30X), when we imported the jsonwebtoken dependency on (line 5)
  const accessToken = jwt.sign(
    {
      /*creating the accessToken(line 30), which contains an object with Userinfo(line 34), 
    which has username and roles(lines 35-36) and all this information is stored inside the accessToken*/
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    //Passing in our environment ACCESS_TOKEN_SECRET variable(line 40)//
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
    //setting when the token will expireIn(line 41)
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
    /*creating the rerfreshToken(line 45), which contains an object with the username(line 46) 
    and all this information is stored inside the refreshToken, Passing in our environment REFRESH_TOKEN_SECRET variable(line 47), 
    setting when the token will expireIn(line 48)*/
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    //Now we have a response cookie we're naming it jwt and we are passing in the refreshToken(line 55)
    httpOnly: true,
    //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });
  // Send accessToken containing username and roles
  res.json({ accessToken });
});

/*we have a refresh method(line 69), because the jwt token has expired and we need to get a new token, 
and the only way to get a new token is to have the access be public*/
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  //We are expecting a cookie with the request(line 70)
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  //if we don't have cookie named jwt, thend we're goiong send a 401 Unauthorized(line 72)//
  const refreshToken = cookies.jwt;
  //but if we do have the jwt cookie, then we set the refresh token to it(line 74)//
  jwt.verify(
    /*calling the jwt.verify method to verify the refreshToken(line 76),
     then we pass in the refreshToken variable(line 79) and we also pass in our REFRESH_TOKEN_SECRET environment variable(line 80)*/
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    //In our asyncHandler(line 82) we have an async method which will catch any unexpected errors//
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      //If there is an error than we will send a 403 Forbidden message(line 83)//
      const foundUser = await User.findOne({
        /*Checking to see if we have a user(line 85), 
        and if we do have the user from the username that was decoded from the refreshToken(line 88), 
        then we are going to create a new access token(lines 94-101)*/
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
      //If we don't have a user, then we send the 401 Unauauthorized message(line 92)//
      const accessToken = jwt.sign(
        /*creating the accessToken(line 94), which contains an object with Userinfo(line 98), 
    which has username and roles(lines 99-100) and all this information is stored inside the accessToken*/
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        //Passing in our environment ACCESS_TOKEN_SECRET variable(line 104)//
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
        //setting when the token will expireIn(line 102)
      );

      res.json({ accessToken });
    })
  );
});

//logout and clears any cookies that exists//
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  //We are expecting a cookie with the request(line 70)
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
});

module.exports = {
  login,
  refresh,
  logout,
};
