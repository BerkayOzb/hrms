const mongoose = require("mongoose");

const leaveInfoSchema = new mongoose.Schema(
  {
    leaveType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "LeaveType",
    },
    allocated: {
      type: Number,
      default: 12,
    },
    taken: { type: Number, default: 0 },
  },
  {
    _id: false,
  }
);

const applied_leaves = new mongoose.Schema({
  leave_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "LeaveData",
  },
});

const leaveBalance = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    leavesInfo: { type: [leaveInfoSchema] },
  },
  {
    timestamps: true,
  }
);

const LeaveBalance = mongoose.model("LeaveBalance", leaveBalance);

module.exports = LeaveBalance;
