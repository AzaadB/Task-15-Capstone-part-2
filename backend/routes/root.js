const express = require("express");
//requiring express(line 1)//
const router = express.Router();
//defining a router (line 3)//
const path = require("path");
//importing path from nodejs(line 5)//
router.get("^/$|/index(.html)?", (req, res) => {
  /*In the router.get(line 7), we are using regex with a caret(line 7), which is used at the start of a string only, 
and then we use a slash and a dolar sign which means if the requested route is only a slash, then it should mathtch for the root
Then we put in a pipe which for regx is an or, then we put in slash index if then the requested more then just a slash, 
Then after the index we say dot html, which means that the html is optional*/
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  /*Then for our funtion we have a request and response and inside our function(line 7), 
then we send our index.html file back(line 8), but we have to route to the folder it is in first*/
});

module.exports = router;
