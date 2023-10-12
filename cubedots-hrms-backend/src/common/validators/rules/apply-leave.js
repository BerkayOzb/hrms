const { isUniqueContact } = require("../custome-validators/user-validator");

module.exports = {
  leaveType: {
    in: ["body"],
    errorMessage: '"leaveType" field is missing',
    exists: true,
  },
  startDate: {
    in: ["body"],
    errorMessage: '"startDate" field is missing',
    exists: true,
    custom: {
      options: (value, { req }) => {
        const startDate = new Date(value);
        const endDate = new Date(req.body.end_date);

        if (endDate < startDate) {
          throw new Error(
            '"end_date" should be equal to or greater than "start_date"'
          );
        }

        return true;
      },
    },
  },
  endDate: {
    in: ["body"],
    errorMessage: '"endDate" field is missing',
    exists: true,
  },
  reason: {
    in: ["body"],
    errorMessage: '"reason" field is missing',
    exists: true,
  },
  leaveDuration: {
    in: ["body"],
    errorMessage: "leaveDuration is Required",
    exists: true,
    custom: {
      options: (value) => {
        if (value !== "halfDay" && value !== "fullDay") {
          throw new Error('leaveDuration must be "halfDay" or "fullDay"');
        }
        return true;
      },
    },
  },
};
