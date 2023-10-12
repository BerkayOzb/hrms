const { Router } = require("express");

const { isAuthenticate } = require("../common/helpers/auth");
const {
  login,
  logout,
  verifyUser,
  changePassword,
  sendPinCode,
  addDepartment,
  addRole,
  addDesignation,
  addUser,
  getAllUsers,
  verifyPincode,
  resetPassword,
  updateUser,
  applyLeave,
  searchUser,
  getUser,
  allocateLeaves,
  getLeaves,
  getLeaveBalance,
  changeLeaveSatus,
  CancelLeaveRequest,
  getLeaveBalanceOfUsers,
  getLeaveRequestOfUsers,
  getUpcomingBirthdays,
  getUpcomingAnniversy,
  getOrganizationData,
  getAttendance,
  getAllAttendance,
  getLeaveByDate,
  getUserLeaveByDate,
  editLeave,
} = require("../controllers");

const {
  validateLogin,
  validateChangePassword,
  validateSignup,
  validateApplyleave,
  validateAllocateLeaves,
} = require("../common/validators");

const routes = Router();
// routes.post('/resend', reSendCode)
routes.post("/login", validateLogin, login);
routes.post("/logout", isAuthenticate, logout);
routes.get("/verify-user", isAuthenticate, verifyUser);
routes.post(
  "/change-password",
  validateChangePassword,
  isAuthenticate,
  changePassword
);

routes.post("/add-designation", isAuthenticate, addDesignation);
routes.post("/add-role", isAuthenticate, addRole);
routes.post("/add-department", isAuthenticate, addDepartment);
routes.post("/add-user", validateSignup, isAuthenticate, addUser);
routes.get("/get-users", isAuthenticate, getAllUsers);
routes.post("/send-pin", sendPinCode);
routes.post("/verify-pin", verifyPincode);
routes.post("/reset-password", resetPassword);
routes.post("/update-user", isAuthenticate, updateUser);
routes.get("/search-user/:searchTerm", searchUser);
routes.get("/get-user-details/:userId", isAuthenticate, getUser);

routes.put(
  "/allocate-leaves",
  isAuthenticate,
  validateAllocateLeaves,
  allocateLeaves
);

routes.post("/apply-leave", isAuthenticate, validateApplyleave, applyLeave);
routes.post("/update-leave", isAuthenticate, validateApplyleave, editLeave);

routes.get("/get-leaves", isAuthenticate, getLeaves);
routes.get("/get-leave-balance", isAuthenticate, getLeaveBalance);
routes.post("/update-leave-status", isAuthenticate, changeLeaveSatus);
routes.delete(
  "/cancel-leave-request/:leaveId",
  isAuthenticate,
  CancelLeaveRequest
);
routes.get(
  "/get-all-users-leave-balance",
  isAuthenticate,
  getLeaveBalanceOfUsers
);
routes.get(
  "/get-all-users-leave-request",
  isAuthenticate,
  getLeaveRequestOfUsers
);
routes.get("/get-upcoming-birthdays", isAuthenticate, getUpcomingBirthdays);
routes.get("/get-upcoming-anniversary", isAuthenticate, getUpcomingAnniversy);
routes.get("/get-organization-data", isAuthenticate, getOrganizationData);
routes.get("/get-attendance", isAuthenticate, getAttendance);
routes.get("/get-all-attendance", isAuthenticate, getAllAttendance);
routes.get("/get-leave-by-date", isAuthenticate, getLeaveByDate);
routes.get("/get-user-leave-by-date", isAuthenticate, getUserLeaveByDate);



module.exports = routes;
