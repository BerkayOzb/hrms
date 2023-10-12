import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { APIService } from "../../services/API";
import {
  notLoading,
  showMessage,
  hideMessage,
  showError,
  hideError,
  loading,
} from "../../redux/actions/Info";
import DashboardCard from "../../components/card/DashboardCard";
import { useAuth } from "../../context/auth";
import { style } from "../adminPanel/employee-management";

type ThoughtProps = {
  file: string;
  isLoading?: boolean;
};
const Thought: React.FC<ThoughtProps> = ({ file, isLoading = false }) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const info = useSelector((state: any) => state.info);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleUpload = async () => {
    if (selectedFile && user) {
      dispatch(loading());
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await APIService.updateThought(formData);
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

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event?.target?.files?.[0] as File);
  };

  return (
    <>
      <DashboardCard
        title="Today's Thought"
        isEditable={user?.role == "admin"}
        handleClick={handleOpenModal}
        isLoading={isLoading}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <img
            src={`${file}?${new Date().getTime()}`}
            width={"100%"}
            height={"100%"}
          />
        )}
      </DashboardCard>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...style }}>
          <Stack spacing={2}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography sx={{ fontWeight: "bold" }}>
                Upload Thought
              </Typography>
              <Button onClick={handleCloseModal}>
                <CloseIcon />
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

export default Thought;
