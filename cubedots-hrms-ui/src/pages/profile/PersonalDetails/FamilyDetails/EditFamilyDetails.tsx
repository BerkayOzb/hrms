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
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useAuth } from "../../../../context/auth";
import { useDispatch, useSelector } from "react-redux";
import { FamilyDetailsProps } from ".";
import { APIService } from "../../../../services/API";

import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../../../redux/actions/Info";
import { FamilyDetail } from "../../../../services/Type";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { PersonalDetails } from "..";
import { formatePersonalDetails } from "../../../../utils/formatePersonalDetails";

const validationSchema = Yup.object().shape({
  family: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name is required"),
      dob: Yup.string().required("Date of Birth is required"),
      relation: Yup.string().required("Relation is required"),
    })
  ),
});

const defaultValues: FamilyDetailsProps = {
  family: [{ name: "", dob: new Date(), relation: "" }],
};

type EditFamilyDetailsProps = {
  handleCloseModal: () => void;
  initialValues?: FamilyDetailsProps;
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetails>>;
  userId: string;
};

const EditFamilyDetails: React.FC<EditFamilyDetailsProps> = ({
  initialValues = defaultValues,
  handleCloseModal,
  setPersonalDetails,
  userId,
}) => {
  const { user } = useAuth();
  const info = useSelector((state: any) => state.info);

  const dispatch = useDispatch();

  const onSubmit = async (values: FamilyDetailsProps) => {
    dispatch(loading());

    const res =
      user?.userId &&
      (await APIService.updateFamilyDetails(
        userId,
        values.family as unknown as FamilyDetail
      ));
    if (res.statusCode == "7000") {
      const updateInfo = formatePersonalDetails(res.data.updatedInfo);
      setPersonalDetails(updateInfo);
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
        Edit Family Details
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
                <FieldArray name="family">
                  {({ push, remove }) => (
                    <>
                      {formikProps.values?.family?.map((member, index) => (
                        <Grid container spacing={2} key={index} mb={5}>
                          <Grid item xs={4}>
                            <InputLabel id="name-label">
                              Name
                            </InputLabel>
                            <Field
                              name={`family.${index}.name`}
                              as={TextField}
                              // label="Name"
                              fullWidth
                            />
                          </Grid>
                          {/* <Grid item xs={6}>
                            <InputLabel id="dob-label">
                              Date of Birth
                            </InputLabel>
                            <Field
                              name={`family.${index}.dob`}
                              render={({ field, form }: FieldProps<Date>) => {
                                return (
                                  <DatePicker
                                    value={dayjs(field.value)}
                                    onChange={(date) =>
                                      form.setFieldValue(field.name, date)
                                    }
                                    format="DD/MM/YYYY"
                                  />
                                );
                              }}
                            />
                          </Grid> */}
                          <Grid item xs={4}>
                            <InputLabel id="dob-label">
                              Date of birth
                            </InputLabel>
                            <Field
                              name={`family.${index}.dob`}
                              render={({ field, form }: FieldProps<Date>) => {
                                return (
                                  <DatePicker
                                    // label="Date of Birth"
                                    value={dayjs(field.value)}
                                    onChange={(date) =>
                                      form.setFieldValue(field.name, date)
                                    }
                                    format="DD/MM/YYYY"
                                  />
                                );
                              }}
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <InputLabel id="relation-label">
                              Relation
                            </InputLabel>
                            <Field
                              name={`family.${index}.relation`}
                              as={Select}
                              fullWidth
                            >
                              <MenuItem value={"mother"}>Mother</MenuItem>
                              <MenuItem value={"father"}>Father</MenuItem>
                              <MenuItem value={"children"}>Children</MenuItem>
                              <MenuItem value={"spouse"}>Spouse</MenuItem>
                            </Field>
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
                          push({ name: "", dob: "", relation: "" })
                        }
                      >
                        Add Family Member
                      </Button>
                      {formikProps.errors.family &&
                        formikProps.errors.family.length > 0 && (
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

export default EditFamilyDetails;
