const User = require("./users");
const Designation = require("./designation");
const Role = require("./role");
const Department = require("./department");
const Pincode = require("./pincode");
const Permission = require("./permission");
const LeaveRequest = require("./leavesRequest");
const LeaveBalance = require("./leaveBalance");
const LeaveType = require("./leaveType");
const Attendance = require("./attendance");

const {UserPersonalDetails} = require("./userPersonalDetail");
// const familyMemberSchema = require("./userPersonalDetail");
// const qualificationSchema = require("./userPersonalDetail");
// const experienceSchema = require("./userPersonalDetail");


module.exports = {
  User,
  Designation,
  Role,
  Department,
  Pincode,
  Permission,
  LeaveRequest,
  LeaveBalance,
  LeaveType,
  UserPersonalDetails,
  Attendance
//   FamilyDetails,
//   QualificationDetails,
//   ExperienceDetails,
};
