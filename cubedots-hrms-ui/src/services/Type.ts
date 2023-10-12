import { strict } from "assert";

export interface FamilyDetail {
  name: string;
  dob: Date;
  relation: string;
}

export interface QualificationDetail {
  course_name: string;
  specialization: string;
  institute_name: string;
  passing_year: string;
}

export interface ExperienceDetail {
  company_name: string;
  position: string;
  date_of_joining: string;
  date_of_leaving: string;
}

export interface File {
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface UserPersonDetails {
  user?: string;
  contact: {
    personal_contact: string;
    emergency_contact: string;
  };
  address: {
    present_address: string;
    permanent_address: string;
  };
  personal_email: string;
  blood_group: string;
  marital_status: string;
  family_details: FamilyDetail[];
  qualification_details: QualificationDetail[];
  experience_details: ExperienceDetail[];
  profile_photo?: File;
}

export interface UserOfficialDetailsDB {
  date_of_birth: Date;
  date_of_joining: Date;
  department: string;
  designation: string;
  email: string;
  employee_code?: string;
  location: string;
  managerId: string;
  name: {
    first_name: string;
    last_name: string;
  };
  official_contact: string;
  roleId?: string;
  esic_number?: string;
  uan_number?: string;
  gross_salary: string;
}

export interface User extends UserOfficialDetailsDB {
  personal_details: UserPersonDetails;
}

export interface ApplyLeaveType {
  leaveType: string;
  reason: string;
  startDate: string;
  endDate: string;
  leaveDuration: string;
  status?: boolean;
  approvarRemark?: boolean;
}

export interface LeaveEntry {
  _id: string;
  userId: {
    name: { first_name: string; last_name: string };
    employee_code: string
  };
  status: string;
  startDate: Date;
  endDate: Date;
  // managerId: {
  //   name: {
  //     first_name: string;
  //     last_name: string;
  //   };
  // };
  reason: string;
  leaveDuration: string;
  leaveType: {
    title: string;
  };
  approverRemark: string;
  dayCount: number;
}
