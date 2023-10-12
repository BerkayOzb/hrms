/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LoginUser } from "./Types";
import { useLocation, useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import "./login.css";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { APIService } from "../../services/API";
import { closeSnackbar, useSnackbar } from "notistack";

export const AuthIntroTypography = styled(Typography)`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
`;

const initialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("password is required"),
  // .min(8, 'Password must be at least 8 characters')
  //   .matches(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //     'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
  //   )
});

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();

  const redirectURL = location.state?.path || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  const onSubmit = async (values: LoginUser) => {
    setIsLoading(true);
    const res = await APIService.login(values);
    setIsLoading(false);
    if (res.statusCode == "7000") {
      localStorage.setItem("token", res.data.token);
      navigate(redirectURL, { replace: true });
      // setOpenSnackbar(true);
      // setMessage(res.data.message);
      closeSnackbar();
      enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
    } else {
      // setOpenSnackbar(true);
      // setMessage(res.message);
      closeSnackbar();
      enqueueSnackbar(res.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    // axios
    //   .post(`${process.env.REACT_APP_API_URL}/api/users/login`, { ...values })
    //   .then((res: any) => {
    //     if (res.data.statusCode === 7000) {
    //       localStorage.setItem("token", res.data.data.token);
    //       navigate(redirectURL, { replace: true });
    //     }
    //     setIsLoading(false);
    //     setOpenSnackbar(true);
    //     setMessage(res.data.message);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setOpenSnackbar(true);
    //     setMessage(error.response.data.message);
    //     setIsLoading(false);
    //   });
  };

  return (
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
            Welcome Back
          </Typography>
        </Grid>
        <Grid item>
          <AuthIntroTypography>
            We're thrilled to have you here. Please enter your credentials to
            access your account and manage your HR-related tasks with ease. If
            you have any questions or need assistance, feel free to reach out to
            us. We're here to help. Thank you for being part of our Team!
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
                      <Grid item xs={12}>
                        <TextField
                          label="Password"
                          name="password"
                          type="password"
                          value={formikProps.values.password}
                          onChange={formikProps.handleChange}
                          onBlur={formikProps.handleBlur}
                          error={
                            formikProps.touched.password &&
                            Boolean(formikProps.errors.password)
                          }
                          helperText={
                            formikProps.touched.password &&
                            formikProps.errors.password
                          }
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* <FormControlLabel
                        control={
                          <Checkbox
                            name="rememberMe"
                            color="primary"
                            checked={formikProps.values.rememberMe}
                            onChange={formikProps.handleChange}
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "12px",
                            }}
                          >
                            Remember Me
                          </Typography>
                        }
                      /> */}
                      <Typography variant="body2">
                        <Link
                          to="/forgot-password"
                          style={{
                            color: "black",
                            textDecoration: "none",
                            fontSize: "12px",
                          }}
                        >
                          Forgot Password?
                        </Link>
                      </Typography>
                    </Box>
                    <Button
                      type="submit"
                      className="submit-button"
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
                      Login
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
  );
}

export default Login;
