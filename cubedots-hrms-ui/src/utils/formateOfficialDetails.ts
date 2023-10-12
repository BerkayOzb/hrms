import { OfficialDetails } from "../pages/profile/OfficialDetails/OfficialDetail";
import { UserPersonDetails } from "../services/Type";

export interface OfficialDataFromDB {
    _id: string;
    date_of_birth: Date;
    date_of_joining: Date;
    department: {
      name: string;
    };
    designation: {
      name: string;
    };
    email: string;
    employee_code: string;
    location: string;
    managerId: {
      name: {
        first_name: string;
        last_name: string;
      };
      email?: string
    };
    name: {
      first_name: string;
      last_name: string;
    };
    official_contact: string;
    role?:{
      name: string;
      _id: string
    },
    esic_number?: string;
    uan_number?: string;
    personal_details?: UserPersonDetails
    gross_salary: string;
  }
  
  export const formateOfficalDetails = (
    data: OfficialDataFromDB
  ): OfficialDetails => {
    const formatedData = {
      firstName: `${data.name?.first_name}`|| 'NA',
      lastName: `${data.name?.last_name}`|| 'NA',
      employeeCode: data.employee_code || 'NA',
      department: data.department?.name || 'NA',
      designation: data.designation?.name || 'NA',
      reportingManager: `${data.managerId?.name?.first_name} ${data.managerId?.name?.last_name}` || 'NA',
      reportingMangerEmail: `${data?.managerId?.email}` || 'NA',
      officialEmail: data.email || 'NA',
      officialContact: data.official_contact || 'NA',
      dateOfJoining:new Date(data.date_of_joining) || 'NA',
      dateOfBirth:new Date(data.date_of_birth) || 'NA',
      location: data.location || 'NA',
      esic: data?.esic_number || "NA",
      uan: data?.uan_number || "NA",
      role: data?.role?.name,
      grossSalary: data.gross_salary
    };
    return formatedData;
  };
  