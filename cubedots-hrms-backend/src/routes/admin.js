const { Router } = require("express");

const { isAuthenticate } = require("../common/helpers/auth");
const {
  addPermission,
  adminAddDesignation,
  adminAddDepartment,
  adminAddRole,
  addAdmin,
  addLeaveType,
  getLeaves,
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
} = require("../controllers");
const { validateSignup } = require("../common/validators");
const multer = require("multer");
const routes = Router();

const storageAttendance = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/attendance");
  },
  filename: function (req, file, cb) {
    cb(null, "attendance.xls");
  },
});

const storageThought = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/thought");
  },
  filename: function (req, file, cb) {
    cb(null, "thought");
  },
});

const storagePosh = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/poshPolicy");
  },
  filename: function (req, file, cb) {
    cb(null, "posh-policy.pdf");
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

const storagePolicy = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/policies");
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const sanitizedFilename = originalname.toLowerCase().replace(/ /g, "-");
    // const filenameWithoutExtension = sanitizedFilename.split('.')[0]
    cb(null, `${sanitizedFilename}`);
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

const storageHolidayCalender = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/holidayCalender");
  },
  filename: function (req, file, cb) {
    cb(null, "holiday-calender.pdf");
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

const uploadThought = multer({ storage: storageThought });
const uploadPoshPolicy = multer({ storage: storagePosh });
const uploadAttendance = multer({ storage: storageAttendance });
const uploadHolidayCalender = multer({ storage: storageHolidayCalender });
const uploadPolicies = multer({ storage: storagePolicy });

routes.post("/add-permission", addPermission);
routes.post("/add-designation", adminAddDesignation);
routes.post("/add-department", adminAddDepartment);
routes.post("/add-role", adminAddRole);
routes.post("/add-admin", addAdmin);
routes.post("/add-leave-type", addLeaveType);
routes.get("/get-departments", getDepartments);
routes.get("/get-designations", getDesignations);
routes.get("/get-roles", getRoles);
routes.get("/get-leaves-type", getLeavesType);
routes.post(
  "/insert-attendance-data",
  isAuthenticate,
  uploadAttendance.single("file"),
  attendance
);
routes.post(
  "/update-thought",
  isAuthenticate,
  uploadThought.single("file"),
  updateThought
);
routes.post(
  "/update-posh-policy",
  isAuthenticate,
  uploadPoshPolicy.single("file"),
  updatePoshPolicy
);
routes.post(
  "/update-holiday-calendar",
  isAuthenticate,
  uploadHolidayCalender.single("file"),
  updateHolidayCalendar
);

routes.post("/update-notice", isAuthenticate, updateNotice);

routes.post(
  "/update-policy",
  isAuthenticate,
  uploadPolicies.array("files"),
  updatePolicy
);

module.exports = routes; 
