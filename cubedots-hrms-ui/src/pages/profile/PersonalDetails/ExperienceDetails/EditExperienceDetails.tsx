import React  from "react";
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
import { ExperienceDetail } from "../../../../services/Type";
import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../../../redux/actions/Info";
import { ExperienceDetailsProps } from ".";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { PersonalDetails } from "..";
import { formatePersonalDetails } from "../../../../utils/formatePersonalDetails";

const validationSchema = Yup.object().shape({
  experience: Yup.array().of(
    Yup.object().shape({
      companyName: Yup.string().required("Name is required"),
      doj: Yup.string().required("Date of Joining is required"),
      dol: Yup.string()
        .required("Date of Leaving is required")
        .test(
          "is-greater",
          "Date of leaving must be greater than date of joining",
          function (value) {
            const { doj } = this.parent;
            return dayjs(value).isAfter(dayjs(doj));
          }
        ),
      position: Yup.string().required("Position is required"),
    })
  ),
});

const defaultValues: ExperienceDetailsProps = {
  experience: [
    { companyName: "", doj: new Date(), dol: new Date(), position: "" },
  ],
};

type EditExperienceDetailsProps = {
  userId: string;
  handleCloseModal: () => void;
  initialValues?: ExperienceDetailsProps;
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetails>>;
};

const EditExperienceDetails: React.FC<EditExperienceDetailsProps> = ({
  initialValues = defaultValues,
  handleCloseModal,
  setPersonalDetails,
  userId
}) => {
  const { user } = useAuth();
  console.log(userId, user?.userId)
  const info = useSelector((state: any) => state.info);

  const dispatch = useDispatch();

  const onSubmit = async (values: ExperienceDetailsProps) => {
    dispatch(loading());

    const updateExperience = values.experience.map((ex) => {
      const obj = {
        company_name: ex.companyName,
        date_of_joining: ex.doj,
        date_of_leaving: ex.dol,
        position: ex.position,
      };
      return obj;
    });

    const res =
      user?.userId &&
      (await APIService.updateExperienceDetails(
        userId,
        updateExperience as unknown as ExperienceDetail
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
        Edit Experience Details
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
                <FieldArray name="experience">
                  {({ push, remove }) => (
                    <>
                      {formikProps.values?.experience?.map((member, index) => (
                        <Grid container spacing={2} key={index} mb={5}>
                          <Grid item xs={3}>
                            <Field
                              name={`experience.${index}.companyName`}
                              as={TextField}
                              label="company Name"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Field
                              name={`experience.${index}.doj`}
                              render={({ field, form }: FieldProps<Date>) => {
                                return (
                                  <DatePicker
                                    label="Date of Joining"
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
                          <Grid item xs={3}>
                            <Field
                              name={`experience.${index}.dol`}
                              render={({ field, form }: FieldProps<Date>) => {
                                return (
                                  <DatePicker
                                    label="Date of Leaving"
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
                          <Grid item xs={3}>
                            <Field
                              name={`experience.${index}.position`}
                              as={TextField}
                              label="Position"
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
                          <Grid item md={12}>
                            {formikProps?.errors?.experience &&
                              formikProps?.errors?.experience?.length > 0 &&
                              formikProps?.errors?.experience[index] !=
                                null && (
                                <Typography color="error">
                                  {JSON.stringify(
                                    Object.values(
                                      formikProps?.errors?.experience[index]
                                    )
                                  )}
                                </Typography>
                              )}
                          </Grid>
                        </Grid>
                      ))}

                      <Button
                        type="button"
                        onClick={() =>
                          push({
                            companyName: "",
                            doj: "",
                            dol: "",
                            position: "",
                          })
                        }
                      >
                        Add More Expereince
                      </Button>

                      {/* {formikProps?.errors?.experience &&
                        formikProps?.errors?.experience?.length > 0 && (
                          <Typography color="error">
                            {JSON.stringify(
                              Object.values(formikProps?.errors?.experience)
                            )}
                          </Typography>
                        )} */}
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

export default EditExperienceDetails;
