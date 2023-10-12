const { boolean } = require("joi");
const mongoose = require("mongoose");

const File = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  mimetype: String,
});

const noticeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

// const policySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   file: {
//     type: File,
//     required: true,
//   },
// });

const organizationSchema = new mongoose.Schema(
  {
    singletonGuard: {
      type: String,
      default: "single_instance",
      unique: true,
    },
    thought: {
      type: File,
    },
    notice: [noticeSchema],
    poshPolicy: {
      type: File,
    },
    policies: [
      {
        name: {
          type: String,
          required: true,
        },
        file: {
          type: File,
          required: true,
        },
      },
    ],
    holidayCalendar: {
      type: File,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
