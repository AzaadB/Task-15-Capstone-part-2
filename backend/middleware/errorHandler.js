const { logEvents } = require("./logger");
//Importing our logEvents function from our logger file(line 1)

/*Creating the actual middleware (line 6), 
which has a err, request, response and the ability to move onto the next piece of middleware*/
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
    /*Inside the logEvents(line 7) we have a request method with a tab, a request url with tabs between all and then a request origin, 
  which is where the request originated from and it is all be written to the errorLog dot log*/
  );
  console.log(err.stack);
  /*The error.stack inside the console.log(line 13),
  will be a big detailed message about an error and tell us specifically of where the error is*/
  const status = res.statusCode ? res.statusCode : 500;
 /*Defining a status(line 18), and this is to see if the response already has a set status code 
  and it's a ternary so if there is a set, then we'll just return the set status code, 
  but if there is no status code then we return a status code of 500 which is a server error*/
  res.status(status);
//setting our status(line 20) to what was determined by the ternary (line 16)//
  res.json({ message: err.message, isError: true });
};

module.exports = errorHandler;
