import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APIService } from "../../../services/API";
import EditIcon from "@mui/icons-material/Edit";

import {
  fetchUserDetailsSuccess,
  selectUser,
} from "../../../redux/actions/Users";
import { Box, Button } from "@mui/material";
import { formateOfficalDetails } from "../../../utils/formateOfficialDetails";
import { formatePersonalDetails } from "../../../utils/formatePersonalDetails";
import OfficialDetail from "../../profile/OfficialDetails/OfficialDetail";
import PersonalDetails from "../../profile/PersonalDetails";
import styles from "./styles.module.css";
import { DetailsHeading } from "../../profile";
import CloseIcon from "@mui/icons-material/Close";
import { showError, hideError } from "../../../redux/actions/Info";

type UserInfoProps = {
  handleOpenModal: () => void;
};

const UserInfo: React.FC<UserInfoProps> = ({ handleOpenModal }) => {
  const allUser = useSelector((state: any) => state.users);
  const dispatch = useDispatch();
  // const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      const res = await APIService.getUserDetails(userId);
      if (res.statusCode == "7000") {
        const { userDetails } = res.data;
        const officialDetails = formateOfficalDetails(userDetails);
        const personalDetails = formatePersonalDetails(
          userDetails.personal_details
        );
        dispatch(
          fetchUserDetailsSuccess(userId, {
            official: officialDetails,
            personal: personalDetails,
          })
        );
        // setUserData({
        //   official: officialDetails,
        //   personal: personalDetails,
        // });
      } else {
        dispatch(selectUser(null));
        dispatch(showError(res.message));
        setTimeout(() => {
          dispatch(hideError());
        }, 3000);
      }
    };
    if (allUser.selectedUser) {
      fetchUserData(allUser.selectedUser);
    }
  }, [allUser.selectedUser]);

  return (
    <Box textAlign="center">
      <div style={{ textAlign: "right" }}>
        <Button onClick={() => dispatch(selectUser(null))}>
          <CloseIcon />
        </Button>
      </div>
      <DetailsHeading>Employee Details</DetailsHeading>
      <div style={{ textAlign: "right" }}>
        <Button onClick={handleOpenModal}>
          <EditIcon />
        </Button>
      </div>

      <Box
        bgcolor="background.paper"
        borderRadius={4}
        className={styles.cardContainer}
      >
        <OfficialDetail userId={allUser.selectedUser} />
      </Box>
      <DetailsHeading>Personal Details</DetailsHeading>

      <PersonalDetails userId={allUser.selectedUser} />
    </Box>
  );
};

export default UserInfo;
