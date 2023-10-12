import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/actions/User";
import UserInfoCard from "./UserInfoCard";
import { Grid } from "@mui/material";
import IncomingAnniverseries from "./Annivarsary";
import IncomingBirthdays from "./Birthday";
import NoticeBoard from "./NoticeBoard";
import OrganizationInfo from "./OrganizationInfo";
import Thought from "./Thought";
import { APIService } from "../../services/API";
import { showError, hideError } from "../../redux/actions/Info";

const Dashboards: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const userState = useSelector((state: any) => state.user);
  const [organizationData, setOrganizationData] = useState<any>();

  const getOrgData = async () => {
    const res = await APIService.getOrganizationData();
    setIsLoading(false);

    if (res.statusCode == "7000") {
      setOrganizationData(res.data.organization);
    } else {
      dispatch(showError(res.message));
      setTimeout(() => {
        dispatch(hideError());
      }, 3000);
    }
  };
  useEffect(() => {
    if (user) {
      dispatch<any>(fetchUser(user?.userId));
    }
    setIsLoading(true);
    getOrgData();
  }, []);

  return (
    <Grid container spacing={1} width={1000} justifyContent={"center"}>
      <Grid item xs={12} sm={6} md={4}>
        <IncomingBirthdays />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <UserInfoCard userData={userState.user} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <NoticeBoard
          notices={organizationData?.notice}
          setOrganizationData={setOrganizationData}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <IncomingAnniverseries />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Thought
          file={`${process.env.REACT_APP_API_URL}/${organizationData?.thought?.path}`}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <OrganizationInfo
          poshPolicy={`${process.env.REACT_APP_API_URL}/${organizationData?.poshPolicy?.path}`}
          holidayCalendar={`${process.env.REACT_APP_API_URL}/${organizationData?.holidayCalendar?.path}`}
          isLoading={isLoading}
          policies={organizationData?.policies}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboards;
