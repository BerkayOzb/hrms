import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  MenuItem,
  Select,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import { PersonalDetails } from "..";
import { useAuth } from "../../../../context/auth";
import { UserPersonDetails } from "../../../../services/Type";
import { APIService } from "../../../../services/API";
import { useDispatch, useSelector } from "react-redux";
import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../../../redux/actions/Info";
import { formatePersonalDetails } from "../../../../utils/formatePersonalDetails";

const validationSchema = Yup.object({
  personalEmail: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  personalContact: Yup.string()
    .required("Personal Contact is required")
    .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
  emergencyContact: Yup.string()
    .required("Emergency Contact is required")
    .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits")
    .test(
      "not-equal",
      "Personal and Emergency Contact numbers should not be the same",
      function (value) {
        const personalContact = this.parent.personalContact;
        return value !== personalContact;
      }
    ),
  permanentAddress: Yup.string().required("Permanent Address is required"),
  presentAddress: Yup.string().required("Present Address is required"),
  maritalStatus: Yup.string()
    .oneOf(
      ["married", "unmarried", "widowed", "divorced"],
      "Invalid Marital Status"
    )
    .required("Marital Status is required"),
  bloodGroup: Yup.string().required("Blood Group is required"),
});

const defaultValues = {
  personalEmail: "",
  personalContact: "",
  emergencyContact: "",
  permanentAddress: "",
  presentAddress: "",
  bloodGroup: "",
  maritalStatus: "",
};

type EditBasicDetailsProps = {
  userId: string;
  initialValues: PersonalDetails["basic"];
  handleCloseModal: () => void;
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetails>>;
};

const EditBasicDetails: React.FC<EditBasicDetailsProps> = ({
  userId,
  initialValues,
  handleCloseModal,
  setPersonalDetails,
}) => {
  const { user } = useAuth();
  const info = useSelector((state: any) => state.info);

  const dispatch = useDispatch();
  const onSubmit = async (values: PersonalDetails["basic"]) => {
    dispatch(loading());
    const updateDetails: UserPersonDetails = {
      personal_email: values.personalEmail,
      blood_group: values.bloodGroup,
      address: {
        permanent_address: values.permanentAddress,
        present_address: values.presentAddress,
      },
      contact: {
        emergency_contact: values.emergencyContact,
        personal_contact: values.personalContact,
      },
      marital_status: values.maritalStatus,
      family_details: [],
      experience_details: [],
      qualification_details: [],
    };

    const res =
      user && (await APIService.updatePersonalDetails(userId, updateDetails));

    dispatch(notLoading());
    if (res.statusCode == "7000") {
      const updateInfo = formatePersonalDetails(res.data.updatedInfo);
      setPersonalDetails(updateInfo);
      handleCloseModal();
      dispatch(showMessage(res.message));
      setTimeout(() => dispatch(hideMessage()), 3000);
    } else {
      dispatch(showError(res.message));
      setTimeout(() => dispatch(hideError()), 3000);
    }
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Edit Basic Details
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Formik
          initialValues={initialValues || defaultValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {(formikProps) => {
            return (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Personal Email"
                      name="personalEmail"
                      value={formikProps.values.personalEmail}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.personalEmail &&
                        Boolean(formikProps.errors.personalEmail)
                      }
                      helperText={
                        formikProps.touched.personalEmail &&
                        formikProps.errors.personalEmail
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Personal Contact"
                      name="personalContact"
                      value={formikProps.values.personalContact}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.personalContact &&
                        Boolean(formikProps.errors.personalContact)
                      }
                      helperText={
                        formikProps.touched.personalContact &&
                        formikProps.errors.personalContact
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Emergency Contact"
                      name="emergencyContact"
                      value={formikProps.values.emergencyContact}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.emergencyContact &&
                        Boolean(formikProps.errors.emergencyContact)
                      }
                      helperText={
                        formikProps.touched.emergencyContact &&
                        formikProps.errors.emergencyContact
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Permanent Address"
                      name="permanentAddress"
                      value={formikProps.values.permanentAddress}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.permanentAddress &&
                        Boolean(formikProps.errors.permanentAddress)
                      }
                      helperText={
                        formikProps.touched.permanentAddress &&
                        formikProps.errors.permanentAddress
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Present Address"
                      name="presentAddress"
                      value={formikProps.values.presentAddress}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.presentAddress &&
                        Boolean(formikProps.errors.presentAddress)
                      }
                      helperText={
                        formikProps.touched.presentAddress &&
                        formikProps.errors.presentAddress
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Blood Group"
                      name="bloodGroup"
                      value={formikProps.values.bloodGroup}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.bloodGroup &&
                        Boolean(formikProps.errors.bloodGroup)
                      }
                      helperText={
                        formikProps.touched.bloodGroup &&
                        formikProps.errors.bloodGroup
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <InputLabel id="marital-status-label">
                        Marital Status
                      </InputLabel>
                      <Select
                        labelId="marital-status-label"
                        name="maritalStatus"
                        value={formikProps.values.maritalStatus}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        error={
                          formikProps.touched.maritalStatus &&
                          Boolean(formikProps.errors.maritalStatus)
                        }
                        fullWidth
                      >
                        <MenuItem value="unmarried">Unmarried</MenuItem>
                        <MenuItem value="married">Married</MenuItem>
                        <MenuItem value="widowed">Widowed</MenuItem>
                        <MenuItem value="divorced">Divorced</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={info.loading || !formikProps.dirty}
                  startIcon={
                    info.loading ? <CircularProgress size={20} /> : null
                  }
                  sx={{ mt: 5 }}
                >
                  Save Changes
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
};

export default EditBasicDetails;
