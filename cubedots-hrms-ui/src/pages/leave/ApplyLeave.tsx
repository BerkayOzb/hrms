import React from "react";
import {
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import { ApplyLeaveType } from "../../services/Type";
import { APIService } from "../../services/API";
import { useDispatch, useSelector } from "react-redux";
import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../redux/actions/Info";
import { LeaveType } from ".";

const today = new Date();
const initialValues = {
  leaveDuration: "",
  leaveType: "",
  startDate: today.toISOString().substr(0, 10),
  endDate: today.toISOString().substr(0, 10),
  reason: "",
  document: null,
};

const validationSchema = Yup.object({
  leaveDuration: Yup.string().required("Leave duration is required"),
  leaveType: Yup.string().required("Leave type is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "To date should be later than from date"),
  reason: Yup.string().required("Reason is required"),
});

type ApplyLeaveProps = {
  getData: () => Promise<void>;
  fectchLeaveBalance: () => Promise<void>;
  initialData?: ApplyLeaveType;
  leavesType: LeaveType[];
};

const ApplyLeaveForm: React.FC<ApplyLeaveProps> = ({
  getData,
  fectchLeaveBalance,
  initialData,
  leavesType,
}) => {
  const info = useSelector((state: any) => state.info);
  const dispatch = useDispatch();

  const onSubmit = async (
    values: ApplyLeaveType,
    formikHelpers: FormikHelpers<ApplyLeaveType>
  ) => {
    const { resetForm } = formikHelpers;
    dispatch(loading());
    const res = initialData
      ? await APIService.editLeave(values)
      : await APIService.applyLeave(values);
    if (res.statusCode == "7000") {
      getData();
      fectchLeaveBalance();
      dispatch(notLoading());
      dispatch(showMessage(res.message));
      setTimeout(() => {
        dispatch(hideMessage());
      }, 3000);
      resetForm();
    } else {
      dispatch(notLoading());
      dispatch(showError(JSON.stringify(res.message)));
      setTimeout(() => {
        dispatch(hideError());
      }, 3000);
    }
  };

  return (
    <>
      <Typography component="h4" variant="h6" mb={4}>
        {initialData ?  "Edit Leave Request" : "Leave Request"}
      </Typography>
      <Formik
        initialValues={initialData ? initialData : initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {(formikProps) => {
          return (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={Boolean(
                      formikProps.errors.leaveDuration &&
                        formikProps.touched.leaveDuration
                    )}
                  >
                    <InputLabel>Leave Duration</InputLabel>
                    <Field
                      as={Select}
                      name="leaveDuration"
                      label="Leave Duration"
                      align="left"
                    >
                      <MenuItem value="halfDay">half day</MenuItem>
                      <MenuItem value="fullDay">full day</MenuItem>
                    </Field>
                    <ErrorMessage
                      name="leaveDuration"
                      component={FormHelperText}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={Boolean(
                      formikProps.errors.leaveType &&
                        formikProps.touched.leaveType
                    )}
                  >
                    <InputLabel>Leave Type</InputLabel>
                    <Field
                      as={Select}
                      name="leaveType"
                      label="Leave Type"
                      align="left"
                      disabled={initialData ? true: false}
                    >
                      {leavesType.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item._id}>
                            {item.title}
                          </MenuItem>
                        );
                      })}
                    </Field>
                    <ErrorMessage name="leaveType" component={FormHelperText} />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={Boolean(
                      formikProps.errors.startDate &&
                        formikProps.touched.startDate
                    )}
                  >
                    <Field
                      as={TextField}
                      label="From Date"
                      name="startDate"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      error={
                        formikProps.touched.startDate &&
                        Boolean(formikProps.errors.startDate)
                      }
                    />
                    <ErrorMessage name="startDate" component={FormHelperText} />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={Boolean(
                      formikProps.errors.endDate && formikProps.touched.endDate
                    )}
                  >
                    <Field
                      as={TextField}
                      label="To Date"
                      name="endDate"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      error={
                        formikProps.touched.endDate &&
                        Boolean(formikProps.errors.endDate)
                      }
                    />
                    <ErrorMessage name="endDate" component={FormHelperText} />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={Boolean(
                      formikProps.errors.reason && formikProps.touched.reason
                    )}
                  >
                    <Field
                      as={TextField}
                      label="Reason"
                      name="reason"
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      error={
                        formikProps.touched.reason &&
                        Boolean(formikProps.errors.reason)
                      }
                    />
                    <ErrorMessage name="reason" component={FormHelperText} />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    disabled={true}
                  >
                    Upload Document
                    <input
                      type="file"
                      name="document"
                      hidden
                      // Uncomment below to handle file input
                      // onChange={(event) => {
                      //     formikProps.setFieldValue("document", event.currentTarget.files[0]);
                      // }}
                    />
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      info.loading ? <CircularProgress size={20} /> : null
                    }
                    fullWidth
                  >
                    {initialData ? "Edit Leave" : "Apply Leave"}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ApplyLeaveForm;
