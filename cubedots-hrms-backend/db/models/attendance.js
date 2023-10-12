const { string } = require("joi");
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    empCode: {
      type: String,
      required: true,
    },
    empName: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
    },
    inTime: {
      type: String,
    },
    outTime: {
      type: String,
    },
    duration: {
      type: String,
    },
    employeeRemark: {
      type: String,
    },
    managerRemark: {
      type: String,
    },
    tillDate: {
      type: String,
    },
    attendance: {
      type: String,
      enum: ["P", "A", "P2", "L", "H", "WO"],
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ empCode: 1, date: 1 }, { unique: true });
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
