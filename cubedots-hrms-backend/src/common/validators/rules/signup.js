const { isUniqueContact, isUniqueEmployeeCode } = require("../custome-validators/user-validator");

module.exports = {
  email: {
    in: ["body"],
    errorMessage: '"Email" field is missing',
    exists: true,
    isEmail: {
      errorMessage: "Invalid email format",
    },
  },

  password: {
    in: ["body"],
  },

  official_contact: {
    in: ["body"],
    custom: {
      options: isUniqueContact,
    },
  },

  employee_code: {
    in: ["body"],
    errorMessage: '"Employee code" field is missing',
    exists: true,
    // custom: {
    //   options: isUniqueEmployeeCode,
    //   errorMessage: 'Employee code already exists',
    // },
  },


  location: {
    in: ["body"],
    errorMessage: '"location" field is missing',
    exists: true,
  },
  date_of_birth: {
    in: ["body"],
    errorMessage: '"date_of_birth" field is missing',
    exists: true,
  },
  date_of_joining: {
    in: ["body"],
    errorMessage: '"date_of_joining" field is missing',
    exists: true,
  },
  designation: {
    in: ["body"],
    errorMessage: '"designation" field is missing',
    exists: true,
  },

  department: {
    in: ["body"],
    errorMessage: '"department" field is missing',
    exists: true,
  },
  "name.first_name": {
    in: ["body"],
    errorMessage: '"first_name" field is missing or invalid',
    isString: {
      errorMessage: 'Invalid value for "first_name"',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'The "first_name" field cannot be empty',
    },
  },
  "name.last_name": {
    in: ["body"],
    errorMessage: '"last_name" field is missing or invalid',
    isString: {
      errorMessage: 'Invalid value for "last_name"',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'The "last_name" field cannot be empty',
    },
  },
  roleId: {
    in: ["body"],
    errorMessage: '"roleId" field is missing or invalid',
    exists: true,
    // custom: {
    //   options: (value) => mongoose.Types.ObjectId.isValid(value),
    //   errorMessage: 'Invalid value for "roleId", it should be a valid ObjectId',
    // },
  },
  managerId: {
    in: ["body"],
    errorMessage: '"managerId" field is missing',
    exists: true,
  },
};
