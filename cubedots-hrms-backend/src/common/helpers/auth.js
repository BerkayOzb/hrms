const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");
const { Response } = require("../response-formatter");
const { STATUS_CODE, HTTP_STATUS_CODE } = require("../helpers/response-code");
const { AUTHENTICATION } = require("../helpers/constant");
const { User, Role, Permission } = require("../../../db/models");
const { JWT_KEY: authenticationToken } = require("../../../config/config");
const sendEmail = require("./email");
const { redisClient } = require("./redisClient");

const validateUser = async (token, userId) => {
  let isExist = await redisClient.get(`${token}`);

  if (isExist) {
    const isUser = await User.findById(userId);
    isExist = !isEmpty(isUser);
  }
  return isExist;
};

const removeToken = async (token) => {
  try {
    redisClient.del(`${token}`, (err, reply) => {
      if (err) {
        console.error("Error deleting token from Redis:", err);
      } else {
        console.log("Token deleted successfully from Redis.");
      }
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

// const validateUser = async (token, userId) => {
//   const isUser = await User.findById({ _id: userId });
//   if (isEmpty(isUser)) return false;
//   return true;
// };

const genJWTToken = async (userData, expTime) => {
  const token = jwt.sign(userData, authenticationToken, {
    expiresIn: expTime, 
  });
  await redisClient.set(token, "valid", "EX", expTime);
  return token;
};

const isAuthenticate = async (req, res, next) => {
  let response = Response(
    STATUS_CODE.SUCCESS,
    AUTHENTICATION.SUCCESS,
    false,
    ""
  );
  let hasError = false;
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, authenticationToken);
      const userType = await validateUser(token, decoded.userid);
      if (userType == null) {
        response.statusCode = STATUS_CODE.UNAUTHORIZATION;
        response.message = AUTHENTICATION.INVALID_TOKEN;
        hasError = true;
      } else {
        req.userData = decoded;
      }
    }
  } catch (err) {
    if (err.name == "JsonWebTokenError") {
      response.statusCode = STATUS_CODE.UNAUTHORIZATION;
      response.message = AUTHENTICATION.INVALID_TOKEN;
      hasError = true;
    } else if (err.name == "TokenExpiredError") {
      response.statusCode = STATUS_CODE.EXISTED_VALUE;
      response.message = AUTHENTICATION.TOKEN_EXPIRED;
    } else {
      response.statusCode = STATUS_CODE.SERVER_ERROR;
      response.message = AUTHENTICATION.TOKEN_NOT_FOUND;
    }
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED);

    hasError = true;
  }
  if (hasError) {
    res.send(response);
  } else {
    next();
  }
};

const isAuthorized = async (roleId, permissionId) => {
  try {
    const fetchedRole = await Role.findById({ _id: roleId });
    const fetchedPermission = await Permission.findOne({
      permission_id: permissionId,
    });
    if (isEmpty(fetchedRole) || isEmpty(fetchedPermission)) {
      return false;
    }
    return fetchedRole.permissions.includes(fetchedPermission._id);
  } catch (err) {
    throw err;
  }
};

const sendGeneratedPassword = async (email, newPassword, name) => {
  try {
    // const newPassword = generateRandomPassword();
    const emailParams = {
      email: email,
      name: name,
      password: newPassword,
    };
    await sendEmail(
      email.toLocaleLowerCase(),
      emailParams,
      "hrms password",
      "Cubedots HRMS password",
      `Your Cubedots HRMS password!\nusername: ${email}\npassword: ${newPassword}`
    );
  } catch (err) {
    throw err;
  }
};

module.exports = {
  genJWTToken,
  isAuthenticate,
  isAuthorized,
  sendGeneratedPassword,

  removeToken,
};
