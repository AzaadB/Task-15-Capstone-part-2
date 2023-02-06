const { format } = require("date-fns");
//destructuring format that we get from the date-fns dependency(line 1)
const { v4: uuid } = require("uuid");
//destructuring v4: uuid from the uuid dependency(line 3)//
const fs = require("fs");
//The fs module from node which is a built-in middleware(line 5)//
const fsPromises = require("fs").promises;
//Getting  fsPromises from node(line 7)
const path = require("path");
//importing path from nodejs(line 9)
const logEvents = async (message, logFileName) => {
  //creating a helper function called logEvents(line 11)//
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  /*creating a dateTime variable(line 13) and inside it using the format function(line 13),
  and inside the function we have a newDate object and it is being formated according to the docs of the date-fns package(line 13)*/
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  /*We have a logItem variable which, inside it we pass in our dateTime variable(line 16), the slash t's represent tabs(line 16), 
  which will make importing logs to excel or somthing similar easier to do, we are also calling in uuid(line 16),
  which will create a specific id for each logItem, then lastly we pass in the message and the slash n represents a new line*/
  try {
    /*Inside this trycatch block(lines 20-30), we have an if statement(line 23) in which 
    we check if the directory exists, but if it doesn't exsist and we try to save it we'll get an error*/
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      //So if the direcetory doesn't exist we'll have to create it and that is what we do on(line 25), in which we have an await//
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
    /*On(line 27) and inside it, we are appending the file to the logs directory if it exists or if it was created, 
    we also have to say the fileName and we have to bring in our logItem variable*/
  } catch (err) {
    console.log(err);
  }
};
//Creating the actual middleware (line 38), which has a request, response and the ability to move onto the next piece of middleware//
const logger = (req, res, next) => {
  //Inside this middleware we are passing in the template literal of logEvents(line 40), that was created above on(line 11)
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  /*Inside the logEvents we have a request method with a tab, a request url with tabs between all and then a request origin, 
  which is where the request originated from and it is all be written to the requestLog dot log*/
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };
