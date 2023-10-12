const Joi = require("joi");

module.exports = {
  userId: {
    in: ["body"],
    errorMessage: '"userId" field is missing',
    exists: true,
  },
  qualification_details: {
    in: ["body"],
    isArray: {
      errorMessage: '"qualifications_details" field should be an array',
    },
    custom: {
      options: (value, { req }) => {
        const qualificationSchema = Joi.object({
          course_name: Joi.string().required(),
          specialization: Joi.string().required(),
          institute_name: Joi.string().required(),
          passing_year: Joi.date().required(),
        });

        const { error } = Joi.array()
          .items(qualificationSchema)
          .validate(value);
        if (error) {
          throw new Error(error.message);
        }

        return true;
      },
    },
  },
};
