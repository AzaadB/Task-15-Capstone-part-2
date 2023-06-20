const mongoose = require("mongoose");
const chai = require("chai");
const expect = chai.expect;
const request = require("request");

//Describe the test
//This Test will only return all the users and comments status codes.
//Make sure to run the application before starting the test.
describe("Running fetch request to MongoDB", () => {
  it("Should return all users", (done) => {
    request.get("http://localhost:2500/users", (req, response) => {
      expect(response.statusCode).to.equal(200);
      mongoose.disconnect();
      done();
    });
  });
});
