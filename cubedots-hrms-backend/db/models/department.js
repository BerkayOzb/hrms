const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
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

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
