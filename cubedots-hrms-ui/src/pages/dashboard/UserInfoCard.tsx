import React from "react";
import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { OfficialDataFromDB } from "../../utils/formateOfficialDetails";
import DashboardCard from "../../components/card/DashboardCard";
type UserInfoCardProps = {
  userData: OfficialDataFromDB;
};
const UserInfoCard: React.FC<UserInfoCardProps> = ({ userData }) => {
  const userState = useSelector((state: any) => state.user);
  const userMetaData = [
    { key: "Employee Code", value: userData?.employee_code },
    { key: "Reporting To", value: userData?.managerId?.name.first_name },
    { key: "Department", value: userData?.department?.name },
    { key: "Designtion", value: userData?.designation?.name },
    { key: "Location", value: userData?.location },
    // { key: "Blood Group", value: userData?.personal_details?.blood_group },
  ];

  return (
    <DashboardCard title="My Details" isLoading={userState.loading}>
      {userState.loading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
          <Avatar
            src={`${process.env.REACT_APP_API_URL}/${
              userData?.personal_details?.profile_photo?.path
            }?${new Date().getTime()}`}
            alt={`${userData?.name?.first_name}`}
            style={{
              width: "120px",
              height: "120px",
            }}
          />
          <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
            {`${userData?.name?.first_name} ${userData?.name?.last_name}`}
          </Typography>
          {userMetaData.map((item, index) => (
            <Typography key={index}>
              <Box component="span">{`${item.key}:`} </Box>
              <Box
                component="span"
                fontWeight="bold"
                sx={{ textTransform: "capitalize" }}
              >
                {`${item.value}`}
              </Box>
            </Typography>
          ))}
        </Box>
      )}
    </DashboardCard>
  );
};

export default UserInfoCard;
