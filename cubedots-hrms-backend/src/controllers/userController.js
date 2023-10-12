const { isEmpty } = require("lodash");
const { parse, format } = require("date-fns");
const {
  User,
  Pincode,
  Department,
  Role,
  Designation,
  LeaveBalance,
  LeaveRequest,
  Attendance,
  LeaveType,
} = require("../../db/models");
const otpGenerator = require("otp-generator");
const {
  genJWTToken,
  removeToken,
  isAuthorized,
  sendGeneratedPassword,
} = require("../common/helpers/auth");

const logger = require("../common/helpers/logger");
const {
  STATUS_CODE,
  HTTP_STATUS_CODE,
} = require("../common/helpers/response-code");
const { Response, systemError } = require("../common/response-formatter");
const generateRandomPassword = require("../common/helpers/generate-password");

const sendEmail = require("../common/helpers/email");
const { decrypt, encrypt } = require("../common/helpers/crypto");
const {
  SIGNUP,
  LOGIN,
  LOGOUT,
  VERIFY_STATUS,
  TYPE_LOG,
  USER,
  AUTHENTICATION,
  ADMIN,
  VERIFY_MESSAGE,
  PERMISSION,
  LEAVE,
  EMPLOYEE_SEARCH_SUCCESS,
  GET_ALL_USERS_SUCCESS,
  GET_USER,
  USER_PROFILE_UPDATE_SUCCESS,
  ALLOCATE_LEAVE_SUCCESS,
  LEAVES_NOT_ALLOCATED,
  NOT_ENOUGH_LEAVE_BALANCE,
  LEAVE_FETCH_SUCCESS,
  LEAVE_BALANCE_FETCH_SUCCESS,
  LEAVE_APPROVED_LEAVE,
  LEAVE_REJECT_SUCCESS,
  LEAVE_CANCEL_SUCCESS,
  BIRTHDAY_FETCH_SUCCESS,
  ORGANIZATION_DATA_FETCH_SUCCESS,
  AttendanceGetSuccess,
  EMP_CODE_EXISTED,
  EMAIL_EXIST,
  LEAVES_NOT_FOUND,
} = require("../common/helpers/constant");
const { profile } = require("console");
const Organization = require("../../db/models/organization");

const USER_TOKEN_EXPIRED = 60 * 60; // eixpres in seconds

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  let response = Response(STATUS_CODE.SUCCESS, LOGIN.SUCCESS, "");
  try {
    const existedUser = await User.findOne({ email: `${email}` });
    if (isEmpty(existedUser)) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND);
      response.statusCode = STATUS_CODE.NOT_FOUND;
      response.message = LOGIN.INVALID_EMAIL;
    } else if (password !== decrypt(existedUser.password)) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED);
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = LOGIN.WRONG_PASS_EMAIL;
    } else {
      const temp = {
        email: existedUser.email,
        userid: existedUser._id,
        role: existedUser.role,
        empCode: existedUser.employee_code,
      };
      const token = await genJWTToken(temp, USER_TOKEN_EXPIRED);
      let userInfo = {
        userId: existedUser._id,
        userEmail: existedUser.email,
        userName: existedUser.name,
        role: existedUser.role,
        empCode: existedUser.employee_code,
      };

      response.data = {
        user: userInfo,
        token: token,
      };
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "User cannot login: ", err.stack);
    response = systemError(LOGIN.EXCEPTION);
  }
  res.send(response);
};

const logout = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, LOGOUT.SUCCESS, "");
  const token = req.headers.authorization.split(" ")[1];
  try {
    await removeToken(token);
  } catch (err) {
    logger.error(TYPE_LOG.USER, "User cannot logout: ", err.stack);
    response = systemError(LOGOUT.EXCEPTION);
  }
  res.send(response);
};

const verifyUser = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, VERIFY_STATUS.VERIFIED, "");
  try {
    const verifyUser = await User.findOne({
      email: req.userData.email,
    }).populate("role");
    console.log(verifyUser.name)
    if (isEmpty(verifyUser)) {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = VERIFY_STATUS.UNVERIFIED;
    } else {
      response.statusCode = STATUS_CODE.SUCCESS;
      response.message = VERIFY_STATUS.VERIFIED;
    }
    const userData = {
      userEmail: req.userData.email,
      role: verifyUser.role.name,
      name: verifyUser.name,
      userId: req.userData.userid,
      empCode: req.userData.empCode,
    };
    response.data = {
      userData: userData,
    };
  } catch (err) {
    logger.error(TYPE_LOG.USER, "user not verified: ", err.stack);
    response = systemError(LOGIN.EXCEPTION);
  }
  res.send(response);
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  let response = Response(
    STATUS_CODE.SUCCESS,
    LOGIN.PASSWORD_CHANGE_SUCCESS,
    ""
  );
  try {
    const existedUser = await User.findById({
      _id: req.userData.userid,
    });
    if (isEmpty(existedUser)) {
      res.status(HTTP_STATUS_CODE.NOT_FOUND);
      response.statusCode = STATUS_CODE.NOT_FOUND;
      response.message = LOGIN.INVALID_EMAIL;
    } else {
      if (decrypt(existedUser.password) !== currentPassword) {
        response.statusCode = STATUS_CODE.UNAUTHORIZATION;
        response.message = LOGIN.PASSWORD_MISMATCH;
        res.status(HTTP_STATUS_CODE.UNAUTHORIZED);
      } else {
        const temp = await User.findByIdAndUpdate(
          { _id: req.userData.userid },
          { $set: { password: encrypt(newPassword) } }
        );
      }
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "password changes failed ", err.stack);
    response = systemError(LOGIN.EXCEPTION);
  }
  res.send(response);
};

const sendPinCode = async (req, res) => {
  let isSendEmail = false;
  const generatedPinCode = otpGenerator.generate(6, { specialChars: false });
  let response = Response(STATUS_CODE.SUCCESS, SIGNUP.RESEND_CODE, "");
  const { email } = req.body;
  try {
    const existedUser = await User.findOne({
      email: email,
    });
    if (isEmpty(existedUser)) {
      response.statusCode = STATUS_CODE.NOT_FOUND;
      response.message = LOGIN.INVALID_EMAIL;
    } else {
      const pinCodeEntry = {
        user: existedUser._id,
        pin: encrypt(generatedPinCode),
      };
      await Pincode.findOneAndDelete({ user: existedUser._id });
      const temp = await Pincode.create(pinCodeEntry);
      isSendEmail = true;
      response.data = {
        userId: existedUser._id,
      };
    }
    if (isSendEmail) {
      const emailParams = {
        email: email,
        // name: existedUser.name.first_name,
        pincode: generatedPinCode,
      };
      await sendEmail(
        email.toLocaleLowerCase(),
        emailParams,
        "Reset Pasword",
        "Reset Pasword",
        `Hi ${email}\n Here is the pincode to reset your password ${generatedPinCode}`
      );
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Pincode genration failed", err.stack);
    response = systemError(LOGIN.EXCEPTION);
    isSendEmail = false;
  }

  res.send(response);
};

const verifyPincode = async (req, res) => {
  const { userId, pincode } = req.body;
  let response = Response(STATUS_CODE.SUCCESS, VERIFY_MESSAGE.SUCCESS, "");
  try {
    const existedUser = await User.findById({
      _id: userId,
    });
    if (isEmpty(existedUser)) {
      res.statius(HTTP_STATUS_CODE.NOT_FOUND);
      response.statusCode = STATUS_CODE.NOT_FOUND;
      response.message = LOGIN.INVALID_EMAIL;
    } else {
      const pinRecord = await Pincode.findOne({ user: existedUser._id });
      if (isEmpty(pinRecord)) {
        response.statusCode = STATUS_CODE.UNVERIFIED_EMAIL;
        response.message = VERIFY_MESSAGE.EXPIRED_PASSCODE;
      } else {
        if (decrypt(pinRecord.pin) !== pincode) {
          response.statusCode = STATUS_CODE.UNVERIFIED_EMAIL;
          response.message = VERIFY_MESSAGE.INVALID_PASSCODE;
        } else {
          await Pincode.findOneAndUpdate(
            { user: existedUser._id },
            { $set: { status: "verified" } }
          );
          response.data = {
            email: existedUser.email,
            userId: existedUser._id,
          };
        }
      }
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Pincode verification failed", err.stack);
    response = systemError(VERIFY_MESSAGE.EXCEPTION);
  }
  res.send(response);
};

const resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  let response = Response(STATUS_CODE.SUCCESS, LOGIN.RESET_PASS_SUCCESS, "");
  try {
    const existedUser = await User.findOne({
      _id: userId,
    });
    if (isEmpty(existedUser)) {
      response.statusCode = STATUS_CODE.NOT_FOUND;
      response.message = LOGIN.INVALID_EMAIL;
    } else {
      const pinRecord = await Pincode.findOne({ user: userId });
      if (isEmpty(pinRecord)) {
        response.statusCode = STATUS_CODE.UNVERIFIED_EMAIL;
        response.message = VERIFY_MESSAGE.EXPIRED_PASSCODE;
      } else {
        if (pinRecord.status == "verified") {
          await User.findOneAndUpdate(
            { _id: userId },
            { $set: { password: encrypt(newPassword) } }
          );
          // await sendGeneratedPassword(
          //   existedUser.email,
          //   newPassword,
          //   existedUser.name
          // );
          await Pincode.findOneAndDelete({ user: userId });
        } else {
          response.statusCode = STATUS_CODE.UNVERIFIED_EMAIL;
          response.message = LOGIN.UNVERIFIED_MAIL;
        }
      }
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Pincode verification failed", err.stack);
    response = systemError(VERIFY_MESSAGE.EXCEPTION);
  }

  res.send(response);
};

const addDepartment = async (req, res) => {
  const { name } = req.body;
  let response = Response(
    STATUS_CODE.SUCCESS,
    ADMIN.SUCCESSFULLY_ADDED_DEPARTMENT,
    ""
  );
  try {
    const { role } = req.userData;
    const authorized = await isAuthorized(role, PERMISSION.ADD_DEPARTMENT);
    if (authorized) {
      const existedDepartment = await Department.findOne({ name: `${name}` });

      if (isEmpty(existedDepartment)) {
        const newDepartment = {
          name: `${name}`,
        };
        await Department.create(newDepartment);
      } else {
        response.statusCode = STATUS_CODE.EXISTED_VALUE;
        response.message = `${ADMIN.DEPARTMENT_EXIST}`;
      }
    } else {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED);
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exeption, admin cannot add department: ",
      err.stack
    );
    response = systemError(ADMIN.EXCEPTION);
  }
  return res.send(response);
};

const addRole = async (req, res) => {
  const { name } = req.body;
  let response = Response(
    STATUS_CODE.SUCCESS,
    ADMIN.SUCCESSFULLY_ADDED_ROLE,
    ""
  );
  try {
    const { role } = req.userData;
    const authorized = await isAuthorized(role, PERMISSION.ADD_ROLE);
    if (authorized) {
      const existedRole = await Role.findOne({ name: `${name}` });
      const count = await Role.countDocuments({});

      if (isEmpty(existedRole)) {
        const newRole = {
          name: `${name}`,
          role_id: count + 1,
        };
        await Role.create(newRole);
      } else {
        response.statusCode = STATUS_CODE.EXISTED_VALUE;
        response.message = `${ADMIN.ROLE_EXIST}`;
      }
    } else {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exeption, admin cannot add designation: ",
      err.stack
    );
    response = systemError(ADMIN.EXCEPTION);
  }
  return res.send(response);
};

const addDesignation = async (req, res) => {
  const { name } = req.body;
  const { role } = req.userData;
  let response = Response(
    STATUS_CODE.SUCCESS,
    ADMIN.SUCCESSFULLY_ADDED_DESIGNATION,
    ""
  );
  try {
    const authorized = await isAuthorized(role, PERMISSION.ADD_DESIGNATION);
    if (authorized) {
      const existedDesignation = await Designation.findOne({ name: `${name}` });

      if (isEmpty(existedDesignation)) {
        const newDesignation = {
          name: `${name}`,
        };
        await Designation.create(newDesignation);
      } else {
        response.statusCode = STATUS_CODE.EXISTED_VALUE;
        response.message = `${ADMIN.DESIGNATION_EXIST}`;
      }
    } else {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exeption, admin cannot add designation: ",
      err.stack
    );
    response = systemError(ADMIN.EXCEPTION);
  }
  return res.send(response);
};

const addUser = async (req, res) => {
  const {
    name,
    roleId,
    date_of_birth,
    designation,
    department,
    managerId,
    email,
    official_contact,
    location,
    date_of_joining,
    employee_code,
    uan_number,
    esic_number,
    gross_salary = 0,
  } = req.body;

  let isSendEmail = false;
  const password = generateRandomPassword();
  let response = Response(
    STATUS_CODE.SUCCESS,
    ADMIN.SUCCESSFULLY_ADDED_USER,
    ""
  );
  let validEmail = email.split("+")[0];

  validEmail =
    validEmail === email ? validEmail : validEmail + "@" + email.split("@")[1];

  try {
    const { role } = req.userData;
    const authorized = await isAuthorized(role, PERMISSION.ADD_USER);
    if (authorized) {
      const count = await User.countDocuments({});
      const existedEmployee = await User.findOne({
        email: `${validEmail}`,
      });
      if (isEmpty(existedEmployee)) {
        let existedDepartment = await Department.findOne({ name: department });
        if (!existedDepartment) {
          existedDepartment = new Department({ name: department });
          await existedDepartment.save();
        }

        let existedDesignation = await Designation.findOne({
          name: designation,
        });
        if (!existedDesignation) {
          existedDesignation = new Designation({ name: designation });
          await existedDesignation.save();
        }
        let existedEmpCode = await User.findOne({
          employee_code: employee_code,
        });
        if (existedEmpCode) {
          console.log("hello");
          res.status(HTTP_STATUS_CODE.BAD_REQUEST);
          response.statusCode = STATUS_CODE.EXISTED_VALUE;
          response.message = EMP_CODE_EXISTED;
        } else {
          const employeeData = {
            name: {
              first_name: `${name.first_name}`,
              last_name: `${name.last_name}`,
            },
            date_of_birth: `${date_of_birth}`,
            designation: existedDesignation._id,
            department: existedDepartment._id,
            email: `${validEmail}`,
            employee_code: employee_code || count + 1,
            password: encrypt(password),
            managerId: managerId,
            role: roleId,
            official_contact: `${official_contact}`,
            location: `${location}`,
            date_of_joining: `${date_of_joining}`,
            uan_number: uan_number,
            esic_number: esic_number,
            gross_salary: gross_salary,
          };
          const createdUser = await User.create(employeeData);
          response.data = {
            name: createdUser.name,
            email: createdUser.email,
          };
          res.status(HTTP_STATUS_CODE.CREATED);
          isSendEmail = true;
        }
      } else {
        response.statusCode = STATUS_CODE.EXISTED_VALUE;
        response.message = `${ADMIN.EMAIL_EXIST}`;
      }
    } else {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    }
    if (isSendEmail) {
      sendGeneratedPassword(email, password, name);
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Exeption,can not add employee: ", err.stack);
    response = systemError(ADMIN.EXCEPTION);
    isSendEmail = false;
  }

  res.send(response);
};

const getAllUsers = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, GET_ALL_USERS_SUCCESS, "");
  try {
    const { role } = req.userData;
    const authorized = await isAuthorized(role, PERMISSION.GET_ALL_USERS);
    if (authorized) {
      const fetchedUsers = await User.find()
        .populate([
          { path: "personal_details", select: "profile_photo" },
          { path: "designation", select: "name -_id" },
          { path: "managerId", select: "name -_id" },
          { path: "department", select: "name -_id" },
          { path: "personal_details" },
        ])
        // .select("name email employee_code location ")
        .sort("email");
      response.data = {
        users: fetchedUsers,
      };
    } else {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED);
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Admin couldn't get all users: ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  console.log(response, "response");
  res.send(response);
};

const getUser = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, GET_USER, "");
  try {
    const { userId } = req.params;
    const { role } = req.userData;
    const authorized = true;
    //  await isAuthorized(role, PERMISSION.SEE_USER_DETAILS);
    if (authorized) {
      const fetchedUsers = await User.findById({ _id: userId })
        .populate([
          { path: "department", select: "name -_id" },
          { path: "designation", select: "name -_id" },
          { path: "managerId", select: "name email -_id" },
          { path: "personal_details", select: "-__v" },
          { path: "role", select: "-__v" },
        ])
        .select("-password -__v -createdAt -updatedAt");

      response.data = {
        userDetails: fetchedUsers,
      };
    } else {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Admin couldn't get user information: ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updateUser = async (req, res) => {
  let {
    userId,
    email,
    name,
    managerId,
    location,
    date_of_birth,
    date_of_joining,
    designation,
    department,
    official_contact,
    employee_code,
    roleId,
    uan_number,
    esic_number,
    gross_salary,
  } = req.body;

  const { role: adminRole } = req.userData;
  let response = Response(STATUS_CODE.SUCCESS, USER_PROFILE_UPDATE_SUCCESS, "");
  try {
    const authorized = await isAuthorized(adminRole, PERMISSION.UPDATE_USER);
    if (authorized) {
      const existedUser = await User.findById({ _id: userId });
      if (isEmpty(existedUser)) {
        response.statusCode = STATUS_CODE.NOT_FOUND;
        response.message = USER.NOT_EXIST;
      } else {
        let existedDepartment = await Department.findOne({ name: department });
        if (!existedDepartment) {
          existedDepartment = new Department({ name: department });
          await existedDepartment.save();
        }

        let existedDesignation = await Designation.findOne({
          name: designation,
        });

        if (!existedDesignation) {
          existedDesignation = new Designation({ name: designation });
          await existedDesignation.save();
        }

        let existedEmpCode = await User.findOne({
          employee_code: employee_code,
        });

        let existedEmpEmail = await User.findOne({
          email: email,
        });

        if (existedEmpEmail && existedEmpEmail.email != email) {
          res.status(HTTP_STATUS_CODE.BAD_REQUEST);
          response.statusCode = STATUS_CODE.EXISTED_VALUE;
          response.message = EMAIL_EXIST;
        } else if (existedEmpCode && existedEmpCode.email != email) {
          res.status(HTTP_STATUS_CODE.BAD_REQUEST);
          response.statusCode = STATUS_CODE.EXISTED_VALUE;
          response.message = EMP_CODE_EXISTED;
        } else {
          first_name = name?.first_name || existedUser.name.first_name;
          last_name = name?.last_name || existedUser.name.last_name;
          email = email || existedUser.email;
          official_contact = official_contact || existedUser.official_contact;
          managerId = managerId || existedUser.managerId;
          location = location || existedUser.location;
          role = roleId || existedUser.role;
          date_of_joining = date_of_joining || existedUser.date_of_joining;
          date_of_birth = date_of_birth || existedUser.date_of_birth;
          designation = existedDesignation._id || existedUser.designation;
          department = existedDepartment._id || existedUser.department;
          employee_code = employee_code || existedUser.employee_code;
          esic_number = esic_number || existedUser.esic_number;
          uan_number = uan_number || existedUser.uan_number;
          gross_salary = gross_salary || existedUser.gross_salary;
          const temp = await User.findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                name: {
                  first_name: first_name,
                  last_name: last_name,
                },
                email: email,
                official_contact: official_contact,
                managerId: managerId,
                location: location,
                date_of_birth: date_of_birth,
                designation: designation,
                department: department,
                employee_code: employee_code,
                date_of_joining: date_of_joining,
                esic_number: esic_number,
                uan_number: uan_number,
                role: role,
                gross_salary: gross_salary,
              },
            }
          );
        }
      }
    } else {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED);
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to update user data official ",
      err.stack
    );
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const searchUser = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, EMPLOYEE_SEARCH_SUCCESS, "");
  try {
    const { searchTerm } = req.params;
    const fetchedUsers = await User.find({
      $or: [
        { "name.first_name": new RegExp(`^${searchTerm}`, "i") },
        { "name.last_name": new RegExp(`^${searchTerm}`, "i") },
      ],
    }).select("name email employee_code");

    response.data = {
      users: fetchedUsers,
    };
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Couldn't search users: ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  console.log(response, "response");
  res.send(response);
};

const allocateLeaves = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, ALLOCATE_LEAVE_SUCCESS, "");
  const { userId, leavesInfo } = req.body;
  try {
    const { role: adminRole } = req.userData;
    const authorized = await isAuthorized(
      adminRole,
      PERMISSION.ALLOCATE_LEAVES
    );
    if (authorized) {
      const leaveBalance = await LeaveBalance.findOneAndUpdate(
        { userId: userId },
        { leavesInfo: leavesInfo },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      response.data = {
        allocatedLeaves: leaveBalance,
      };
    } else {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "coudn't allocate leaves: ", err.stack);
    response = systemError(USER.EXCEPTION);
  }

  res.send(response);
};

const applyLeave = async (req, res) => {
  let { leaveType, reason, startDate, endDate, leaveDuration } = req.body;
  let response = Response(STATUS_CODE.SUCCESS, LEAVE.APPLY_SUCCESS, "");
  try {
    const { userid, empCode } = req.userData;
    const existedUser = await User.findById({ _id: userid });
    const allocatedLeaves = await LeaveBalance.findOne({ userId: userid });
    if (isEmpty(allocatedLeaves)) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      response.statusCode = STATUS_CODE.NOT_ALLOWED;
      response.message = `${LEAVES_NOT_ALLOCATED}`;
    } else {
      if (leaveDuration == "halfDay" && startDate != endDate) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST);
        response.statusCode = STATUS_CODE.NOT_ALLOWED;
        response.message = `Half day can be applied only for single day`;
      } else {
        const availableLeave = allocatedLeaves.leavesInfo.find((l) => {
          return l.leaveType.toString() === leaveType;
        });

        const differenceInMilliseconds =
          new Date(endDate) - new Date(startDate);
        let differenceInDays =
          differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1;
        if (leaveDuration == "halfDay") {
          differenceInDays = 0.5;
        }
        const dec = 0 - differenceInDays;
        if (availableLeave?.allocated < differenceInDays) {
          response.statusCode = STATUS_CODE.NOT_ALLOWED;
          response.message = `${NOT_ENOUGH_LEAVE_BALANCE}`;
        } else {
          const newLeave = {
            empCode: empCode,
            userId: existedUser._id,
            managerId: existedUser.managerId,
            leaveType: leaveType,
            reason: reason,
            startDate: startDate,
            endDate: endDate,
            status: "pending",
            leaveDuration: leaveDuration,
            approverRemark: "",
            dayCount: differenceInDays,
          };

          const createdLeaveRequest = await LeaveRequest.create(newLeave);
          await LeaveBalance.updateOne(
            {
              userId: userid,
              "leavesInfo.leaveType": leaveType,
            },
            {
              $inc: {
                // "leavesInfo.$.allocated": dec,
                "leavesInfo.$.taken": differenceInDays,
              },
            }
          );

          response.data = {
            leaveInfo: createdLeaveRequest,
          };
        }
      }
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to apply leaves ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const editLeave = async (req, res) => {
  let { leaveId, leaveType, reason, startDate, endDate, leaveDuration } =
    req.body;
  let response = Response(STATUS_CODE.SUCCESS, LEAVE.EDIT_SUCCESSFULLY, "");
  try {
    const { userid, empCode } = req.userData;
    const existedUser = await User.findById({ _id: userid });
    const allocatedLeaves = await LeaveBalance.findOne({ userId: userid });
    const leaveStatusData = await LeaveRequest.findOne({
      _id: leaveId,
    });
    if (isEmpty(leaveStatusData)) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST);
      response.statusCode = STATUS_CODE.NOT_FOUND;
      response.message = `${LEAVES_NOT_FOUND}`;
    } else {
      if (isEmpty(allocatedLeaves)) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST);
        response.statusCode = STATUS_CODE.NOT_ALLOWED;
        response.message = `${LEAVES_NOT_ALLOCATED}`;
      } else {
        if (leaveDuration == "halfDay" && startDate != endDate) {
          res.status(HTTP_STATUS_CODE.BAD_REQUEST);
          response.statusCode = STATUS_CODE.NOT_ALLOWED;
          response.message = `Half day can be applied only for single day`;
        } else {
          const availableLeave = allocatedLeaves.leavesInfo.find((l) => {
            return l.leaveType.toString() === leaveType;
          });

          const differenceInMilliseconds =
            new Date(endDate) - new Date(startDate);
          let differenceInDays =
            differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1;
          if (leaveDuration == "halfDay") {
            differenceInDays = 0.5;
          }
          if (
            availableLeave?.allocated - leaveStatusData.dayCount <
            differenceInDays
          ) {
            response.statusCode = STATUS_CODE.NOT_ALLOWED;
            response.message = `${NOT_ENOUGH_LEAVE_BALANCE}`;
          } else {
            const newLeave = {
              empCode: empCode,
              userId: existedUser._id,
              managerId: existedUser.managerId,
              leaveType: leaveType,
              reason: reason,
              startDate: startDate,
              endDate: endDate,
              status: leaveStatusData.status,
              leaveDuration: leaveDuration,
              approverRemark: leaveStatusData.approverRemark,
              dayCount: differenceInDays,
            };

            const updatedLeave = await LeaveRequest.findByIdAndUpdate(
              leaveId,
              {
                $set: newLeave,
              },
              { new: true }
            );

            await LeaveBalance.updateOne(
              {
                userId: userid,
                "leavesInfo.leaveType": leaveType,
              },
              {
                $inc: {
                  "leavesInfo.$.taken":
                    differenceInDays - leaveStatusData.dayCount,
                },
              }
            );

            response.data = {
              leaveInfo: updatedLeave,
            };
          }
        }
      }
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Exception: Failed to edit leaves ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getLeaves = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, LEAVE_FETCH_SUCCESS, "");
  try {
    const { userid } = req.userData;
    const leaves = await LeaveRequest.find({ userId: userid })
      .populate([
        { path: "userId", select: "name -_id" },
        { path: "managerId", select: "name -_id" },
        { path: "leaveType", select: "title -_id" },
      ])
      .select("-__v -createdAt -updatedAt")
      .sort("-createdAt");
    response.data = {
      leaves: leaves,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get leaves of user",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getLeaveBalance = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, LEAVE_BALANCE_FETCH_SUCCESS, "");
  try {
    const { userid } = req.userData;
    const leaveBalance = await LeaveBalance.findOne({ userId: userid })
      .populate("leavesInfo.leaveType", "title -_id")
      .select("-__v -createdAt -updatedAt");

    response.data = {
      leaveBalance: leaveBalance,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get leaves balance of user",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const changeLeaveSatus = async (req, res) => {
  const { leaveId, status, remark, empCode } = req.body;
  let response = Response(
    STATUS_CODE.SUCCESS,
    status == "approved" ? LEAVE_APPROVED_LEAVE : LEAVE_REJECT_SUCCESS,
    ""
  );

  try {
    const { role: adminRole } = req.userData;
    const authorized = await isAuthorized(
      adminRole,
      PERMISSION.CHANGE_LEAVE_STATUS
    );
    if (authorized) {
      const leaveStatusData = await LeaveRequest.findByIdAndUpdate(
        { _id: leaveId },
        {
          status: status,
          approverRemark: remark,
        }
      );
      console.log(leaveStatusData);
      if (
        (leaveStatusData.status == "approved" ||
          leaveStatusData.status == "pending") &&
        status == "rejected"
      ) {
        console.log("rejected", leaveStatusData);
        const leaveBalanceData = await LeaveBalance.updateOne(
          {
            userId: leaveStatusData.userId,
            "leavesInfo.leaveType": leaveStatusData.leaveType,
          },
          {
            $inc: {
              // "leavesInfo.$.allocated": leaveStatusData.dayCount,
              "leavesInfo.$.taken": -leaveStatusData.dayCount,
            },
          },
          {
            returnOriginal: false,
          }
        );
      } else if (
        (leaveStatusData.status == "rejected" && status == "approved") ||
        (leaveStatusData.status == "rejected" && status == "pending")
      ) {
        console.log("approved", leaveStatusData);

        const leaveBalanceData = await LeaveBalance.updateOne(
          {
            userId: leaveStatusData.userId,
            "leavesInfo.leaveType": leaveStatusData.leaveType,
          },
          {
            $inc: {
              // "leavesInfo.$.allocated": -leaveStatusData.dayCount,
              "leavesInfo.$.taken": leaveStatusData.dayCount,
            },
          },
          {
            returnOriginal: false,
          }
        );
      }
      // const updatedAttedance = await Attendance.updateMany(
      //   {
      //     empCode: empCode,
      //     date: {
      //       $gte: leaveStatusData.startDate,
      //       $lte: leaveStatusData.endDate,
      //     },
      //   },
      //   {
      //     $set: {
      //       managerRemark: leaveStatusData.status,
      //     },
      //   }
      // );
      response.data = {
        leaveStatusData: leaveStatusData,
      };
    } else {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to change status of leave",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const CancelLeaveRequest = async (req, res) => {
  const { leaveId } = req.params;
  let response = Response(STATUS_CODE.SUCCESS, LEAVE_CANCEL_SUCCESS, "");
  try {
    const { userid, empCode } = req.userData;
    const currentLeave = await LeaveRequest.findById({ _id: leaveId });
    if (currentLeave.userId != userid) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      if (currentLeave.status == "pending") {
        // const existedLeave = await LeaveRequest.findOne({
        //   _id: leaveId,
        // });

        const leaveStatusData = await LeaveRequest.findOneAndDelete({
          _id: leaveId,
        });

        const leaveBalanceData = await LeaveBalance.updateOne(
          {
            userId: leaveStatusData.userId,
            "leavesInfo.leaveType": leaveStatusData.leaveType,
          },
          {
            $inc: {
              // "leavesInfo.$.allocated": leaveStatusData.dayCount,
              "leavesInfo.$.taken": -leaveStatusData.dayCount,
            },
          }
        );

        // const updatedAttedance = await Attendance.updateMany(
        //   {
        //     empCode: empCode,
        //     date: {
        //       $gte: existedLeave.startDate,
        //       $lte: existedLeave.endDate,
        //     },
        //   },
        //   {
        //     $unset: {
        //       managerRemark: "",
        //       employeeRemark: "",
        //     },
        //   }
        // );
      } else {
        res.status = HTTP_STATUS_CODE.BAD_REQUEST;
        response.statusCode = STATUS_CODE.INVALID_VALUE;
        response.message = `You can only delete pending request`;
      }
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to cancle leave request",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getLeaveBalanceOfUsers = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, LEAVE_BALANCE_FETCH_SUCCESS, "");
  try {
    const { role: adminRole } = req.userData;
    const authorized = await isAuthorized(
      adminRole,
      PERMISSION.GET_LEAVES_FO_ALL_USERS
    );
    if (!authorized) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      const users = await User.find().select("_id name").sort("email");

      const promises = users.map(async (user) => {
        const leaveBalance = await LeaveBalance.findOne({
          userId: user._id,
        })
          .populate("leavesInfo.leaveType", "title -_id")
          .select("-__v -createdAt -updatedAt -_id -userId ");
        return { ...user._doc, leaveBalance };
      });

      const usersWithLeaveBalances = await Promise.all(promises);

      // const leaveBalance = await LeaveBalance.find()
      //   .populate("leavesInfo.leaveType", "title -_id")
      //   .select("-__v -createdAt -updatedAt");

      response.data = {
        // leaveBalance: leaveBalance,
        usersWithLeaveBalances: usersWithLeaveBalances,
      };
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get leaves balance of all users",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getLeaveRequestOfUsers = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, LEAVE_FETCH_SUCCESS, "");
  try {
    const { role: adminRole } = req.userData;
    const authorized = await isAuthorized(
      adminRole,
      PERMISSION.GET_LEAVES_FO_ALL_USERS
    );
    if (!authorized) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      const leaveBalance = await LeaveRequest.find().populate([
        {
          path: "userId",
          select: "name employee_code -_id managerId empCode",
          populate: { path: "managerId", select: "name" },
        },
        { path: "leaveType", select: "title _id" },
      ]);

      response.data = {
        leaveRequest: leaveBalance,
      };
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get leaves request of all users",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getUpcomingBirthdays = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, BIRTHDAY_FETCH_SUCCESS, "");
  try {
    const currentDate = new Date();
    const users = await User.aggregate([
      {
        $addFields: {
          birthdayThisYear: {
            $dateFromParts: {
              year: { $year: currentDate },
              month: { $month: "$date_of_birth" },
              day: { $dayOfMonth: "$date_of_birth" },
            },
          },
        },
      },
      {
        $addFields: {
          daysDifference: {
            $divide: [
              { $subtract: ["$birthdayThisYear", currentDate] },
              24 * 60 * 60 * 1000, // Milliseconds in a day
            ],
          },
        },
      },
      {
        $match: {
          daysDifference: { $gte: -1 },
        },
      },
      {
        $sort: { daysDifference: 1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "PersonalDetails",
          localField: "personal_details",
          foreignField: "_id",
          as: "personal_details",
        },
      },
      {
        $unwind: {
          path: "$personal_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          date_of_birth: 1,
          daysDifference: 1,
          birthdayThisYear: 1,
          profile_photo: "$personal_details.profile_photo",
        },
      },
    ]);

    response.data = {
      users: users,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get upcoming birthdays",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getUpcomingAnniversy = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, BIRTHDAY_FETCH_SUCCESS, "");
  try {
    const currentDate = new Date();
    const users = await User.aggregate([
      {
        $addFields: {
          anniversaryThisYear: {
            $dateFromParts: {
              year: { $year: currentDate },
              month: { $month: "$date_of_joining" },
              day: { $dayOfMonth: "$date_of_joining" },
            },
          },
        },
      },
      {
        $addFields: {
          daysDifference: {
            $divide: [
              { $subtract: ["$anniversaryThisYear", currentDate] },
              24 * 60 * 60 * 1000, // Milliseconds in a day
            ],
          },
        },
      },
      {
        $match: {
          daysDifference: { $gte: -1 },
        },
      },
      {
        $sort: { daysDifference: 1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          name: 1,
          date_of_joining: 1,
          daysDifference: 1,
          anniversaryThisYear: 1,
        },
      },
    ]);

    response.data = {
      users: users,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get upcoming birthdays",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getOrganizationData = async (req, res) => {
  let response = Response(
    STATUS_CODE.SUCCESS,
    ORGANIZATION_DATA_FETCH_SUCCESS,
    ""
  );
  try {
    const organization = await Organization.findOne({
      singletonGuard: "single_instance",
    }).select("thought notice poshPolicy holidayCalendar policies");
    response.data = {
      organization: organization,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get organization data",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getAttendance = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, AttendanceGetSuccess, "");
  try {
    const { empCode } = req.userData;
    const { startDate, endDate } = req.query;

    const attendanceData = await Attendance.find({
      empCode: empCode,
    })
      .select("-_id -createdAt -updatedAt")
      .sort({ date: -1 });

    const result = await Attendance.aggregate([
      {
        $match: {
          empCode: empCode,
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "leaverequests",
          let: { empCode: "$empCode", date: "$date" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$empCode", "$$empCode"] },
                    { $lte: ["$startDate", "$$date"] },
                    { $gte: ["$endDate", "$$date"] },
                  ],
                },
              },
            },
          ],
          as: "leave",
        },
      },
      {
        $unwind: {
          path: "$leave",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "leavetypes",
          localField: "leave.leaveType",
          foreignField: "_id",
          as: "leavetype",
        },
      },
      {
        $unwind: {
          path: "$leavetype",
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $sort: {
      //     date: -1,
      //   },
      // },
      {
        $project: {
          _id: 0,
          date: 1,
          empCode: 1,
          attendance: 1,
          inTime: 1,
          outTime: 1,
          duration: 1,
          status: 1,
          empName: 1,
          managerRemark: "$leave.status",
          employeeRemark: "$leavetype.title",
          leaveDuration: "$leave.leaveDuration",
        },
      },
    ]);

    response.data = {
      attendance: result,
    };
  } catch (err) {
    logger.error(TYPE_LOG.USER, "attendance fetch failed ", err.stack);
    response = systemError(LOGIN.EXCEPTION);
  }
  res.send(response);
};

const getAllAttendance = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, AttendanceGetSuccess, "");
  try {
    const { role } = req.userData;
    const { date, startDate, endDate } = req.query;
    const dateObject = new Date(date);
    const formattedDate = format(dateObject, "yyyy-MM-dd'T00:00:00.000Z'");
    const authorized = await isAuthorized(role, PERMISSION.GET_ALL_ATTENDANCE);
    if (!authorized) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      // const attendanceData = await Attendance.find({ date: formattedDate });
      const result = await Attendance.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $lookup: {
            from: "leaverequests",
            let: { empCode: "$empCode", date: "$date" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$empCode", "$$empCode"] },
                      { $lte: ["$startDate", "$$date"] },
                      { $gte: ["$endDate", "$$date"] },
                    ],
                  },
                },
              },
            ],
            as: "leave",
          },
        },
        {
          $unwind: {
            path: "$leave",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "leavetypes",
            localField: "leave.leaveType",
            foreignField: "_id",
            as: "leavetype",
          },
        },
        {
          $unwind: {
            path: "$leavetype",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { date: 1, empName: 1 },
        },
        {
          $project: {
            _id: 0,
            date: 1,
            empCode: 1,
            attendance: 1,
            inTime: 1,
            outTime: 1,
            duration: 1,
            status: 1,
            empName: 1,
            managerRemark: "$leave.status",
            employeeRemark: "$leavetype.title",
            leaveDuration: "$leave.leaveDuration",
          },
        },
      ]);

      response.data = {
        attendance: result,
      };
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "password changes failed ", err.stack);
    response = systemError(LOGIN.EXCEPTION);
  }
  res.send(response);
};

const getLeaveByDate = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, LEAVE_FETCH_SUCCESS, "");
  const { date } = req.query;
  try {
    // const parsedDate = parse(date, "dd-MMM-yyyy", new Date());

    // const formattedDate = format(parsedDate, "yyyy-MM-dd'T00:00:00.000Z'");
    const { userid } = req.userData;
    const leaves = await LeaveRequest.findOne({
      $and: [
        { userId: userid },
        { startDate: { $lte: date } },
        { endDate: { $gte: date } },
      ],
    })
      .populate([{ path: "leaveType", select: "title -_id" }])
      .select("status startDate endDate leaveDuration")
      .sort("-createdAt");

    response.data = {
      leaves: leaves,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get leaves of user",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getUserLeaveByDate = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, LEAVE_FETCH_SUCCESS, "");
  const { date, empCode } = req.query;
  try {
    const leaves = await LeaveRequest.findOne({
      $and: [
        { empCode: empCode },
        { startDate: { $lte: date } },
        { endDate: { $gte: date } },
      ],
    })
      .populate([{ path: "leaveType", select: "title -_id" }])
      .select("status startDate endDate leaveDuration")
      .sort("-createdAt");

    response.data = {
      leaves: leaves,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get leaves of user",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

module.exports = {
  login,
  logout,
  verifyUser,
  changePassword,
  addRole,
  addDepartment,
  addDesignation,
  addUser,
  getAllUsers,
  sendPinCode,
  verifyPincode,
  resetPassword,
  updateUser,
  searchUser,
  getUser,
  allocateLeaves,
  applyLeave,
  editLeave,
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
};
