const Joi = require("joi");

module.exports = {
  userId: {
    in: ["body"],
    errorMessage: '"userId" field is missing',
    exists: true,
  },
  experience_details: {
    in: ["body"],
    isArray: {
      errorMessage: '"experience_details" field should be an array',
    },
    custom: {
      options: (value, { req }) => {
        // Define the schema for individual experiences
        const experienceSchema = Joi.object({
          company_name: Joi.string().required(),
          position: Joi.string().required(),
          date_of_joining: Joi.date().required(),
          date_of_leaving: Joi.date().required(),
        });

        const { error } = Joi.array().items(experienceSchema).validate(value);
        if (error) {
          throw new Error(error.message);
        }

        return true;
      },
    },
  },
};
