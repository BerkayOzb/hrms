import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  CircularProgress,
  FormControl,
  FormGroup,
  FormLabel,
  Stack,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";

import { useAuth } from "../../context/auth";
import { style } from "../adminPanel/employee-management";
import DashboardCard from "../../components/card/DashboardCard";
import { Formik, FieldArray, ErrorMessage } from "formik";
import { File as customFile } from "../../services/Type";
import { APIService } from "../../services/API";
import { useSelector, useDispatch } from "react-redux";
import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../redux/actions/Info";

type policies = {
  file: File;
};

type OrganizationInfoPorps = {
  poshPolicy: string;
  holidayCalendar: string;
  isLoading?: boolean;
  policies: { name: string; file: customFile }[];
};

const validationSchema = Yup.object().shape({
  policies: Yup.array().of(
    Yup.object().shape({
      file: Yup.mixed().required("File is required"),
    })
  ),
});

const OrganizationInfo: React.FC<OrganizationInfoPorps> = ({
  holidayCalendar,
  isLoading = false,
  policies,
}) => {
  const info = useSelector((state: any) => state.info);

  const initialValues = {
    policies:
      // policies?.length > 0
      //   ? policies.map((p) => ({ name: p.name, file: p.file })) :
      [{ file: {} as File }],
  };
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const dispatch = useDispatch();

  // const handleClickPoshPolicy = () => {
  //   setSelectedFile(poshPolicy);
  //   setOpen(true);
  // };

  const handleClickPolicy = (file: string) => {
    setSelectedFile(`${process.env.REACT_APP_API_URL}/${file}`);
    setOpen(true);
  };
  const handleClickHolidayCalendar = () => {
    setSelectedFile(holidayCalendar);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const updatePolicies = async (values: { policies: policies[] }) => {
    dispatch(loading());
    const formData = new FormData();

    values.policies.forEach((policy, index) => {
      formData.append(`files`, policy.file);
    });

    const res = await APIService.updatePolicy(formData);
    dispatch(notLoading());

    if (res.statusCode == "7000") {
      handleCloseModal();
      dispatch(showMessage(res.message));
      setTimeout(() => dispatch(hideMessage()), 3000);
    } else {
      dispatch(showError(res.message));
      setTimeout(() => dispatch(hideError()), 3000);
    }
  };

  return (
    <>
      <DashboardCard
        title="Organization"
        isEditable={user?.role == "admin"}
        handleClick={handleOpenModal}
        isLoading={isLoading}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Grid
            container
            spacing={2}
            justifyContent={"space-around"}
            direction={"column"}
          >
            {policies?.map((p, i) => {
              const fileName = p.name;
              const fileNameWithoutExtension = fileName.split(".")[0];
              const finalFileName = fileNameWithoutExtension.replace(/-/g, " ");
              return (
                <Grid item key={i}>
                  <Typography
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {finalFileName}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleClickPolicy(p.file.path)}
                  >
                    <PictureAsPdfIcon />
                  </Button>
                </Grid>
              );
            })}
            {/* <Grid item>
              <Typography sx={{ fontWeight: "bold" }}>Posh Policy</Typography>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickPoshPolicy}
              >
                <PictureAsPdfIcon />
              </Button>
            </Grid> */}
            <Grid item>
              <Typography sx={{ fontWeight: "bold" }}>
                Holiday Calendar
              </Typography>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickHolidayCalendar}
              >
                <PictureAsPdfIcon />
              </Button>
            </Grid>
          </Grid>
        )}
      </DashboardCard>

      <div>
        <Dialog open={open} onClose={handleClose} fullScreen>
          <DialogTitle>PDF Title</DialogTitle>
          <DialogContent>
            <iframe
              src={`${selectedFile}`}
              width="100%"
              height="600px"
            ></iframe>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...style, overflow: "auto" }}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography sx={{ fontWeight: "bold" }}>Update Policies</Typography>
            <Button onClick={handleCloseModal} sx={{ padding: "0px 0px" }}>
              <CloseIcon />
            </Button>
          </Stack>
          <Typography color={"red"} mb={2}>
            Note: When upload, please upload all policies, because uploading policies will
            replace old policies
            <br />
            File name should be same as you want the name of the policy
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={updatePolicies}
          >
            {({ values, setFieldValue, handleSubmit }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <FieldArray name="policies">
                    {({ push, remove }) => (
                      <FormGroup>
                        {values.policies.map((_, index) => (
                          <Grid
                            container
                            key={index}
                            spacing={2}
                            mb={5}
                            justifyContent={"space-between"}
                          >
                            {/* <Grid item md={4}>
                              <FormControl>
                                <Field
                                  as={TextField}
                                  name={`policies[${index}].name`}
                                  label="Name"
                                />
                                <ErrorMessage
                                  name={`policies[${index}].name`}
                                  component="div"
                                />
                              </FormControl>
                            </Grid> */}
                            <Grid item md={4}>
                              <FormControl>
                                <FormLabel>File</FormLabel>
                                <input
                                  type="file"
                                  name={`policies[${index}].file`}
                                  onChange={(event) => {
                                    const selectedFile = event.currentTarget
                                      .files
                                      ? event.currentTarget.files[0]
                                      : null;
                                    setFieldValue(
                                      `policies[${index}].file`,
                                      selectedFile
                                    );
                                  }}
                                />

                                <ErrorMessage
                                  name={`policies[${index}].file`}
                                  component="div"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={4}>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </Button>
                            </Grid>
                            {/* <Grid item md={12}>
                              {values.policies[index].file && (
                                <>{values.policies[index].file?.filename}</>
                              )}
                            </Grid> */}
                          </Grid>
                        ))}
                        <Button
                          variant="outlined"
                          onClick={() => push({ name: "", file: null })}
                        >
                          Add Policy
                        </Button>
                      </FormGroup>
                    )}
                  </FieldArray>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      startIcon={info.loading ? <CircularProgress /> : null}
                    >
                      Update
                    </Button>
                  </Box>
                </form>
              );
            }}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default OrganizationInfo;
