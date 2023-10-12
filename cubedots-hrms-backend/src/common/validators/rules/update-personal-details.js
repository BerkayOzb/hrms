module.exports = {
  userId: {
    in: ["body"],
    errorMessage: '"userId" field is missing',
    exists: true,
  },

  personal_email: {
    in: ["body"],
    errorMessage: '"personal_email" field is missing',
    exists: true,
    isEmail: {
      errorMessage: "Invalid personal_email format",
    },
    // custom: {
    //   options: (value) => {
    //     return UserPersonalDetails.findOne({ personal_email: value }).then(user => {
    //       if (user) {
    //         return Promise.reject('E-mail already in use');
    //       }
    //     });
    //   },
    //   errorMessage: "personal_email already exists",
    // },

  },

  // blood_group: { 
  //   in: ["body"],
  //   errorMessage: '"blood_group" field is missing',
  //   exists: true,
  // },

  "contact.personal_contact": {
    in: ["body"],
    errorMessage: '"contact.personal_contact" field is missing or invalid',
    isString: {
      errorMessage: 'Invalid value for "contact.personal_contact"',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'The "contact.personal_contact" field cannot be empty',
    },
  },
  "contact.emergency_contact": {
    in: ["body"],
    errorMessage: '"contact.emergency_contact" field is missing or invalid',
    isString: {
      errorMessage: 'Invalid value for "contact.emergency_contact"',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'The "contact.emergency_contact" field cannot be empty',
    },
  },
  "address.present_address": {
    in: ["body"],
    errorMessage: '"address.present_address" field is missing or invalid',
    isString: {
      errorMessage: 'Invalid value for "address.present_address"',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'The "address.present_address" field cannot be empty',
    },
  },
  "address.permanent_address": {
    in: ["body"],
    errorMessage: '"address.permanent_address" field is missing or invalid',
    isString: {
      errorMessage: 'Invalid value for "address.permanent_address"',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'The "address.permanent_address" field cannot be empty',
    },
  },

  marital_status: {
    in: ["body"],
    errorMessage: '"marital_status" field is missing',
    // isIn: {
    //   options: ["unmarried", "married", "widowed", "divorced"],
    //   errorMessage: 'Invalid value for "marital_status"',
    // },
    exists: true,
  },
};
