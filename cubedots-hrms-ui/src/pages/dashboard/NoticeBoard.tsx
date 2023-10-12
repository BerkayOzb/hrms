import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { style } from "../adminPanel/employee-management";
import { Formik, FieldArray, Field, Form } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as Yup from "yup";
import { APIService } from "../../services/API";
import { useDispatch, useSelector } from "react-redux";
import {
  loading,
  showMessage,
  hideMessage,
  showError,
  hideError,
  notLoading,
} from "../../redux/actions/Info";
import CloseIcon from "@mui/icons-material/Close";
import DashboardCard from "../../components/card/DashboardCard";

const validationSchema = Yup.object().shape({
  notices: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Notice title is required"),
        details: Yup.string().required("Notice details are required"),
      })
    )
    .min(1, "At least one notice is required"),
});

type NoticeProps = {
  notices: { name: string; details: string }[];
  setOrganizationData: React.Dispatch<any>;
  isLoading?: boolean;
};

const initialValues = {
  notices: [{ name: "add title of notice", details: "add details of notice" }],
};

const NoticeBoard: React.FC<NoticeProps> = ({
  notices,
  setOrganizationData,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const info = useSelector((state: any) => state.info);
  const [selectedNotice, setSelectedNotice] = useState<{
    name: string;
    details: string;
  } | null>(null);

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
    setOpenModal(false);
  };

  const handleFormSubmit = async (values: {
    notices: { name: string; details: string }[];
  }) => {
    dispatch(loading());
    const res = await APIService.udpateNotice(values.notices);
    dispatch(notLoading());
    if (res.statusCode == "7000") {
      handleCloseModal();
      setOrganizationData(res.data.organization);
      dispatch(showMessage(res.message));
      setTimeout(() => dispatch(hideMessage()), 3000);
    } else {
      dispatch(showError(res.message));
      setTimeout(() => dispatch(hideError()), 3000);
    }
    handleCloseModal();
  };

  useEffect(() => {
    initialValues.notices = notices;
  }, [notices]);

  const handleNoticeClick = (notice: { name: string; details: string }) => {
    setSelectedNotice(notice);
  };

  return (
    <>
      <DashboardCard
        title="Annoucements"
        isEditable={user?.role == "admin"}
        handleClick={handleOpenModal}
        isLoading={isLoading}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <List sx={{width:"100%", overflow:"auto"}}>
            {notices?.map((notice, index) => (
              <ListItem
                key={index}
                onClick={() => handleNoticeClick(notice)}
                button
              >
                <ListItemText primary={notice.name} />
              </ListItem>
            ))}
          </List>
        )}
      </DashboardCard>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...style, overflow: "auto" }}>
          <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
            <Typography sx={{ fontWeight: "bold" }}>Update Notice</Typography>
            <Button onClick={handleCloseModal}>
              <CloseIcon />
            </Button>
          </Stack>

          <Formik
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            validationSchema={validationSchema}
          >
            {(formik) => {
              return (
                <Form>
                  <FieldArray name="notices">
                    {({ push, remove }) => (
                      <>
                        {formik.values.notices?.map((notice, index) => (
                          <Stack
                            key={index}
                            direction={"row"}
                            spacing={1}
                            mb={2}
                          >
                            <Field
                              as={TextField}
                              fullWidth
                              name={`notices.${index}.name`}
                              label={`Notice ${index + 1} Title`}
                              // error={Boolean(
                              //   formik.errors?.notices?.[index]?.name
                              // )}
                              // helperText={formik.errors.notices?.[index]?.name}
                            />
                            <Field
                              as={TextField}
                              fullWidth
                              name={`notices.${index}.details`}
                              label={`Notice ${index + 1} Details`}
                              // error={Boolean(
                              //   formik.errors.notices?.[index]?.details
                              // )}
                              // helperText={
                              //   formik.errors.notices?.[index]?.details
                              // }
                            />
                            <IconButton onClick={() => remove(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        ))}

                        <Button
                          type="button"
                          onClick={() => push({ name: "", details: "" })}
                          variant="outlined"
                          startIcon={<AddCircleIcon />}
                          fullWidth
                        >
                          Add Notice
                        </Button>
                      </>
                    )}
                  </FieldArray>
                  {formik.errors?.notices && (
                    <Typography color="error">
                      Please fill all the fields
                    </Typography>
                  )}
                  {formik.values?.notices?.length === 0 && (
                    <Typography color="error">
                      At least one notice is required
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    startIcon={
                      info.loading ? (
                        <CircularProgress color="secondary" size={20} />
                      ) : null
                    }
                  >
                    Save
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Modal>

      <Dialog
        open={selectedNotice != null}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        {selectedNotice && (
          <>
            <DialogTitle>
              {selectedNotice.name}
              <IconButton
                aria-label="Close"
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  right: "8px",
                  top: "8px",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography>{selectedNotice.details}</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default NoticeBoard;
