var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/usersControllers");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);

router.patch(
  "/deactivate",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deactivate
);

module.exports = router;
