const { Router } = require("express");
const multer = require("multer");

const { isAuthenticate } = require("../common/helpers/auth");
const {
  addPersonalDetails,
  updatePersonalDetails,
  updateFamilyDetails,
  updateExperienceDetails,
  updateQualificationDetails,
  getEmployeeDetails,
  getEmployeePersonalDetails,
  uploadProfile,
  getAllEmployees,
} = require("../controllers");
const {
  validateUpdateFamilyDetails,
  validatePersonalDetails,
  validateQulaficationDetails,
  validateExperienceDetails,
} = require("../common/validators");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.userData.userid}`);
  },
});

const filter = function (req, file, cb) {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
  limits: { filesize: 1024 * 1024 * 5 },
});

const routes = Router();

routes.post("/add-details", isAuthenticate, addPersonalDetails);
routes.post(
  "/update-personal-details",
  validatePersonalDetails,
  isAuthenticate,
  updatePersonalDetails
);
routes.post(
  "/update-family-details",
  validateUpdateFamilyDetails,
  isAuthenticate,
  updateFamilyDetails
);
routes.post(
  "/update-qualification-details",
  validateQulaficationDetails,
  isAuthenticate,
  updateQualificationDetails
);
routes.post(
  "/update-experience-details",
  validateExperienceDetails,
  isAuthenticate,
  updateExperienceDetails
);
routes.get(
  "/get-employee-official-details/:userId",
  isAuthenticate,
  getEmployeeDetails
);

routes.get(
  "/get-employee-personal-details/:userId",
  isAuthenticate,
  getEmployeePersonalDetails
);

routes.post(
  "/upload-profile",
  isAuthenticate,
  upload.single("profile"),
  uploadProfile
);

routes.get(
  //won't get all users will get only who has personal details
  "/get-all-users",
  isAuthenticate,
  getAllEmployees
);

module.exports = routes;
