//This component is for verifying jwt//
const jwt = require("jsonwebtoken");
//importing jwt(line 2)//
const verifyJWT = (req, res, next) => {
  //defining verifyJWT(line 5) and due to it being middleware it recieves a request, response and the next method//
  const authHeader = req.headers.authorization || req.headers.Authorization;
  /*defining authHeader because we are going to be looking at header of the request 
    and making sure that there is an auth header either with a lowercase a or capital A(line 7)*/
  if (!authHeader?.startsWith("Bearer ")) {
    /*Now what we have to have as part of the authorization value is the word Bearer(line 10),
    with an uppercase B and what follows after should be a space and after the space should be the token, 
    So the way we check that is we check the authHeader that was defined on(line 7) 
    and that it starts with the string Bearer and a space*/
    return res.status(401).json({ message: "Unauthorized" });
    //if it does'nt, then we respond with a 401 unauthorized message(line 15)
  }
  const token = authHeader.split(" ")[1];
  /*Defining our token and we get it by splitting the authHeader string(line 18), 
  we don't want the word Bearer or the space, so we split on the space and take the second value*/
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    /*Now that we have the token we pass it into the jwt.verify method 
    and we verify it with our ACCESS_TOKEN_SECRET environment variable(line 21)*/
    if (err) return res.status(403).json({ message: "Forbidden" });
    /*If we have an error, then we'll send a 403 forbidden message(line 24), otherwise if there is no error, 
    then we should have decoded values, then we'll set the req.user to the decoded.UserInfo.username(line 28)
    and the req.roles to decoded.UserInfo.roles(line 29)*/
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
