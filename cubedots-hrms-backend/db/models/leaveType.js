const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    defaultDays: { type: Number, default: 12 },
  },
  {
    timestamps: true,
  }
);

const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);

module.exports = LeaveType;
