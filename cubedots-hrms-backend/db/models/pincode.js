const mongoose = require("mongoose");

const pincodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    pin: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "expired"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "10m", 
    },
  },
  { timestamps: true }
);

const Pincode = mongoose.model("Pincode", pincodeSchema);

module.exports = Pincode;
