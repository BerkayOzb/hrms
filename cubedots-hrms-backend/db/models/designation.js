const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // This will add the createdAt and updatedAt fields
  }
);

const Designation = mongoose.model("Designation", designationSchema);

module.exports = Designation;
