const { isEmpty } = require("lodash");
const { parse, format } = require("date-fns");

const {
  User,
  Department,
  Role,
  Designation,
  Permission,
  Attendance,
} = require("../../db/models");
const otpGenerator = require("otp-generator");
const { isAuthorized } = require("../common/helpers/auth");
const XLSX = require("xlsx");
const fs = require("fs");

const logger = require("../common/helpers/logger");
const {
  STATUS_CODE,
  HTTP_STATUS_CODE,
} = require("../common/helpers/response-code");
const { Response, systemError } = require("../common/response-formatter");

const { encrypt } = require("../common/helpers/crypto");
const {
  ADMIN,
  TYPE_LOG,
  DEPARTMENT_FETCH_SUCCESS,
  USER,
  DESIGNATION_FETCH_SUCCESS,
  ROLE_FETCH_SUCCESS,
  LEAVE_TYPE_FETCH_SUCCESS,
  UPDATE_THOUGHT_SUCCESS,
  AUTHENTICATION,
  PERMISSION,
  ATTEDANCE_UPLOAD_SUCCESS,
  UPDATE_HOLIDAY_CALENDAR_SUCCESS,
  UPDATE_POSH_POLICY_SUCCESS,
  UPDATE_NOTICE_SUCCESS,
  UPDATE_POLICY_SUCCESS,
} = require("../common/helpers/constant");
const LeaveType = require("../../db/models/leaveType");
const Leave = require("../../db/models/leaveBalance");
const Miscellaneous = require("../../db/models/organization");
const Organization = require("../../db/models/organization");

const addPermission = async (req, res) => {
  const { title } = req.body;
  // const { role } = req.userData;
  let response = Response(
    STATUS_CODE.SUCCESS,
    ADMIN.PERMISSION_ADDED_SUCCESSFULLY,
    ""
  );
  try {
    const count = await Permission.countDocuments({});
    const existedPermission = await Permission.findOne({ title: title });
    if (isEmpty(existedPermission)) {
      const newPermission = {
        title: `${title}`,
        permission_id: count + 1,
      };
      await Permission.create(newPermission);
    } else {
      response.statusCode = STATUS_CODE.EXISTED_VALUE;
      response.message = `${ADMIN.PERMISSION_EXIST}`;
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.ADMIN,
      "Exeption, admin cannot add permission: ",
      err.stack
    );
    response = systemError(ADMIN.EXCEPTION);
  }
  return res.send(response);
};

const adminAddDepartment = async (req, res) => {
  const { name } = req.body;
  let response = Response(
    STATUS_CODE.SUCCESS,
    ADMIN.SUCCESSFULLY_ADDED_DEPARTMENT,
    ""
  );
  try {
    const existedDepartment = await Department.findOne({ name: `${name}` });
    const count = await Department.countDocuments({});

    if (isEmpty(existedDepartment)) {
      const newDepartment = {
        name: `${name}`,
      };
      await Department.create(newDepartment);
    } else {
      response.statusCode = STATUS_CODE.EXISTED_VALUE;
      response.message = `${ADMIN.DEPARTMENT_EXIST}`;
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

const adminAddRole = async (req, res) => {
  const { name, permissions } = req.body;
  let response = Response(
    STATUS_CODE.SUCCESS,
    ADMIN.SUCCESSFULLY_ADDED_ROLE,
    ""
  );
  try {
    const count = await Role.countDocuments({});

    const existedRole = await Role.findOne({ name: `${name}` });
    if (isEmpty(existedRole)) {
      const newRole = {
        name: `${name}`,
        role_id: count + 1,
        permissions: permissions,
      };
      await Role.create(newRole);
    } else {
      response.statusCode = STATUS_CODE.EXISTED_VALUE;
      response.message = `${ADMIN.ROLE_EXIST}`;
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

const adminAddDesignation = async (req, res) => {
  const { name } = req.body;
  let response = Response(
    STATUS_CODE.SUCCESS,
    ADMIN.SUCCESSFULLY_ADDED_DESIGNATION,
    ""
  );
  try {
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

const addAdmin = async (req, res) => {
  const {
    name,
    date_of_birth = `2001-01-01`,
    designation,
    department,
    managerId = null,
    email,
    official_contact,
    password,
    location,
    roleId,
    date_of_joining = `2001-01-01`,
  } = req.body;

  // const genratedPassword = password || generateRandomPassword();

  let response = Response(
    STATUS_CODE.SUCCESS,
    ADMIN.SUCCESSFULLY_ADDED_USER,
    ""
  );
  let validEmail = email.split("+")[0];

  validEmail =
    validEmail === email ? validEmail : validEmail + "@" + email.split("@")[1];

  try {
    const count = await User.countDocuments({});

    const existedUser = await User.findOne({ email: `${validEmail}` });
    console.log(existedUser);
    if (isEmpty(existedUser)) {
      const adminData = {
        name: {
          first_name: `${name.first_name}`,
          last_name: `${name.last_name}`,
        },
        date_of_birth: date_of_birth,
        designation: designation,
        department: department,
        email: `${validEmail}`,
        employee_code: count + 1,
        password: encrypt(password),
        managerId: managerId,
        role: roleId,
        official_contact: `${official_contact}`,
        location: `${location}`,
        date_of_joining: date_of_joining,
      };
      await User.create(adminData);

      // isSendEmail = true
    } else {
      response.statusCode = STATUS_CODE.EXISTED_VALUE;
      response.message = `${ADMIN.ADMIN_EXIST}`;
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Exeption, can not user: ", err.stack);
    response = systemError(ADMIN.EXCEPTION);
  }
  res.send(response);
};

const geneartePasswordForUser = async (req, res) => {
  const { email } = req.body;
  const response = new Response(statusCode.SUCCESS, Login.RESET_PASS_SUCCESS);
  try {
    const existedUser = await User.findOne({ email: email }).select(
      "email",
      "name"
    );
    if (isEmpty(existedUser)) {
      response.statusCode = STATUS_CODE.NOT_FOUND;
      response.message = LOGIN.INVALID_EMAIL;
    } else {
      await generatePassword();
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Pincode verification failed", err.stack);
    response = systemError(VERIFY_MESSAGE.EXCEPTION);
  }

  res.send(response);
};

const addLeaveType = async (req, res) => {
  try {
    const { title } = req.body;
    const ress = await LeaveType.create({
      title: `${title}`,
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
  }
};

const getDepartments = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, DEPARTMENT_FETCH_SUCCESS, "");
  try {
    const fetchedDepartments = await Department.find({}).select("name");

    response.data = {
      departments: fetchedDepartments,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get fetch departments ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getDesignations = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, DESIGNATION_FETCH_SUCCESS, "");
  try {
    const fetchedDesignations = await Designation.find({}).select("name");

    response.data = {
      designation: fetchedDesignations,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get fetch designation ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getRoles = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, ROLE_FETCH_SUCCESS, "");
  try {
    const fetchedRoles = await Role.find({}).select("name");

    response.data = {
      roles: fetchedRoles,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get fetch roles ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getLeavesType = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, LEAVE_TYPE_FETCH_SUCCESS, "");
  try {
    const fetchedLeaves = await LeaveType.find({}).select(
      "-createdAt -updatedAt -__v"
    );

    response.data = {
      leavesType: fetchedLeaves,
    };
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get fetch leave type ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const attendance = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, ATTEDANCE_UPLOAD_SUCCESS, "");
  try {
    const { role } = req.userData;
    const dayType = req.body.dayType;
    const authorized = await isAuthorized(
      role,
      PERMISSION.INSERT_ATTENDANCE_DATA
    );
    if (!authorized) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      const workbook = XLSX.readFile(req.file.path);

      const workbookJson = {};

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];

        workbookJson[sheetName] = XLSX.utils.sheet_to_json(worksheet);
      });

      fs.unlinkSync(req.file.path);
      const printedDate =
        workbookJson.AttendanceSummaryReport[2].__EMPTY_16.slice(13);

      const bulkUpdateOps = [];
      for (let i = 4; i < workbookJson.AttendanceSummaryReport.length; i++) {
        if (!/\d/.test(workbookJson.AttendanceSummaryReport[i]["__EMPTY_2"])) {
          const parsedDate = parse(
            workbookJson.AttendanceSummaryReport[i]["__EMPTY_3"],
            "dd-MMM-yyyy",
            new Date()
          );

          const formattedDate = format(
            parsedDate,
            "yyyy-MM-dd'T00:00:00.000Z'"
          );

          const filter = {
            empCode: workbookJson.AttendanceSummaryReport[i]["__EMPTY"],
            date: formattedDate,
          };

          const updateData = {
            empName: workbookJson.AttendanceSummaryReport[i]["__EMPTY_2"],
            status:
              workbookJson.AttendanceSummaryReport[i]["__EMPTY_4"] || null,
            inTime:
              workbookJson.AttendanceSummaryReport[i]["__EMPTY_5"] || null,
            outTime:
              workbookJson.AttendanceSummaryReport[i]["__EMPTY_6"] || null,
            duration:
              workbookJson.AttendanceSummaryReport[i]["__EMPTY_8"] || null,
            tillDate: printedDate,
          };

          if (!(updateData.outTime && updateData.inTime)) {
            if (dayType === "H") {
              updateData.attendance = "H";
            } else if (dayType === "WO") {
              updateData.attendance = "WO";
            } else {
              updateData.attendance = "L";
            }
            updateData.duration = 0;
          } else {
            const inTimeParts = updateData.inTime.split(":");
            const outTimeParts = updateData.outTime.split(":");
            const currentDate = new Date();

            const inDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              parseInt(inTimeParts[0]),
              parseInt(inTimeParts[1])
            );

            const outDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              parseInt(outTimeParts[0]),
              parseInt(outTimeParts[1])
            );

            const timeDifferenceMs = outDate - inDate;
            const timeDifferenceHours = (
              timeDifferenceMs /
              (1000 * 60 * 60)
            ).toFixed(2);

            // updateData.duration = duration;

            if (dayType === "H") {
              updateData.attendance = "H";
            } else if (dayType === "WO") {
              updateData.attendance = "WO";
            } else if (timeDifferenceHours < 4) {
              updateData.attendance = "L";
            } else if (timeDifferenceHours < 9) {
              if (dayType === "HD") {
                updateData.attendance = "P";
              } else if (dayType === "FD") {
                updateData.attendance = "P2";
              }
            } else {
              updateData.attendance = "P";
            }
          }

          const updateFields = {
            $set: updateData,
          };

          bulkUpdateOps.push({
            updateOne: {
              filter,
              update: updateFields,
              upsert: true,
            },
          });
        }
      }
      const updatedAttendances = await Attendance.bulkWrite(bulkUpdateOps);
      response.data = {
        data: updatedAttendances,
      };
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Exception: Attendence ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updateThought = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, UPDATE_THOUGHT_SUCCESS, "");
  try {
    const { role } = req.userData;

    const authorized = await isAuthorized(
      role,
      PERMISSION.UPDATE_ORGANIZATION_DATA
    );
    if (!authorized) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      const file = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      };
      const res = await Organization.findOneAndUpdate(
        { singletonGuard: "single_instance" },
        { thought: file },
        { new: true, upsert: true }
      );
      response.data = {
        organization: res,
      };
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Exception: thought update ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updatePoshPolicy = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, UPDATE_POSH_POLICY_SUCCESS, "");
  try {
    const { role } = req.userData;

    const authorized = await isAuthorized(
      role,
      PERMISSION.UPDATE_ORGANIZATION_DATA
    );
    if (!authorized) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      const file = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      };
      const res = await Organization.findOneAndUpdate(
        { singletonGuard: "single_instance" },
        { poshPolicy: file },
        { new: true, upsert: true }
      );
      response.data = {
        organization: res,
      };
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Exception: notice update ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updateHolidayCalendar = async (req, res) => {
  let response = Response(
    STATUS_CODE.SUCCESS,
    UPDATE_HOLIDAY_CALENDAR_SUCCESS,
    ""
  );
  try {
    const { role } = req.userData;

    const authorized = await isAuthorized(
      role,
      PERMISSION.UPDATE_ORGANIZATION_DATA
    );
    if (!authorized) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      const file = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      };
      const res = await Organization.findOneAndUpdate(
        { singletonGuard: "single_instance" },
        { holidayCalender: file },
        { new: true, upsert: true }
      );
      response.data = {
        organization: res,
      };
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: holiday calender update ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updateNotice = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, UPDATE_NOTICE_SUCCESS, "");
  try {
    const { role } = req.userData;
    const authorized = await isAuthorized(
      role,
      PERMISSION.UPDATE_ORGANIZATION_DATA
    );
    if (!authorized) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      const newNotice = req.body.notice;

      const modifiedNotices = [];

      for (const notice of newNotice) {
        const { name, details } = notice;

        modifiedNotices.push({ name, details });
      }

      const updatedOrganization = await Organization.findOneAndUpdate(
        { singletonGuard: "single_instance" },
        { notice: modifiedNotices },
        { new: true, upsert: true }
      );

      response.data = {
        organization: updatedOrganization,
      };
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Exception: notice update ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updatePolicy = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, UPDATE_POLICY_SUCCESS, "");
  try {
    const { role } = req.userData;

    const authorized = await isAuthorized(
      role,
      PERMISSION.UPDATE_ORGANIZATION_DATA
    );
    if (!authorized) {
      res.status = HTTP_STATUS_CODE.UNAUTHORIZED;
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = `${AUTHENTICATION.UNAUTHORIZED}`;
    } else {
      const files = req.files.map((f) => ({
        name: f.filename,
        file: {
          filename: f.filename,
          path: f.path,
          size: f.size,
          mimetype: f.mimetype,
        },
      }));
      const res = await Organization.findOneAndUpdate(
        { singletonGuard: "single_instance" },
        { policies: files },
        { new: true, upsert: true }
      );
      response.data = {
        organization: res,
      };
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Exception: policy update ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

module.exports = {
  addPermission,
  adminAddDepartment,
  adminAddDesignation,
  adminAddRole,
  addAdmin,
  addLeaveType,
  getDepartments,
  getDesignations,
  getRoles,
  getLeavesType,
  attendance,
  updateThought,
  updatePoshPolicy,
  updateHolidayCalendar,
  updateNotice,
  updatePolicy,
};
