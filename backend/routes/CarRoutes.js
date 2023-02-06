const express = require("express");
const router = express.Router();
const { getAllCars, createNewCar, updateCar, deleteCar,} = require("../controllers/carController");
//importing all the CRUD operation methods from the carController file in the the controllers folder(line 3)
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT)
//using the verifyJWT middleware to protect the car routes
router.get("/", getAllCars);
router.post("/", createNewCar);
router.patch("/", updateCar);
router.delete("/", deleteCar);

module.exports = router;
