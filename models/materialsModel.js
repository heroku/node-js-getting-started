const mongoose = require("mongoose");
const User = require("./userModel");
const Course = require("./coursesModel");

const materialSchema = new mongoose.Schema(
  {
    lecture: {
      type: String,
      required: [true, "Lecture is required!"],
    },
    slides: {
      type: String,
      default: "default.pdf",
    },
    video: {
      type: String,
      default: "default.jpg",
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course", // Should match the model name exactly
      required: [true, "Material must belong to a course"],
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Should match the model name exactly
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Moved timestamps into the same object
  }
);

materialSchema.pre(/^find/, function (next) {
  this.populate({
    path: "instructor",
    select: "firstName lastName",
  }); // here to make the output contains the details of the instructor we should write populating

  next();
});

const Materials = mongoose.model("Materials", materialSchema);

module.exports = Materials;
