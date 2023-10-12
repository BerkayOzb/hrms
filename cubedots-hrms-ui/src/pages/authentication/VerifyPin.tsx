import React from "react";
import {
  Typography,
  Grid,
  Button,
  FormControl,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { APIService } from "../../services/API";
import { useNavigate } from "react-router-dom";
import { closeSnackbar, useSnackbar } from "notistack";

const initialFormValues = {
  pinCode: "",
};

const validationSchema = Yup.object({
  pinCode: Yup.string()
    .required("Pin code is required")
    .length(6, "Pin code should be exactly 6 characters long"),
});

const initialFormValuesPass = {
  newPassword: "",
  confirmNewPassword: "",
};

const validationSchemaPass = Yup.object({
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "New password should be at least 8 characters long"),
  confirmNewPassword: Yup.string()
    .required("Confirm your new password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

type VerifyEmailFormProps = {
  userId: string;
  handleCloseModal: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
  isVerified: boolean;
};

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  userId,
  handleCloseModal,
  isLoading,
  setIsLoading,
  setMessage,
  setOpenSnackbar,
  setIsVerified,
  isVerified,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values: typeof initialFormValues) => {
    const obj = {
      userId: userId,
      pincode: values.pinCode,
    };
    setIsLoading(true);
    const res = await APIService.verifyPinCode(obj);
    setIsLoading(false);
    setMessage(res.message);
    // setOpenSnackbar(true);
    if (res.statusCode == "7000") {
      setIsVerified(true);
      closeSnackbar();
      enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
    } else {
      closeSnackbar();
      enqueueSnackbar(res.message, {
        variant: "error",
        autoHideDuration: 2000,
      });

      setIsVerified(false);
    }
  };

  const handleSubmitPass = async (values: typeof initialFormValuesPass) => {
    const obj = {
      userId: userId,
      newPassword: values.newPassword,
    };
    setIsLoading(true);
    const res = await APIService.resetPassword(obj);
    setIsLoading(false);
    setMessage(res.message);
    // setOpenSnackbar(true);
    handleCloseModal();
    if (res.statusCode == "7000") {
      enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
    } else {
      enqueueSnackbar(res.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    // if (res.statusCode == "7000") {
    //   navigate("/login");
    // }
  };

  return (
    <>
      {!isVerified ? (
        <div>
          <Typography component="h4" variant="h6" mb={4}>
            Verify Email
          </Typography>
          <Formik
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ touched, errors }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <Field
                        as={TextField}
                        label="Pin Code"
                        name="pinCode"
                        type="text"
                        fullWidth
                        error={touched.pinCode && Boolean(errors.pinCode)}
                        helperText={
                          touched.pinCode && errors.pinCode
                            ? errors.pinCode
                            : ""
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={
                        isLoading ? <CircularProgress size={20} /> : null
                      }
                    >
                      Verify Email
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div>
          <Typography component="h4" variant="h6" mb={4}>
            Reset Your Password
          </Typography>
          <Formik
            initialValues={initialFormValuesPass}
            onSubmit={handleSubmitPass}
            validationSchema={validationSchemaPass}
          >
            {({ touched, errors }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <Field
                        as={TextField}
                        label="New Password"
                        name="newPassword"
                        type="password"
                        fullWidth
                        error={
                          touched.newPassword && Boolean(errors.newPassword)
                        }
                        helperText={
                          touched.newPassword && errors.newPassword
                            ? errors.newPassword
                            : ""
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <Field
                        as={TextField}
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        type="password"
                        fullWidth
                        error={
                          touched.confirmNewPassword &&
                          Boolean(errors.confirmNewPassword)
                        }
                        helperText={
                          touched.confirmNewPassword &&
                          errors.confirmNewPassword
                            ? errors.confirmNewPassword
                            : ""
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={
                        isLoading ? <CircularProgress size={20} /> : null
                      }
                    >
                      Reset Password
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default VerifyEmailForm;
