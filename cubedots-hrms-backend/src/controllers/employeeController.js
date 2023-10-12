const { isEmpty } = require("lodash");
const { User, UserPersonalDetails } = require("../../db/models");
const {
  LOGOUT,
  USER,
  TYPE_LOG,
  AUTHENTICATION,
  PERSONAL_DETAILS,
  EMPLOYEE,
  PROFILE_UPLOAD_SUCCESS,
  GET_ALL_USERS_SUCCESS,
  PERMISSION,
} = require("../common/helpers/constant");
const logger = require("../common/helpers/logger");
const { STATUS_CODE } = require("../common/helpers/response-code");
const { Response, systemError } = require("../common/response-formatter");
const { File } = require("../../db/models/userPersonalDetail");
const { isAuthorized } = require("../common/helpers/auth");
const { updateUser } = require("./userController");

const addPersonalDetails = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, USER.UPDATED, "");
  const { userid: tokenContainedId } = req.userData;
  const {
    userId,
    profile_photo,
    contact,
    personal_email,
    address,
    // family_details,
    marital_status,
    blood_group,
  } = req.body;

  try {
    if (userId !== tokenContainedId) {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = AUTHENTICATION.UNAUTHORIZED;
    } else {
      const details = {
        user: userId,
        profile_photo: profile_photo,
        contact: {
          personal_contact: contact.personal_contact,
          emergency_contact: contact.emergency_contact,
        },
        personal_email: `${personal_email}`,
        address: {
          permanent_address: address.permanent_address,
          temporary_address: address.temporary_address,
        },
        marital_status: `${marital_status}`,
        blood_group: `${blood_group}`,
      };
      await UserPersonalDetails.create(details);
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "User cannot edit person details: ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updatePersonalDetails = async (req, res) => {
  console.log(req.body);
  let {
    userId,
    profile_photo = {},
    contact,
    personal_email,
    address,
    marital_status,
    blood_group,
  } = req.body;

  let response = Response(STATUS_CODE.SUCCESS, USER.UPDATED, "");
  try {
    const { userid: tokenContainedId, role: adminRole } = req.userData;
    const authorized = await isAuthorized(adminRole, PERMISSION.UPDATE_USER);
    if (tokenContainedId !== userId && !authorized) {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = AUTHENTICATION.UNAUTHORIZED;
    } else {
      const existedUser = await UserPersonalDetails.findOne({ user: userId });
      let updatedUser = {};
      if (isEmpty(existedUser)) {
        const details = {
          user: userId,
          profile_photo: profile_photo,
          contact: {
            personal_contact: contact?.personal_contact,
            emergency_contact: contact?.emergency_contact,
          },
          personal_email: `${personal_email}`,
          address: {
            permanent_address: address?.permanent_address,
            present_address: address?.present_address,
          },
          marital_status: `${marital_status}`,
          blood_group: `${blood_group}`,
        };
        updatedUser = await UserPersonalDetails.create(details);
        const officialUser = await User.findByIdAndUpdate(
          { _id: userId },
          { personal_details: updatedUser._id },
          { new: true }
        );
      } else {
        personal_email = personal_email || existedUser.personal_email;
        marital_status = marital_status || existedUser.marital_status;
        blood_group = blood_group || existedUser.blood_group;
        emergency_contact =
          contact?.emergency_contact || existedUser.contact.emergency_contact;
        personal_contact =
          contact?.personal_contact || existedUser.contact.personal_contact;

        permanent_address =
          address?.permanent_address || existedUser.address.permanent_address;
        present_address =
          address?.present_address || existedUser.address.present_address;

        updatedUser = await UserPersonalDetails.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              address: {
                present_address: present_address,
                permanent_address: permanent_address,
              },
              personal_email: personal_email,
              blood_group: blood_group,
              marital_status: marital_status,
              contact: {
                emergency_contact: emergency_contact,
                personal_contact: personal_contact,
              },
            },
          },
          {
            returnOriginal: false, // return the updated document
          }
        );
      }
      response.data = {
        updatedInfo: updatedUser,
      };
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to update user personal details ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updateFamilyDetails = async (req, res) => {
  const { userId, family_details } = req.body;

  let response = Response(
    STATUS_CODE.SUCCESS,
    PERSONAL_DETAILS.FAMILY_DETAILS_UPDATE_SUCCESS,
    ""
  );
  try {
    const { userid: tokenContainedId, role: adminRole } = req.userData;
    const authorized = await isAuthorized(adminRole, PERMISSION.UPDATE_USER);
    if (tokenContainedId !== userId && !authorized) {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = AUTHENTICATION.UNAUTHORIZED;
    } else {
      const existedUser = await UserPersonalDetails.findOne({ user: userId });
      if (isEmpty(existedUser)) {
        (response.statusCode = STATUS_CODE.NOT_FOUND),
          (response.message = PERSONAL_DETAILS.BASIC_DETAILS_NOT_FOUND);
      } else {
        const updatedUser = await UserPersonalDetails.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              family_details: family_details,
            },
          },
          {
            returnOriginal: false, // return the updated document
          }
        );
        response.data = {
          updatedInfo: updatedUser,
        };
      }
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to update user family details ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updateQualificationDetails = async (req, res) => {
  const { userId, qualification_details } = req.body;
  let response = Response(
    STATUS_CODE.SUCCESS,
    PERSONAL_DETAILS.QUALIFICATION_DETAILS_UPDATE_SUCCESS,
    ""
  );
  try {
    const { userid: tokenContainedId, role: adminRole } = req.userData;
    const authorized = await isAuthorized(adminRole, PERMISSION.UPDATE_USER);
    if (tokenContainedId !== userId && !authorized) {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = AUTHENTICATION.UNAUTHORIZED;
    } else {
      const existedUser = await UserPersonalDetails.findOne({ user: userId });
      if (isEmpty(existedUser)) {
        (response.statusCode = STATUS_CODE.NOT_FOUND),
          (response.message = PERSONAL_DETAILS.BASIC_DETAILS_NOT_FOUND);
      } else {
        const updatedUser = await UserPersonalDetails.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              qualification_details: qualification_details,
            },
          },
          {
            returnOriginal: false, // return the updated document
          }
        );
        response.data = {
          updatedInfo: updatedUser,
        };
      }
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to update user qualifications details ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const updateExperienceDetails = async (req, res) => {
  const { userId, experience_details } = req.body;

  let response = Response(
    STATUS_CODE.SUCCESS,
    PERSONAL_DETAILS.EXPERIENCE_DETAILS_UPDATE_SUCCESS,
    ""
  );
  try {
    const { userid: tokenContainedId, role: adminRole } = req.userData;
    const authorized = await isAuthorized(adminRole, PERMISSION.UPDATE_USER);
    if (tokenContainedId !== userId && !authorized) {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = AUTHENTICATION.UNAUTHORIZED;
    } else {
      const existedUser = await UserPersonalDetails.findOne({ user: userId });
      if (isEmpty(existedUser)) {
        (response.statusCode = STATUS_CODE.NOT_FOUND),
          (response.message = PERSONAL_DETAILS.BASIC_DETAILS_NOT_FOUND);
      } else {
        const updatedUser = await UserPersonalDetails.findOneAndUpdate(
          { user: userId },
          {
            $set: {
              experience_details: experience_details,
            },
          },
          {
            returnOriginal: false,
          }
        );
        response.data = {
          updatedInfo: updatedUser,
        };
      }
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to update user expeience details ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getEmployeeDetails = async (req, res) => {
  const userId = req.params.userId;
  let response = Response(
    STATUS_CODE.SUCCESS,
    EMPLOYEE.FETCH_DETAILS_SUCCESS,
    ""
  );
  try {
    const { userid: tokenContainedId, role: adminRole } = req.userData;
    console.log(tokenContainedId, userId);
    const authorized = await isAuthorized(adminRole, PERMISSION.GET_ALL_USERS);
    if (tokenContainedId !== userId && !authorized) {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = AUTHENTICATION.UNAUTHORIZED;
    } else {
      const fetchedUser = await User.findById({ _id: userId })
        .populate([
          { path: "department", select: "name -_id" },
          { path: "designation", select: "name -_id" },
          { path: "managerId", select: "name -_id" },
        ])
        .select("-password -_id -createdAt -updatedAt -role");

      console.log(fetchedUser);
      response.data = {
        userOfficialDetails: fetchedUser,
      };
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to update user official details ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getEmployeePersonalDetails = async (req, res) => {
  const userId = req.params.userId;
  let response = Response(
    STATUS_CODE.SUCCESS,
    EMPLOYEE.FETCH_DETAILS_SUCCESS,
    ""
  );
  try {
    const { userid: tokenContainedId, role: adminRole } = req.userData;
    const authorized = await isAuthorized(adminRole, PERMISSION.GET_ALL_USERS);

    if (tokenContainedId !== userId && !authorized) {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = AUTHENTICATION.UNAUTHORIZED;
    } else {
      const fetchedUser = await UserPersonalDetails.findOne({
        user: userId,
      }).select(" -_id -createdAt -updatedAt ");

      console.log(fetchedUser, "profiel photo");
      response.data = {
        userPersonalDetails: fetchedUser,
      };
    }
  } catch (err) {
    logger.error(
      TYPE_LOG.USER,
      "Exception: Failed to get user personal details ",
      err.stack
    );
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const uploadProfile = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, PROFILE_UPLOAD_SUCCESS, "");
  const { userId } = req.body;
  console.log(req.file);
  try {
    const file = {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    };

    const { userid: tokenContainedId } = req.userData;
    if (tokenContainedId !== userId) {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = AUTHENTICATION.UNAUTHORIZED;
    } else {
      const res = await UserPersonalDetails.findOneAndUpdate(
        { user: userId },
        { profile_photo: file },
        { new: true }
      );
      response.data = {
        updated: res,
      };
    }
  } catch (err) {
    logger.error(TYPE_LOG.USER, "Can't upload profile ", err.stack);
    response = systemError(USER.EXCEPTION);
  }
  res.send(response);
};

const getAllEmployees = async (req, res) => {
  let response = Response(STATUS_CODE.SUCCESS, GET_ALL_USERS_SUCCESS, "");
  try {
    const { role } = req.userData;
    const authorized = await isAuthorized(role, PERMISSION.GET_ALL_USERS);
    if (authorized) {
      const fetchedUsers = await UserPersonalDetails.find()
        .populate("user", "email name employee_code")
        .select("user profile_photo");

      response.data = {
        users: fetchedUsers,
      };
    } else {
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

module.exports = {
  addPersonalDetails,
  updatePersonalDetails,
  updateFamilyDetails,
  updateExperienceDetails,
  updateQualificationDetails,
  getEmployeeDetails,
  getEmployeePersonalDetails,
  uploadProfile,
  getAllEmployees,
};
