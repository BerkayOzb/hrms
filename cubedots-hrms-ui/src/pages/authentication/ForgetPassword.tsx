/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  InputAdornment,
  Modal,
  // Link as MuiLink,
} from "@mui/material";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import "./login.css";
import { AuthIntroTypography } from "./Login";
import { APIService } from "../../services/API";
import { modalStyle } from "../profile/PersonalDetails";
import VerifyEmailForm from "./VerifyPin";
import CancelIcon from "@mui/icons-material/Cancel";
import { closeSnackbar, useSnackbar } from "notistack";

const initialValues = {
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState<null | string>(null);
  const [isVerified, setIsVerified] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsVerified(false);
  };

  const navigate = useNavigate();

  const onSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    const res = await APIService.sendPinCode(values);
    setIsLoading(false);
    // setMessage(res.message);
    // setOpenSnackbar(true);

    if (res.statusCode == "7000") {
      closeSnackbar();
      enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
      setUserId(res.data.userId);
      handleOpenModal();
    } else {
      closeSnackbar();
      enqueueSnackbar(res.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
      setUserId(null);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid container>
          <Grid item>
            <Typography component="h1" variant="h4">
              Forgot Password
            </Typography>
          </Grid>
          <Grid item>
            <AuthIntroTypography>
              "Forgot your password? No problem! Enter your email, and we'll
              help you reset it. Get back to managing your HR tasks hassle-free.
              We're here to support you every step of the way!"
            </AuthIntroTypography>
          </Grid>
          <Grid item md={10}>
            <Box sx={{ mt: 3 }}>
              <Formik
                initialValues={initialValues}
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
                            className="email-input"
                            label="Email"
                            name="email"
                            value={formikProps.values.email}
                            onChange={formikProps.handleChange}
                            onBlur={formikProps.handleBlur}
                            error={
                              formikProps.touched.email &&
                              Boolean(formikProps.errors.email)
                            }
                            helperText={
                              formikProps.touched.email &&
                              formikProps.errors.email
                            }
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Button
                        type="submit"
                        className="submit-button"
                        // color="inherit"
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          width: "240px",
                          backgroundColor: "white",
                        }}
                        disabled={isLoading}
                        startIcon={
                          isLoading ? <CircularProgress size={20} /> : null
                        }
                      >
                        Send Pin
                      </Button>
                      <Button
                        className="submit-button"
                        variant="contained"
                        sx={{
                          mt: 3,
                          mb: 2,
                          width: "240px",
                          backgroundColor: "#E45725",
                        }}
                        disabled={isLoading}
                        onClick={() => navigate("/login")}
                      >
                        Login To Your Account
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Grid>
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message={message}
        />
      </Box>
      {userId && (
        <Modal
          open={openModal}
          onClose={(event, reason) => {
            if (reason === "escapeKeyDown") {
              handleCloseModal();
            }
          }}
        >
          <Box sx={{ ...modalStyle }}>
            <Button
              onClick={handleCloseModal}
              style={{ position: "absolute", right: "0%" }}
            >
              <CancelIcon />
            </Button>
            <VerifyEmailForm
              handleCloseModal={handleCloseModal}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setMessage={setMessage}
              setOpenSnackbar={setOpenSnackbar}
              userId={userId}
              setIsVerified={setIsVerified}
              isVerified={isVerified}
            />
          </Box>
        </Modal>
      )}
    </>
  );
}

export default ForgetPassword;
