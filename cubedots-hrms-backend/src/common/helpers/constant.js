module.exports = {
  AUTHENTICATION: {
    SUCCESS: "Token is valid",
    INVALID_TOKEN: "Invalid token. Please login again",
    TOKEN_EXPIRED: "Your session has expired. Please login again",
    TOKEN_NOT_FOUND: "Invalid request. Please login again",
    EXCEPTION:
      "You cannot do any actions now. Please contact our support team.",
    UNAUTHORIZED: "Yor are not authorized to perform this operation.",
  },
  LOGIN: {
    SUCCESS: "Login is successful",
    INVALID_ACCOUNT: " This account doesn't exist. Please sign up",
    INVALID_EMAIL: "You entered an invalid email address",
    UNVERIFIED_MAIL:
      " Please veify your email address. Click here to resend verification code ",
    WRONG_PASS_EMAIL: "Your username or password is wrong",
    EXCEPTION: "Please contact our support team to help",
    PASSWORD_CHANGE_SUCCESS: "Password successfully changed",
    PASSWORD_CHANGE_FAIL: "Password changes failed",
    PASSWORD_MISMATCH: "Password is not corrent",
    RESET_PASS_SUCCESS: "Password reset successfully",
    RESET_PASS_FAILED: "Password reset failed",
    PASSWORD_SEND_SUCCUSS: "We have sent a new password to your email.",
  },
  LOGOUT: {
    SUCCESS: "You have successfully logged out",
    EXCEPTION: "Oops! Something went wrong. Please contact our support team.",
  },
  SIGNUP: {
    SUCCESS: "Your Account registration is successful",
    EMAIL_EXIST: "This email already exists. Please login.",
    RESEND_CODE: "Verification code successfully sent to your email",
    RESEND_PWD: "A new password successfully sent to your email",
    USER_NOT_EXIST: "This user does not exist",
    EXCEPTION:
      "Our system is busy, kindly go back in couple hours for singing up",
  },
  ADMIN: {
    SUCCESSFULLY_ADDED_ROLE: "Role is successfully added",
    SUCCESSFULLY_ADDED_DEPARTMENT: "Department is successfully added",
    SUCCESSFULLY_ADDED_DESIGNATION: "Designation is successfully added",
    DEPARTMENT_EXIST: "Department already exist",
    ROLE_EXIST: "Role already exist",
    ADMIN_EXIST: "Admin already Exist",
    DESIGNATION_EXIST: "Designation already exist",
    SUCCESSFULLY_ADDED_USER: "User is successfully added",
    EMAIL_EXIST: "Email already exist",
    EXCEPTION:
      "Our system is busy, kindly go back in couple hours for singing up",
    ADMIN_VERIFIED: "Admin is verified",
    ADMIN_UNVERIFIED: "Admin is not verified",
    PERMISSION_ADDED_SUCCESSFULLY: "Permission is successfully added",
    PERMISSION_EXIST: "Permission already exist",
  },

  VERIFY_MESSAGE: {
    SUCCESS: "Your account verificaiton is successful.",
    INVALID_PASSCODE: "The verification code is wrong. Please try again",
    EXPIRED_PASSCODE:
      "The verification code has expired. Please again click on Forgot Password",
    EMAIL_NOT_FOUND:
      "You will receive an email in your inbox if this email is registered on Platform.",
    EXCEPTION:
      "It seems you cannot verify your code now, kindly try in a minute",
  },
  USER: {
    SUCCESS: "Your request is successfull",
    UPDATED: "Profile updated successfully",
    NOT_EXIST: "This user does not exist",
    EXCEPTION: "Oops! Something went wrong. Please contact our support team.",
  },

  PERSONAL_DETAILS: {
    FAMILY_DETAILS_UPDATE_SUCCESS: "Family details successfully updated",
    QUALIFICATION_DETAILS_UPDATE_SUCCESS:
      "Qualification details successfully updated",
    EXPERIENCE_DETAILS_UPDATE_SUCCESS:
      "Experience details successfully updated",
    BASIC_DETAILS_NOT_FOUND: "Please fill the basic details first",
  },

  EMPLOYEE: {
    FETCH_DETAILS_SUCCESS: "Successfully fetched the user details",
  },

  VERIFY_STATUS: {
    VERIFIED: "verified",
    UNVERIFIED: "unverified",
  },

  LEAVE: {
    APPLY_SUCCESS: "Successfully applied leaves",
    EDIT_SUCCESSFULLY: "Successfully edited leave request"
  },

  TYPE_LOG: {
    USER: "USER",
    PROJECT: "PROJECT",
    ADMIN: "ADMIN",
  },

  PERMISSION: {
    ADD_USER: 1,
    ADD_DEPARTMENT: 2,
    ADD_DESIGNATION: 3,
    GET_ALL_USERS: 4,
    ADD_ROLE: 5,
    UPDATE_USER: 6,
    SEE_USER_DETAILS: 7,
    ALLOCATE_LEAVES: 8,
    CHANGE_LEAVE_STATUS: 9,
    GET_LEAVES_FO_ALL_USERS: 10,
    UPDATE_ORGANIZATION_DATA: 11,
    UPDATE_NOTICE:12 ,
    GET_ALL_ATTENDANCE:13 ,
    INSERT_ATTENDANCE_DATA: 14

  },

  LEAVE_TYPE: {
    SICK: "64bf620ef67878ca77dbfada",
    ANNUAL: "64bf6207f67878ca77dbfad6",
    COMPENSATORY: "64bf622df67878ca77dbfadd",
  },
  EMAIL_EXIST:"Email already in use",
  EMP_CODE_EXISTED:"Employee code is already exist",
  DEPARTMENT_FETCH_SUCCESS: "Successfully Fetch departments",
  DESIGNATION_FETCH_SUCCESS: "Successfully Fetch designations",
  ROLE_FETCH_SUCCESS: "Successfully Fetch Roles",
  EMPLOYEE_SEARCH_SUCCESS: "Successfully searched employee",
  PROFILE_UPLOAD_SUCCESS: "Successfully uploaded profile picture",
  GET_ALL_USERS_SUCCESS: "Successfully get all users",
  GET_USER: "Successfully fetched users details",
  ALLOCATE_LEAVE_SUCCESS: "Successfully allocated leaves",
  USER_PROFILE_UPDATE_SUCCESS: "User official details successfully updated",
  LEAVE_TYPE_FETCH_SUCCESS: "Leave types fetch success",
  LEAVES_NOT_ALLOCATED: "Your leaves are not allocated yet",
  LEAVES_NOT_FOUND: "Leave data not found",
  NOT_ENOUGH_LEAVE_BALANCE: "You don't have enough leave balance",
  LEAVE_FETCH_SUCCESS: "Successfully fetched leaves",
  LEAVE_BALANCE_FETCH_SUCCESS: "Successfully fetched leave balance",
  LEAVE_APPROVED_LEAVE: "Successfully Approved leave request",
  LEAVE_REJECT_SUCCESS: "Successfully rejected leave request",
  LEAVE_CANCEL_SUCCESS: "Successfully canceled leave request",
  BIRTHDAY_FETCH_SUCCESS: "Successfully fetch upcoming birthdays",
  UPDATE_THOUGHT_SUCCESS: "Successfully updated the thought",
  ORGANIZATION_DATA_FETCH_SUCCESS: "Successfully fetched organization data",
  UPDATE_POSH_POLICY_SUCCESS: "Successfully updated the posh policy",
  UPDATE_POLICY_SUCCESS: "Successfully updated the policies",
  UPDATE_HOLIDAY_CALENDAR_SUCCESS: "Successfully updated the holiday calendar",
  UPDATE_NOTICE_SUCCESS: "Successfully updated the notice",
  AttendanceGetSuccess: "Successully fetched attendance",
  ATTEDANCE_UPLOAD_SUCCESS: "Successfully uploaded attendance data"
};
