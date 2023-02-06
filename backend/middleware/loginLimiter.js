//This component helps us controll the amount of login requests that are made//
const rateLimit = require("express-rate-limit");
//Defining rateLimit which comes from the express-rate-limit package that we installed(line 2)
const { logEvents } = require("./logger");
//creating a loginLimiter with a rateLimit(line 6)//
const loginLimiter = rateLimit({
  //everything within the loginLimiter (lines 6-26), are options for the rateLimit, which is being set inside an object(lines 8-25)//
  windowMs: 60 * 1000, 
  // 1 minute
  max: 5, 
  // Limit each IP to 5 login requests per `window` per minute
  message: {
    message:
      "Too many login attempts from this IP, please try again after a 60 second pause",
  },
  //The handler deals with what happens if the max rate-limit on (line 10) is achieved//
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
