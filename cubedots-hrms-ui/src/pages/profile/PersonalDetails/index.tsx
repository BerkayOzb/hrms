import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useAuth } from "../../../context/auth";
import { formatePersonalDetails } from "../../../utils/formatePersonalDetails";
import BasicDetails from "./BasicDetails";
import { Button, CircularProgress, Modal } from "@mui/material";
import QualificationDetails from "./QualificationDetails";
import EditBasicDetails from "./BasicDetails/EditBasicDetails";
import FamilyDetails from "./FamilyDetails";
import { APIService } from "../../../services/API";

import EditFamilyDetails from "./FamilyDetails/EditFamilyDetails";
import ExperienceDetails from "./ExperienceDetails";
import EditExperienceDetails from "./ExperienceDetails/EditExperienceDetails";
import EditQualificationDetails from "./QualificationDetails/EditQualificationDetails";
import EditIcon from "@mui/icons-material/Edit";
import "./styles.css";
import { TabContext, TabPanel } from "@mui/lab";
import { File } from "../../../services/Type";

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 2,
  pb: 3,
  // maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "auto",
  maxHeight: "80vh",
};

export interface PersonalDetails {
  basic: {
    personalEmail: string;
    personalContact: string;
    emergencyContact: string;
    permanentAddress: string;
    presentAddress: string;
    bloodGroup: string;
    maritalStatus: string;
    profilePhoto?: File;
  };

  family: {
    dob: Date;
    name: string;
    relation: string;
  }[];

  qualification: {
    specialization: string;
    courseName: string;
    instituteName: string;
    passingYear: Date;
  }[];

  experience: {
    companyName: string;
    doj: Date;
    dol: Date;
    position: string;
  }[];
}

type PersonalDetailsProps = {
  userId: string;
};

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("0");
  const { user } = useAuth();
  const [personlDetails, setPersonalDetails] = useState<PersonalDetails>(
    {} as PersonalDetails
  );

  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await APIService.getUserPersonalDetails(userId);
      if (response.statusCode == "7000") {
        if (response.data.userPersonalDetails) {
          const formatedData = formatePersonalDetails(
            response.data.userPersonalDetails
          );
          setPersonalDetails(formatedData);
        } else {
          setPersonalDetails({} as PersonalDetails);
        }
      }
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchData();
  }, [userId]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(`${newValue}`);
  };

  return (
    <Box sx={{ width: "100%", justifyContent: "center" }}>
      <TabContext value={`${activeTab}`}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flexGrow={1}>
            <Tabs
              value={activeTab}
              onChange={handleChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="secondary"
            >
              <Tab label="Basic Details" value="0" />
              <Tab label="Family Details" value="1" />
              <Tab label="Qualification Details" value="2" />
              <Tab label="Experience Details" value="3" />
            </Tabs>
          </Box>

          <Box>
            {(userId === user?.userId || user?.role == "admin") && (
              <Button onClick={handleOpenModal}>
                <EditIcon />
              </Button>
            )}
          </Box>
        </Box>
        <TabPanel value={`0`}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <BasicDetails
              basic={personlDetails.basic}
              setPersonalDetails={setPersonalDetails}
              userId={userId}
            />
          )}
        </TabPanel>
        <TabPanel value={`1`}>
          <FamilyDetails family={personlDetails.family} />
        </TabPanel>
        <TabPanel value={`2`}>
          <QualificationDetails qualification={personlDetails.qualification} />
        </TabPanel>
        <TabPanel value={`3`}>
          <ExperienceDetails experience={personlDetails.experience} />
        </TabPanel>
      </TabContext>
      <React.Fragment>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...modalStyle }}>
            {activeTab == "0" && (
              <EditBasicDetails
                userId={userId}
                initialValues={personlDetails.basic}
                handleCloseModal={handleCloseModal}
                setPersonalDetails={setPersonalDetails}
              />
            )}
            {activeTab == "1" && (
              <EditFamilyDetails
                userId={userId}
                initialValues={{ family: personlDetails.family }}
                handleCloseModal={handleCloseModal}
                setPersonalDetails={setPersonalDetails}
              />
            )}
            {activeTab == "2" && (
              <EditQualificationDetails
                userId={userId}
                initialValues={{ qualification: personlDetails.qualification }}
                handleCloseModal={handleCloseModal}
                setPersonalDetails={setPersonalDetails}
              />
            )}
            {activeTab == "3" && (
              <EditExperienceDetails
                userId={userId}
                initialValues={{ experience: personlDetails.experience }}
                handleCloseModal={handleCloseModal}
                setPersonalDetails={setPersonalDetails}
              />
            )}
            <Button onClick={handleCloseModal} fullWidth>
              Cancel
            </Button>
          </Box>
        </Modal>
      </React.Fragment>
    </Box>
  );
};
export default PersonalDetails;
