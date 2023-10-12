const { body, validationResult } = require("express-validator");
const { User } = require("../../../../db/models");
const { isEmpty } = require("lodash");

const isUniqueContact = async (value) => {
  try {
    if (isEmpty(value) || value == 'NA') {
      return Promise.resolve();
    }
    const user = await User.findOne({ official_contact: value });
    if (user) {
      return Promise.reject("Contact already exists");
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject("Error checking contact uniqueness");
  }
};

async function isUniqueEmployeeCode(value) {
  const user = await User.findOne({ employee_code: value });
  if(isEmpty(user)){
    return Promise.resolve()
  }else{
    return Promise.reject('employee code is already available')
  }  // Returns true if no user with this code exists
}

module.exports = { isUniqueContact, isUniqueEmployeeCode };
