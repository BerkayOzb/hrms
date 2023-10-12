const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    role_id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  {
    timestamps: true, // This will add the createdAt and updatedAt fields
  }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
