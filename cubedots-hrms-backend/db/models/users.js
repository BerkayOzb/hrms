const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
    },

    date_of_birth: {
      type: Date,
      required: true,
    },

    date_of_joining: {
      type: Date,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    employee_code: {
      type: String,
      require: true,
      unique: true,
    },

    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-]+(\.[\w-]+)*@cubedots\.com$/i,
    },

    password: {
      type: String,
      required: true,
    },

    official_contact: {
      type: String,
      // unique: true,
      sparse: true,
      default: "NA",
    },

    location: {
      type: String,
      required: true,
    },

    esic_number: {
      type: String,
      default: "NA",
    },

    uan_number: {
      type: String,
      default: "NA",
    },

    personal_details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalDetails",
    },

    gross_salary: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
