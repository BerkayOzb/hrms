import React from "react";
import {
  Typography,
  Grid,
  Button,
  TextField,
  FormHelperText,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LeaveBalanceType } from "./LeaveBalance";
import { APIService } from "../../../services/API";
import {
  loading,
  notLoading,
  showMessage,
  hideMessage,
  hideError,
  showError,
} from "../../../redux/actions/Info";
import { useDispatch } from "react-redux";
import { LeaveType } from "../../leave";

const initialValues = {
  name: "",
  sick: {
    allocated: 0,
    taken: 0,
  },
  annual: {
    allocated: 0,
    taken: 0,
  },
  compensatory: {
    allocated: 0,
    taken: 0,
  },
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  sick: Yup.object({
    allocated: Yup.number().required("This field is required"),
    taken: Yup.number().required("This field is required"),
  }),
  annual: Yup.object({
    allocated: Yup.number().required("This field is required"),
    taken: Yup.number().required("This field is required"),
  }),
  compensatory: Yup.object({
    allocated: Yup.number().required("This field is required"),
    taken: Yup.number().required("This field is required"),
  }),
});

type AllocateLeaveType = {
  initialData: LeaveBalanceType | null;
  leaveTypeMap: LeaveType[];
  handleCloseModal: () => void;
  getLeaveBalance: () => Promise<void>;
};

const AllocateLeave: React.FC<AllocateLeaveType> = ({
  initialData,
  leaveTypeMap,
  handleCloseModal,
  getLeaveBalance,
}) => {
  const dispatch = useDispatch();
  const onSubmit = async (values: any) => {
    dispatch(loading());

    const leavesInfo = ["sick", "annual", "compensatory"].map((type: any) => {
      return {
        leaveType: leaveTypeMap[type],
        allocated: values[type].allocated,
        taken: values[type].taken,
      };
    });

    const res = await APIService.allocateLeaves({
      userId: initialData?._id,
      leavesInfo: leavesInfo,
    });
    if (res.statusCode == "7000") {
      dispatch(notLoading());
      getLeaveBalance();
      dispatch(showMessage(res.message));
      setTimeout(() => {
        dispatch(hideMessage());
      }, 3000);
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
    <>
      <Typography component="h4" variant="h6" mb={4}>
        Allocate Leave
      </Typography>
      <Formik
        initialValues={
          initialData
            ? { name: initialData.name, ...initialData.leaveBalance }
            : initialValues
        }
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ touched, errors }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  label="Name"
                  name="name"
                  fullWidth
                  disabled={true}
                  error={touched.name && Boolean(errors.name)}
                />
                <ErrorMessage name="name" component={FormHelperText} />
              </Grid>
              {
                // ["annual", "sick", "compensatory"]
                ["annual", "sick"].map((type, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        label={`Eligible ${type} leave`}
                        name={`${type}.allocated`}
                        type="number"
                        fullWidth
                        //   error={
                        //     touched[type]?.allocated && Boolean(errors[type]?.allocated)
                        //   }
                      />
                      <ErrorMessage
                        name={`${type}.allocated`}
                        component={FormHelperText}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        label={`Consumed ${type} leave`}
                        name={`${type}.taken`}
                        type="number"
                        fullWidth
                        //   error={
                        //     touched[type]?.taken && Boolean(errors[type]?.taken)
                        //   }
                        // disabled
                      />
                      <ErrorMessage
                        name={`${type}.taken`}
                        component={FormHelperText}
                      />
                    </Grid>
                  </React.Fragment>
                ))
              }
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AllocateLeave;
