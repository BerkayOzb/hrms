/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
  ApplyLeaveType,
  ExperienceDetail,
  FamilyDetail,
  QualificationDetail,
  UserOfficialDetailsDB,
  UserPersonDetails,
} from "./Type";

interface APIService {
  login: (data: any) => Promise<any>;
  verifyUser: () => Promise<any>;
  logout: () => Promise<any>;
  getUserPersonalDetails: (userId: string) => Promise<any>;
  getEmployeeOfficialDetails: (userId: any) => Promise<any>;
  updatePersonalDetails: (
    userId: string,
    data: UserPersonDetails
  ) => Promise<any>;
  updateFamilyDetails: (userId: string, data: FamilyDetail) => Promise<any>;
  updateExperienceDetails: (
    userId: string,
    data: ExperienceDetail
  ) => Promise<any>;
  updateQualificationDetails: (
    userId: string,
    data: QualificationDetail
  ) => Promise<any>;
  getDepartments: () => Promise<any>;
  getDesignations: () => Promise<any>;
  getRoles: () => Promise<any>;
  getUsers: () => Promise<any>;
  getAllUsers: () => Promise<any>;
  searchUser: (serachTerm: string) => Promise<any>;
  addUser: (data: UserOfficialDetailsDB) => Promise<any>;
  uploadProfilePhoto: (data: FormData) => Promise<any>;
  getUserDetails: (userId: string) => Promise<any>;
  updateUserOfficialDetails: (
    userId: string,
    data: UserOfficialDetailsDB
  ) => Promise<any>;
  addDepartment: (title: string) => Promise<any>;
  addDesignation: (title: string) => Promise<any>;
  getLeaveBalance: () => Promise<any>;
  applyLeave: (data: ApplyLeaveType) => Promise<any>;
  editLeave: (data: ApplyLeaveType) => Promise<any>;
  getLeavesType: () => Promise<any>;
  getLeaves: () => Promise<any>;
  cancelLeave: (leaveId: string) => Promise<any>;
  getUsersLeaveBalance: () => Promise<any>;
  allocateLeaves: (data: any) => Promise<any>;
  getLeaveRequests: () => Promise<any>;
  changeLeaveStatus: (data: any) => Promise<any>;
  changePassword: (data: any) => Promise<any>;
  sendPinCode: (data: any) => Promise<any>;
  verifyPinCode: (data: any) => Promise<any>;
  resetPassword: (data: any) => Promise<any>;
  getUpcomingBirthdays: () => Promise<any>;
  getUpcomingAnniversary: () => Promise<any>;
  getOrganizationData: () => Promise<any>;
  updateThought: (data: FormData) => Promise<any>;
  updatePolicy: (data: FormData) => Promise<any>;
  getAttendance: (startDate: Date, endDate: Date) => Promise<any>;
  getAllAttendance: (startDate: Date, endDate: Date) => Promise<any>;
  insertAttendance: (data: FormData) => Promise<any>;
  getLeaveByDate: (date: string) => Promise<any>;
  getUserLeaveByDate: (data: { date: string; empCode: string }) => Promise<any>;
  udpateNotice: (data: {name: string, details:string}[]) => Promise<any>;
}

export const APIService: APIService = {

  login: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        data,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  verifyUser: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/verify-user`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  logout: async () => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getUserPersonalDetails: async (userId) => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/employee/get-employee-personal-details/${userId}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
            return {
        message: error.response.data.message,
      };
    }
  },

  updatePersonalDetails: async (userId: string, data: UserPersonDetails) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/employee/update-personal-details`,
        { userId: userId, ...data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  updateFamilyDetails: async (userId: string, data: FamilyDetail) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/employee/update-family-details`,
        { userId: userId, family_details: data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  updateExperienceDetails: async (userId: string, data: ExperienceDetail) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/employee/update-experience-details`,
        { userId: userId, experience_details: data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  updateQualificationDetails: async (
    userId: string,
    data: QualificationDetail
  ) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/employee/update-qualification-details`,
        { userId: userId, qualification_details: data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getDepartments: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/get-departments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getDesignations: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/get-designations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getRoles: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/get-roles`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getUsers: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getAllUsers: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/employee/get-all-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  searchUser: async (searchTerm: string) => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/search-user/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  addUser: async (data: UserOfficialDetailsDB) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/add-user`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  uploadProfilePhoto: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/employee/upload-profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/form",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getUserDetails: async (userId) => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-user-details/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  updateUserOfficialDetails: async (userId, data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/update-user`,
        { userId: userId, ...data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getEmployeeOfficialDetails: async (userId) => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/employee/get-employee-official-details/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  addDepartment: async (title) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/add-department`,
        { name: title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      console.log(error);
      return {
        message: error.response.data.message,
      };
    }
  },

  addDesignation: async (title) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/add-designation`,
        { name: title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      console.log(error);
      return {
        message: error.response.data.message,
      };
    }
  },

  getLeavesType: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/get-leaves-type`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getLeaveBalance: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-leave-balance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  applyLeave: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/apply-leave`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  editLeave: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/update-leave`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getLeaves: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-leaves`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  cancelLeave: async (leaveId) => {
    try {
      const apiResponse = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/cancel-leave-request/${leaveId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getUsersLeaveBalance: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-all-users-leave-balance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  allocateLeaves: async (data) => {
    try {
      const apiResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/allocate-leaves`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getLeaveRequests: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-all-users-leave-request`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  changeLeaveStatus: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/update-leave-status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  changePassword: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/change-password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      console.log(error);
      return {
        message: error.response.data.message,
      };
    }
  },

  sendPinCode: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/send-pin`,
        data
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  verifyPinCode: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/verify-pin`,
        data
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  resetPassword: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/reset-password`,
        data
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getUpcomingBirthdays: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-upcoming-birthdays`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {

      return {
        message: error.response.data.message,
      };
    }
  },

  getUpcomingAnniversary: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-upcoming-anniversary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getOrganizationData: async () => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-organization-data`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  updateThought: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/update-thought`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/form",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  updatePolicy: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/update-policy`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/form",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  }, 

  getAttendance: async (startDate, endDate) => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-attendance`,
        {
          params: { startDate: startDate, endDate: endDate },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/form",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getAllAttendance: async (startDate, endDate) => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-all-attendance`,
        {
          params: { date: startDate, startDate: startDate, endDate: endDate },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/form",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  insertAttendance: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/insert-attendance-data`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/form",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getLeaveByDate: async (date) => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-leave-by-date`,
        {
          params: { date: date },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/form",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  getUserLeaveByDate: async ({ date, empCode }) => {
    try {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/get-user-leave-by-date`,
        {
          params: { date: date, empCode: empCode },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/form",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },

  udpateNotice: async (data) => {
    try {
      const apiResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/update-notice`,
        { notice: data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return apiResponse.data;
    } catch (error: any) {
      return {
        message: error.response.data.message,
      };
    }
  },
};
