require("dotenv").config();
const express = require("express");
//requiring express(line 2)//
const app = express();
const path = require("path");
//Importing path from nodejs(line 5)//
const { logger, logEvents } = require("./middleware/logger");
//Importing the logger and logEvents function from the middleware folder and the logger file(line 7)//
const errorHandler = require("./middleware/errorHandler");
//Importing the errorHandler function from the middleware folder and the errorHandler file(line 9)//
const cookieParser = require("cookie-parser");
//Importing cookie-parser middleware(line 11)//
const cors = require("cors");
//Importing cors middlware(line 13)//
const corsOptions = require("./config/corsOptions");
//Importing the corsOptions function from the config folder and the corsOptions file(line 15)
const connectDB = require("./config/dbConn");
//Importing the connectDB function from the config folder and the dbConn file(line 17)//
const mongoose = require("mongoose");
//Importing mongoose(line 19)
const PORT = process.env.PORT || 4000;

connectDB();

app.use(logger);

app.use(cors(corsOptions));
//passing in the corOptions to cors(line 21)//
app.use(express.json());

app.use(cookieParser());
//calling the cookie-parser middleware that was imported on(line 11)//

app.use("/", express.static(path.join(__dirname, "/public")));
/*inside this app.use we are listening for the root route, and the we say express.static and then use path.join, 
which is a method of path and then it's followed with underscores and dirname,
which tells node.js to look inside the current folder we are in after, 
that we have a comma and telling node.js to look inside the public folder(line 28)*/

//So on(line 28) we are telling express where static files can be found such as a css file.//
app.use("/", require("./routes/root"));
//In the app.use on (line 35), we are requiring to look in a routes folder and a root file//
app.use("/cars", require("./routes/CarRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/UserRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
/*In this app.all(line 17), we use an astrix, which means everything that represents app.all, 
  be put through it, intead of it being routed together with the other routes above, 
  then inside our function(line 19), which has a request and respone has a response status of 404 which is an error code 
  in the if the requst has an html accepts header, then we will base our respone on it,*/

/*Inside the if statement(line 19), we are sending as a response our 404 html file back(line 12), 
  but we have to route to the folder it is in first(line 12)*/

/*after the if statement(line 21), we put an else if which has json and the it wasn't routed properly, response on line(22), 
  will be outputed*/

/*And lastly on (line 23), we have an else statement, which will be sent, even if the html and json never matched in the accepts header, 
  we will send the message on(line 22) again, but as text(line 24)*/

app.use(errorHandler);

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
