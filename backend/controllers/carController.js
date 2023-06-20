const Cars = require("../models/CarsModel");
const asyncHandler = require("express-async-handler");

//Get All Cars
const getAllCars = asyncHandler(async (req, res) => {
  /*wrapping the function around the asyncHandler(line 7) which will keep us from using a try catch block, 
    but we will still catch the async errors*/
  const cars = await Cars.find().lean();

  /*attached to the .find method(line 10), also we are chaining the lean method(line 10),
    otherwise mongoose will give us a document all the methods attached.
    lean will just instruct mongoose to give us the data in json format without all the methods attached*/
  if (!cars?.length) {
    return res.status(400).json({ message: "No cars found" });
    //Checking first if the car exists before check the length property(line 15)//
    //So if there is no car, then we return a res.status(400) with a json message(line 17)
  }
  res.json(cars);
})

//Create a new car//
const createNewCar = asyncHandler(async (req, res) => {
  const { make, model, registration} = req.body;

  // Confirm data
  if (!make || !model || !registration) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate make
  const duplicate = await Cars.findOne({ make }).collation({ locale: 'en', strength: 2 }).lean().exec();
  /*.collation({ locale: 'en', strength: 2 })(line 32) and have lean().exec() after, 
  it checks for case insenitivity meaning, if we have car make with the same make they will be considerd as a duplicate make,
  doesn't matter if they are lowercase or caps*/

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate car make" });
  }
  //defining our user object(line 37) before saving it//
  const carObj = { make, model, registration};
  //creating and storing a new car(line 39)//
  const car = await Cars.create(carObj);

  if (car) {
    // Created
    return res.status(201).json({ message: "New car created" });
  } else {
    return res.status(400).json({ message: "Invalid car data received" });
  }
});

//Update a car//
const updateCar = asyncHandler(async (req, res) => {
  /*wrapping the function around the asyncHandler(line 19) which will keep us from using a try catch block, 
      but we will still catch the async errors*/
  const { id, make, model, registration} = req.body;
  //recieing more data such as an id, user, make, model, registration, owner, completed all from the req.body(line 64)//

  //Confirming Data(line 68)
  if (!id || !make || !model || !registration) {
    /*So if the data that we have checked does not check out, 
      then we return a res.status(400) with a json message(line 71)*/
    return res.status(400).json({ message: "Fill all fields please!" });
  }
  const car = await Cars.findById(id);

  if (!car) {
    //if there is no car we return an error code with a json message(line 77)//
    return res.status(400).json({ message: "Car not found" });
  }
  //check for duplicate//
  const duplicate = await Cars.findOne({ make }).collation({ locale: 'en', strength: 2 }).lean().exec();
  /*.collation({ locale: 'en', strength: 2 })(line 32) and have lean().exec() after, 
  it checks for case insenitivity meaning, if we have car make with the same make they will be considerd as a duplicate make,
  doesn't matter if they are lowercase or caps*/
  if (duplicate && duplicate?._id.toString() !== id) {
    //So if no duplicate was found and instead we got the current owner, then we return a status code with a json message(line 90)
    return res.status(409).json({ message: "duplicate make" });
  }
  //updating our car with some information that we have recieved(line 93)//
  car.make = make;
  car.model = model;
  car.registration = registration;
  //Since is a mongoose document if we had to set a property that does'nt exist in our carModel, then it would be rejected//
  const updatedCar = await car.save();
  /*Now we are saving the updated car(line 107), 
    but before it saved we haved to await for everything within the update function to happen*/
  res.json({ message: `${updatedCar.make} updated` });
  //for the message we are using a template literal and passing in the updatedCar variable and owner value(line 110)
});

//Delete a user//
const deleteCar = asyncHandler(async (req, res) => {
  /*wrapping the function around the asyncHandler(line 24) which will keep us from using a try catch block, 
      but we will still catch the async errors*/
  const { id } = req.body;
  //Only destructuring the id from the req.body(line 117)
  if (!id) {
    /*So if there is no id, then we'll send an error message(line 121)*/
    return res.status(400).json({ message: "Car id is required" });
  }

  // Confirm note exists to delete
  const car = await Cars.findById(id).exec();
  //Calling exec() at the end because we need the other functions(line 134)
  if (!car) {
    //So if there is no car, then we are sending another response(line 138)/
    return res.status(400).json({ message: "car not found" });
  }
  //Defining a result(line 141)//
  const result = await car.deleteOne();
  //In this result we will recieve the whole user object that has been removed(line 120)
  const reply = `Car ${result.make} with ID ${result._id} deleted`;
  //Since the result has all the deleted's cars information, we are creating a reply(line 122)
  res.json(reply);
});

module.exports = {
  getAllCars,
  createNewCar,
  updateCar,
  deleteCar,
};
