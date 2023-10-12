import { PersonalDetails } from "../pages/profile/PersonalDetails";
import { UserPersonDetails } from "../services/Type";

export const formatePersonalDetails = (
  data: UserPersonDetails
): PersonalDetails => {
  const familyData = [];
  if (data?.family_details) {
    for (let i = 0; i < data.family_details.length; i++) {
      const newObj = {
        dob:new Date(data.family_details[i].dob),
        name: data.family_details[i].name,
        relation: data.family_details[i].relation,
      };
      familyData.push(newObj);
    }
  }

  const qualificationData = [];
  if (data?.qualification_details) {
    for (let i = 0; i < data.qualification_details.length; i++) {
      const newObj = {
        specialization: data.qualification_details[i].specialization,
        courseName: data.qualification_details[i].course_name,
        instituteName: data.qualification_details[i].institute_name,
        passingYear:new Date(data.qualification_details[i].passing_year),
      };
      qualificationData.push(newObj);
    }
  }

  const experienceData = [];
  if (data?.experience_details) {
    for (let i = 0; i < data.experience_details.length; i++) {
      const newObj = {
        companyName: data.experience_details[i].company_name,
        doj:new Date(data.experience_details[i].date_of_joining),
        dol:new Date(data.experience_details[i].date_of_leaving),
        position: data.experience_details[i].position,
      };
      experienceData.push(newObj);
    }
  }
  const formatedData = {
    userId: data?.user || null,
    basic: {
      personalEmail: data?.personal_email || 'NA',
      personalContact: data?.contact?.personal_contact || 'NA',
      emergencyContact: data?.contact?.emergency_contact || 'NA',
      permanentAddress: data?.address?.permanent_address || 'NA',
      presentAddress: data?.address?.present_address || 'NA',
      bloodGroup: data?.blood_group || 'NA',
      maritalStatus: data?.marital_status || 'NA',
      profilePhoto: data?.profile_photo 
    },
    family: familyData,
    qualification: qualificationData,
    experience: experienceData,
  };

  return formatedData;
};
