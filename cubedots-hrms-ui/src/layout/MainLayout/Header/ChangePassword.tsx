import React from "react";
import {
  Typography,
  Grid,
  Button,
  FormControl,
  TextField,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { APIService } from "../../../services/API";
import { useDispatch } from "react-redux";
import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../../redux/actions/Info";

const initialFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "New password should be at least 8 characters long"),
  confirmNewPassword: Yup.string()
    .required("Confirm your new password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

type ChangePasswordFormProps = {
  handleCloseModal: () => void;
};

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  handleCloseModal,
}) => {
  const dispatch = useDispatch();
  const handleSubmit = async (values: typeof initialFormValues) => {
    dispatch(loading());

    const obj = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    const res = await APIService.changePassword(obj);
    dispatch(notLoading());

    if (res.statusCode == "7000") {
      handleCloseModal();
      dispatch(showMessage(res.message));
      setTimeout(() => dispatch(hideMessage()), 2000);
    } else {
      console.log(res);
      dispatch(showError(res.message));
      setTimeout(() => dispatch(hideError()), 2000);
    }
  };
  return (
    <div>
      <Typography component="h4" variant="h6" mb={4}>
        Change Password
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
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    fullWidth
                    error={
                      touched.currentPassword && Boolean(errors.currentPassword)
                    }
                    helperText={
                      touched.currentPassword && errors.currentPassword
                        ? errors.currentPassword
                        : ""
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <Field
                    as={TextField}
                    label="New Password"
                    name="newPassword"
                    type="password"
                    fullWidth
                    error={touched.newPassword && Boolean(errors.newPassword)}
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
                      touched.confirmNewPassword && errors.confirmNewPassword
                        ? errors.confirmNewPassword
                        : ""
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePasswordForm;
