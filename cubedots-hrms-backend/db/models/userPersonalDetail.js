const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  relation: {
    type: String,
    required: true,
  },
});

const qualificationSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  institute_name: {
    type: String,
    required: true,
  },
  passing_year: {
    type: Date,
    required: true,
  },
});

const experienceSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  date_of_joining: {
    type: Date,
    required: true,
  },
  date_of_leaving: {
    type: Date,
    required: true,
  },
});

const File = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  mimetype: String
});


const personalDetailsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    profile_photo: {
      type: File,
    },

    contact: {
      personal_contact: {
        type: String,
        required: true,
      },
      emergency_contact: {
        type: String,
        required: true,
      },
    },

    personal_email: {
      type: String,
      match:
        /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/i,
      required: true,
      // unique: true,

    },

    address: {
      present_address: {
        type: String,
      },
      permanent_address: {
        type: String,
      },
    },

    family_details: {
      type: [familyMemberSchema],
      default: [],
    },

    blood_group: {
      type: String,
      // required: true
    },

    qualification_details: {
      type: [qualificationSchema],
      default: [],
    },

    experience_details: {
      type: [experienceSchema],
      default: [],
    },

    marital_status: {
      type: String,
      enum: ["unmarried", "married", "divorced", "widowed"],
      required: true,
    },
  },
  { timestamps: true }
);

const UserPersonalDetails = mongoose.model(
  "PersonalDetails",
  personalDetailsSchema
);


module.exports = {

  UserPersonalDetails,
  File,
  familyMemberSchema,
  qualificationSchema,
  experienceSchema,
  
};
