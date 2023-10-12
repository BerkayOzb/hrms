import React, { useEffect, useState } from "react";
import { PersonalDetails } from "..";
import UserDetailsCard from "../../../../components/card/DetailsCard";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { APIService } from "../../../../services/API";
import { useAuth } from "../../../../context/auth";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";

import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../../../redux/actions/Info";
import styles from "./styles.module.css";

export type BasicDetailsType = {
  basic: PersonalDetails["basic"];
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetails>>;
  userId: string;
};

const style = {
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
  maxHeight: "90vh",
};
const BasicDetails: React.FC<BasicDetailsType> = ({ basic, userId }) => {
  const { user } = useAuth();
  if (basic == null) {
    return <h1>No data</h1>;
  }

  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const info = useSelector((state: any) => state.info);
  const [imageSrc, setImageSrc] = useState(
    `${process.env.REACT_APP_API_URL}/${basic.profilePhoto?.path}`
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleUpload = async () => {
    if (selectedFile && user) {
      dispatch(loading());
      const formData = new FormData();
      formData.append("profile", selectedFile);
      formData.append("userId", user?.userId);

      const res = await APIService.uploadProfilePhoto(formData);
      dispatch(notLoading());
      if (res.statusCode == "7000") {
        handleCloseModal();
        dispatch(showMessage(res.message));
        setTimeout(() => dispatch(hideMessage()), 3000);
      } else {
        dispatch(showError(res.message));
        setTimeout(() => dispatch(hideError()), 3000);
      }
    }
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event?.target?.files?.[0] as File);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // const handleImageError = () => {
  //   setImageSrc("assets\\images\\profile-photo.jpg");
  // };

  const personalData = [
    {
      key: "Present Address",
      value: basic?.presentAddress,
    },
    { key: "Permanent Address", value: basic?.permanentAddress },
    { key: "Personal Email", value: basic?.personalEmail },

    {
      key: "Personal Contact",
      value: basic?.personalContact,
    },
    {
      key: "Emergency Contact",
      value: basic?.emergencyContact,
    },
    { key: "Marital Status", value: basic?.maritalStatus },

    { key: "Blood Group", value: basic?.bloodGroup },
  ];
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} md={2} alignContent={"flex-start"}>
          <Box
            className={styles.profileImageCard}
            alignItems="center"
            flexDirection="column"
            display="flex"
          >
            {userId === user?.userId  && (
              <Button
                sx={{ position: "absolute", top: "0", right: "0" }}
                onClick={() => userId === user?.userId && handleOpenModal()}
              >
                <EditIcon />
              </Button>
            )}
            <Typography className={styles.detail_keys}>
              Profile Photo
            </Typography>

            <Avatar
              src={`${imageSrc}?${new Date().getTime()}`}
              alt={`${user?.name?.first_name}`}
              style={{
                width: "120px",
                height: "120px",
                marginBottom: "16px",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={10}>
          <UserDetailsCard data={personalData} />
        </Grid>
      </Grid>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...style }}>
          <Stack spacing={2}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography sx={{ fontWeight: "bold" }}>
                Upload Profile Picture
              </Typography>
              <Button onClick={handleCloseModal}>
                <CancelIcon />
              </Button>
            </Stack>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleSelectFile}
            />
            <Stack direction={"row"} spacing={1}>
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                  Select File
                </Button>
              </label>
              <Button
                variant="contained"
                component="span"
                disabled={selectedFile == null}
                onClick={handleUpload}
                startIcon={info.loading ? <CircularProgress size={20} /> : null}
              >
                Upload
              </Button>
            </Stack>
            <div>
              {previewUrl && (
                <img
                  style={{ height: "200px", width: "200px" }}
                  src={previewUrl}
                  alt="preview"
                />
              )}
            </div>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default BasicDetails;
