const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    permission_id: {
      type: Number,
      unique: true,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, // This will add the createdAt and updatedAt fields
  }
);

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
