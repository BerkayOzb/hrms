import React, { useEffect, useState } from "react";
import { capitalize } from "../../../utils/generalUtils";
import UserDetailsCard from "../../../components/card/DetailsCard";
import { CircularProgress } from "@mui/material";
import { formateOfficalDetails } from "../../../utils/formateOfficialDetails";
import { APIService } from "../../../services/API";
import { useDispatch } from "react-redux";
import { showError, hideError } from "../../../redux/actions/Info";

export interface OfficialDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  dateOfJoining: Date;
  department: string;
  designation: string;
  officialEmail: string;
  employeeCode: string;
  location: string;
  reportingManager: string;
  officialContact: string;
  role?: string;
  esic?: string;
  uan?: string;
  grossSalary?: string;
}

type OfficialDetailProps  = {
  userId: string;
}

const OfficialDetail: React.FC<OfficialDetailProps> = ({userId}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [officialDetails, setOfficialDetails] = useState<OfficialDetails>(
    {} as OfficialDetails
  );
    const dispatch = useDispatch()
  useEffect(() => {
    const getDetails = async () => {
      const res = await APIService.getEmployeeOfficialDetails(userId);
      if (res.statusCode == "7000") {
        const formatedData = formateOfficalDetails(
          res.data.userOfficialDetails
        );
        setOfficialDetails(formatedData);
      }else{
        dispatch(showError(res.message));
        setTimeout(() => {
          dispatch(hideError());
        }, 3000);
      }
      setIsLoading(false);
    };
    setIsLoading(true);
    getDetails();

    }, [userId]);

  const officialData = [
    {
      key: "First Name",
      value: officialDetails?.firstName
        ? capitalize(officialDetails?.firstName)
        : " ",
    },
    {
      key: "Last Name",
      value: officialDetails?.lastName
        ? capitalize(officialDetails?.lastName)
        : " ",
    },
    { key: "Employee Code", value: officialDetails?.employeeCode },
    {
      key: "Department",
      value: officialDetails?.department
        ? capitalize(officialDetails?.department)
        : " ",
    },
    {
      key: "Designation",
      value: officialDetails?.designation
        ? capitalize(officialDetails?.designation)
        : " ",
    },
    {
      key: "Reporting Manager",
      value: officialDetails?.reportingManager
        ? capitalize(officialDetails?.reportingManager)
        : "",
    },
    { key: "Official Email", value: officialDetails?.officialEmail },
    { key: "Official Contact", value: officialDetails?.officialContact },
    {
      key: "Date of Joining",
      value: officialDetails?.dateOfJoining?.toLocaleDateString('en-GB'),
    },
    {
      key: "Date of Birth",
      value: officialDetails?.dateOfBirth?.toLocaleDateString('en-GB'),
    },
    {
      key: "Location",
      value: officialDetails?.location
        ? capitalize(officialDetails?.location)
        : " ",
    },
    { key: "UAN Number", value: officialDetails?.uan || "NA" },
    { key: "ESIC Number", value: officialDetails?.esic || "NA" },
    { key: "Gross Salary", value: officialDetails?.grossSalary || "NA" },

  ];

  return isLoading ? (
    <CircularProgress />
  ) : (
    <UserDetailsCard data={officialData} />
  );
};

export default OfficialDetail;
