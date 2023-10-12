import React from "react";
import { Formik, Form, FieldArray, Field, FieldProps } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../../../context/auth";
import { useDispatch, useSelector } from "react-redux";

import { APIService } from "../../../../services/API";
import { QualificationDetail } from "../../../../services/Type";
import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../../../redux/actions/Info";
import { QualificationDetailsProps } from ".";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { PersonalDetails } from "..";
import { formatePersonalDetails } from "../../../../utils/formatePersonalDetails";

const validationSchema = Yup.object().shape({
  qualification: Yup.array().of(
    Yup.object().shape({
      courseName: Yup.string().required("courseName is required"),
      specialization: Yup.string().required("specialization is required"),
      instituteName: Yup.string().required("instituteName is required"),
      passingYear: Yup.string().required("passingYear is required"),
    })
  ),
});

const defaultValues: QualificationDetailsProps = {
  qualification: [
    {
      courseName: "",
      specialization: "",
      instituteName: "",
      passingYear: new Date(),
    },
  ],
};

type EditQualificationDetailsProps = {
  handleCloseModal: () => void;
  initialValues?: QualificationDetailsProps;
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetails>>;
  userId: string;
};

const EditQualificationDetails: React.FC<EditQualificationDetailsProps> = ({
  initialValues = defaultValues,
  handleCloseModal,
  setPersonalDetails,
  userId
}) => {
  const { user } = useAuth();
  const info = useSelector((state: any) => state.info);
  const dispatch = useDispatch();

  const onSubmit = async (values: QualificationDetailsProps) => {
    dispatch(loading());

    const updateQualification = values.qualification.map((q) => {
      const obj = {
        course_name: q.courseName,
        specialization: q.specialization,
        passing_year: q.passingYear,
        institute_name: q.instituteName,
      };
      return obj;
    });

    const res =
      user?.userId &&
      (await APIService.updateQualificationDetails(
        userId,
        updateQualification as unknown as QualificationDetail
      ));
    if (res.statusCode == "7000") {
      const updateInfo = formatePersonalDetails(res.data.updatedInfo);
      setPersonalDetails(updateInfo);
      dispatch(showMessage("Successfully Updated Experience Details"));
      handleCloseModal();
      dispatch(notLoading());
      dispatch(showMessage(res.message));
      setTimeout(() => dispatch(hideMessage()), 3000);
    } else {
      dispatch(notLoading());
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
        Edit Qualification Details
      </Typography>
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
                <FieldArray name="qualification">
                  {({ push, remove }) => (
                    <>
                      {formikProps.values?.qualification?.map((member, index) => (
                        <Grid container spacing={2} key={index} mb={5}>
                          <Grid item xs={3}>
                            <Field
                              name={`qualification.${index}.courseName`}
                              as={TextField}
                              label="Course Name"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Field
                              name={`qualification.${index}.specialization`}
                              as={TextField}
                              label="Specialization"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Field
                              name={`qualification.${index}.passingYear`}
                              render={({ field, form }: FieldProps<Date>) => {
                                return (
                                  <DatePicker
                                    value={dayjs(field.value)}
                                    label={"year"}
                                    openTo="year"
                                    format="DD/MM/YYYY"
                                    onChange={(date) =>
                                      form.setFieldValue(field.name, date)
                                    }
                                  />
                                );
                              }}
                            ></Field>
                          </Grid>
                          <Grid item xs={3}>
                            <Field
                              name={`qualification.${index}.instituteName`}
                              as={TextField}
                              label="Intitute Name"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={1}>
                            {index > 0 && (
                              <Button
                                type="button"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                      ))}

                      <Button
                        type="button"
                        onClick={() =>
                          push({
                            courseName: "",
                            specialization: "",
                            passingYear: "",
                            instituteName: "",
                          })
                        }
                      >
                        Add More Qualification
                      </Button>
                      {formikProps.errors.qualification &&
                        formikProps.errors.qualification.length > 0 && (
                          <Typography color="error">
                            Please Fill all the fields
                          </Typography>
                        )}
                    </>
                  )}
                </FieldArray>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={info.loading || !formikProps.dirty}
                  startIcon={
                    info.loading ? <CircularProgress size={20} /> : null
                  }
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

export default EditQualificationDetails;
