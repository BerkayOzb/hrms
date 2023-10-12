const signup = require("./signup");

module.exports = {
  email: signup.email,
  password: {
    in: ["body"],
    errorMessage: '"password" field is missing',
    exists: true,
  },
};
    