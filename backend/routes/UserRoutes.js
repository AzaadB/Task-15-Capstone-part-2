const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
//importing the verifyJWT middleware(line 4)//
router.use(verifyJWT);
//using the verifyJWT middleware to protect the user routes
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
