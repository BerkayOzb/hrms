import React from "react";
import {
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { APIService } from "../../../services/API";
import { useDispatch, useSelector } from "react-redux";
import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../../redux/actions/Info";
import { LeaveRequestRecord } from ".";

const validationSchema = Yup.object({
  status: Yup.string().required("Status is required"),
  remark: Yup.string().required("Remark is required"),
});

type LeaveActionFormProps = {
  leave: LeaveRequestRecord;
  handleCloseModal: () => void;
  getLeaveRequestData: () => Promise<void>;
  getLeaveBalance: () => Promise<void>;
};

const LeaveActionForm: React.FC<LeaveActionFormProps> = ({
  leave,
  handleCloseModal,
  getLeaveRequestData,
  getLeaveBalance,
}) => {
  const initialFormValues = {
    status: leave.status || "",
    remark: leave.approverRemark || "",
  };

  const info = useSelector((state: any) => state.info);
  const dispatch = useDispatch();
  const handleSubmit = async (values: { status: string; remark: string }) => {
    dispatch(loading());
    const res = await APIService.changeLeaveStatus({
      leaveId: leave.leaveId,
      status: values.status,
      remark: values.remark,
      empCode: leave.empCode,
    });
    if (res.statusCode == "7000") {
      dispatch(notLoading());
      dispatch(showMessage(res.message));
      setTimeout(() => {
        dispatch(hideMessage());
      }, 3000);
      getLeaveRequestData();
      getLeaveBalance();
      handleCloseModal();
    } else {
      dispatch(notLoading());
      dispatch(showError(JSON.stringify(res.message)));
      setTimeout(() => {
        dispatch(hideError());
      }, 3000);
    }
  };

  return (
    <div>
      <Typography component="h4" variant="h6" mb={4}>
        Accept/Reject Request
      </Typography>
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ touched, errors, values }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={touched.status && Boolean(errors.status)}
                >
                  <InputLabel id="status-label">Status</InputLabel>
                  <Field
                    as={Select}
                    labelid="status-label"
                    id="status"
                    name="status"
                    label="Status"
                    error={touched.status && Boolean(errors.status)}
                    helperText={
                      touched.status && errors.status ? errors.status : ""
                    }
                  >
                    <MenuItem value="approved">Approve</MenuItem>
                    <MenuItem value="rejected">Reject</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Field>
                  {/* <ErrorMessage name="status" component={FormHelperText} /> */}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={touched.remark && Boolean(errors.remark)}
                >
                  <Field
                    as={TextField}
                    label="Remark"
                    name="remark"
                    fullWidth
                    error={touched.remark && Boolean(errors.remark)}
                    helperText={
                      touched.remark && errors.remark ? errors.remark : ""
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={values.status === leave.status && values.remark === leave.approverRemark}
                  startIcon={
                    info.loading ? <CircularProgress size={20} /> : null
                  }
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LeaveActionForm;
