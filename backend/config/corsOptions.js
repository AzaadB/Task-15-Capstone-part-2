const allowedOrigins = require("./allowedOrigins");
//importing our allowedOrigins file(line 1)
const corsOptions = {
  /*Setting our corsOptions variable(line 3) as an object, and inside this object we have the origin method(line 6), 
  and it recieves an origin and a callback function*/
  origin: (origin, callback) => {
    /*Inside of the function(line 6), we are checking the indexOf the allowedOrigins array(line 11), then we have the origin, 
    which if it's not equal to -1 which limits it to only the urls that are in the array of our allowedOrigins file,
    would have access to our rest api, in order to prevent other software such as postman and desktop apps to be screened out,
    we say || !origin(line 11), which will now allow postman and other apps to access our rest api*/
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      /*Now if it is successfull, then we have a callback(line 15) and pass in an error object which will be null and 
        then we pass in the origin boolean which will either be true or false, 
        but in this case it is successful so it is set to true(line 15)*/
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
    //Now if it fails, then we have our error(line 16)//
  },
  /*Inside of cors we have other options such as credentials(line 23), which is set to true and
  which sets the access control allow credentials headers and if it is set to true it sets the header for you*/ 
  credentials: true,
  //And then we have optionsSuccessStatus which is 200(line 25)//
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
