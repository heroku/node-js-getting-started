const Materials = require("../models/materialsModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.getMaterial = catchAsync(async (req, res, next) => {
  const material = await Materials.findById(req.params.id);
  // Course.findOne({ _id: req.params.id })

  if (!material) {
    return next(new AppError("No material found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      material,
    },
  });
});

exports.createMaterial = catchAsync(async (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.instructor) req.body.instructor = req.user.id;

  const newMaterial = await Materials.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newMaterial,
    },
  });
});

exports.updateMaterial = catchAsync(async (req, res, next) => {
  const material = await Materials.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!material) {
    return next(new AppError("No material found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      material,
    },
  });
});

exports.getAllMaterials = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.courseId) filter = { course: req.params.courseId };

  const materials = await Materials.find(filter);
  res.status(200).json({
    status: "success",
    results: materials.length,
    data: {
      materials,
    },
  });
});

exports.deleteMaterial = factory.deleteOne(Materials);
