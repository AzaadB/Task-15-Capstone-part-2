const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter")
//Including our loginLimiter in our authRoute component(line 4)
router.route("/")
.post(loginLimiter, authController.login)
//calling the loginLimiter(line 7)
router.route("/refresh")
.get(authController.refresh)

router.route("/logout")
.post(authController.logout)

module.exports = router