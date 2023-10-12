const Joi = require("joi");

module.exports = {
  family_details: {
    in: ["body"],
    isArray: {
      errorMessage: '"family_details" field should be an array',
    },
    custom: {
      options: (value, { req }) => {
        const familyMemberSchema = Joi.object({
          name: Joi.string().required(),
          dob: Joi.date(),
          relation: Joi.string().required(),
        });

        const { error } = Joi.array().items(familyMemberSchema).validate(value);
        if (error) {
          throw new Error(error.message);
        }
        return true;
      },
    },
  },
};
