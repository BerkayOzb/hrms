const Joi = require("joi");
const { default: mongoose } = require("mongoose");

module.exports = {
  userId: {
    in: ["body"],
    errorMessage: '"userId" field is missing',
    exists: true,
    // custom: {
    //   options: (value) => {
    //     // You can add any custom validation for userId here, if needed.
    //     return true;
    //   },
    // },
  },

  leavesInfo: {
    in: ["body"],
    errorMessage: '"leavesInfo" field is missing or is not an array',
    exists: true,
    isArray: {
      errorMessage: '"leavesInfo" field should be an array',
    },
    custom: {
      options: (value, { req }) => {
        const leaveSchema = Joi.object({
          leaveType: Joi.string().required(),
          allocated: Joi.number().required(),
          taken: Joi.number().required(),
        });

        const { error } = Joi.array().items(leaveSchema).validate(value);
        if (error) {
          throw new Error(error.message);
        }
        return true;
      },
    }
  
  },
}
