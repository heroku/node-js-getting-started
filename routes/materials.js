const express = require("express");
const materialsController = require("../controllers/materialsController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true }); //to get access to params in courses router

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("instructor"),
    materialsController.createMaterial
  )
  .get(authController.protect, materialsController.getAllMaterials);

router
  .route("/:id", authController.protect)
  .get(materialsController.getMaterial)
  .patch(materialsController.updateMaterial)
  .delete(materialsController.deleteMaterial);

module.exports = router;
