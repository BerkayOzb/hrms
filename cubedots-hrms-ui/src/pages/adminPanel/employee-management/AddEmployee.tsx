import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Grid,
  CircularProgress,
  Box,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { APIService } from "../../../services/API";
import { User } from "..";
import { OfficialDetails } from "../../profile/OfficialDetails/OfficialDetail";
import { UserOfficialDetailsDB } from "../../../services/Type";
import { useDispatch, useSelector } from "react-redux";
import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../../redux/actions/Info";
import { fetchUsers } from "../../../redux/actions/Users";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Name is required"),
  lastName: Yup.string().required("Surname is required"),
  dateOfBirth: Yup.date().required("Date of Birth is required"),
  dateOfJoining: Yup.date().required("Date of Joining is required"),
  department: Yup.string().required("Department is required"),
  designation: Yup.string().required("Designation is required"),
  officialEmail: Yup.string()
    .email("Invalid email address")
    .matches(
      /^[A-Z0-9._%+-]+@cubedots.com$/i,
      "Must be a cubedots email address"
    )
    .required("Official Email is required"),
  location: Yup.string().required("Location is required"),
  reportingManager: Yup.string().required("Reporting Manager is required"),
  officialContact: Yup.string()
    .required(
      "official contact number is required write NA is not avavilable/applicable"
    )
    .matches(/^[0-9]{10}$|NA/, "Official Contact must be a 10 digit number"),
  employeeCode: Yup.string().required("Employee code is required"),
  esic: Yup.string().required(
    "Esic number is required write NA is not avavilable/applicable"
  ),
  uan: Yup.string().required(
    "UAN number is required write NA is not avavilable/applicable"
  ),
  grossSalary: Yup.string()
});

const initialValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: new Date(),
  dateOfJoining: new Date(),
  department: "",
  designation: "",
  officialEmail: "",
  location: "",
  reportingManager: "",
  officialContact: "",
  role: "employee",
  esic: "",
  uan: "",
  employeeCode: "",
  grossSalary: ""
};

type AddEmployeeProps = {
  handleClose: () => void;
  managerOptions: User[];
  initialData?: OfficialDetails;
  isEditingUser?: boolean;
};

interface Department {
  name: string;
  _id: string;
}

interface Designation {
  name: string;
  _id: string;
}

interface Role {
  name: string;
  _id: string;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({
  handleClose,
  initialData = initialValues,
  isEditingUser = false,
}) => {
  const info = useSelector((state: any) => state.info);
  const allUser = useSelector((state: any) => state.users);
  const [isloading, setIsLoading] = useState(true);
  // const [open, setOpen] = useState(false);
  // const [newDepartment, setNewDepartment] = useState("");

  // const handleOpen = () => setOpen(true);
  // const handleClose1 = () => setOpen(false);

  const dispatch = useDispatch();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsMap, setDepartmentsMap] = useState<Record<string, string>>(
    {}
  );

  const [designations, setDesignations] = useState<Designation[]>([]);
  const [designationMap, setDesignationMap] = useState<Record<string, string>>(
    {}
  );

  const [roles, setRoles] = useState<Role[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, string>>({});

  const [managerMap, setManagerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      const dep = await APIService.getDepartments();
      if (dep.statusCode == "7000") {
        setDepartments(dep.data.departments);
        const depMap = dep.data.departments.reduce((acc: any, cur: any) => {
          acc[cur.name] = cur._id;
          return acc;
        }, {});
        setDepartmentsMap(depMap);
      }

      const des = await APIService.getDesignations();
      if (des.statusCode == "7000") {
        setDesignations(des.data.designation);
        const desMap = des.data.designation.reduce((acc: any, cur: any) => {
          acc[cur.name] = cur._id;
          return acc;
        }, {});
        setDesignationMap(desMap);
      }

      const roles = await APIService.getRoles();
      if (des.statusCode == "7000") {
        setRoles(roles.data.roles);
        const rolMap = roles.data.roles.reduce((acc: any, cur: any) => {
          acc[cur.name] = cur._id;
          return acc;
        }, {});
        setRoleMap(rolMap);
      }

      const mangMap = allUser?.users.reduce((acc: any, cur: any) => {
        acc[cur.email] = cur._id;
        return acc;
      }, {});
      setManagerMap(mangMap);
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchData();
  }, []);

  const onSubmit = async (values: OfficialDetails) => {
    dispatch(loading());
    const saveData: UserOfficialDetailsDB = {
      name: {
        first_name: values.firstName,
        last_name: values.lastName,
      },
      date_of_birth: values.dateOfBirth,
      date_of_joining: values.dateOfJoining,
      department: values.department,
      designation: values.designation,
      email: values.officialEmail,
      location: values.location,
      managerId: managerMap[values.reportingManager],
      official_contact: values.officialContact,
      roleId: roleMap[values?.role || "employee"],
      esic_number: values.esic,
      uan_number: values.uan,
      employee_code: values.employeeCode,
      gross_salary: values.grossSalary || 'NA'
    };
    const userId = allUser?.selectedUser;
    const saveUser = async () => {
      const res = isEditingUser
        ? await APIService.updateUserOfficialDetails(userId, saveData)
        : await APIService.addUser(saveData);
      if (res.statusCode == "7000") {
        handleClose();
        dispatch(notLoading());
        dispatch(showMessage(res.message));
        dispatch<any>(fetchUsers());
        setTimeout(() => {
          dispatch(hideMessage());
        }, 3000);
      } else {
        dispatch(notLoading());
        dispatch(showError(JSON.stringify(res.message)));
        setTimeout(() => {
          dispatch(hideError());
        }, 3000);
      }
    };
    saveUser();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        maxHeight: "80vh",
      }}
    >
      <Typography component="h3" variant="h6">
        {isEditingUser ? "Edit Employee" : "Add Employee"}
      </Typography>
      <Box
        sx={{ mt: 3, minWidth: "300px", minHeight: "300px", padding: "20px" }}
        textAlign={"center"}
      >
        {isloading ? (
          <CircularProgress />
        ) : (
          <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formikProps) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="firstName"
                      label="First Name"
                      value={formikProps.values.firstName}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.firstName &&
                        Boolean(formikProps.errors.firstName)
                      }
                      helperText={
                        formikProps.touched.firstName &&
                        formikProps.errors.firstName
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="lastName"
                      label="Last Name"
                      value={formikProps.values.lastName}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.lastName &&
                        Boolean(formikProps.errors.lastName)
                      }
                      helperText={
                        formikProps.touched.lastName &&
                        formikProps.errors.lastName
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl
                      fullWidth
                      error={
                        formikProps.touched.role &&
                        Boolean(formikProps.errors.role)
                      }
                    >
                      <Autocomplete
                        freeSolo
                        options={
                          roles?.map((option: Role) => option.name) || []
                        }
                        onChange={(_, newValue) => {
                          formikProps.setFieldValue("role", newValue || "");
                        }}
                        
                        value={formikProps.values.role}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Role"
                            fullWidth
                            onBlur={formikProps.handleBlur}
                            name="role"
                            error={
                              formikProps.touched.role &&
                              Boolean(formikProps.errors.role)
                            }
                          />
                        )}
                      />
                      {formikProps.touched.role && formikProps.errors.role ? (
                        <FormHelperText>
                          {formikProps.errors.role}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Date of Birth"
                      value={dayjs(formikProps.values.dateOfBirth)}
                      onChange={(val) =>
                        formikProps.setFieldValue("dateOfBirth", val)
                      }
                      format="DD/MM/YYYY"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Date of Joining"
                      value={dayjs(formikProps.values.dateOfJoining)}
                      onChange={(val) =>
                        formikProps.setFieldValue("dateOfJoining", val)
                      }
                      format="DD/MM/YYYY"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={Boolean(
                        formikProps.touched.department &&
                          formikProps.errors.department
                      )}
                    >
                      <Autocomplete
                        freeSolo
                        options={departments.map((option) => option.name)}
                        onChange={(_, newValue) => {
                          formikProps.setFieldValue(
                            "department",
                            newValue || ""
                          );
                        }}
                        onInputChange={(_, newInputValue) => {
                          formikProps.setFieldValue(
                            "department",
                            newInputValue
                          );
                        }}
                        ListboxProps={{
                          style: { maxHeight: "150px", overflow: "auto" },
                        }}
                        value={formikProps.values.department}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Department"
                            fullWidth
                            onBlur={formikProps.handleBlur}
                            name="department"
                            error={Boolean(
                              formikProps.touched.department &&
                                formikProps.errors.department
                            )}
                          />
                        )}
                      />
                      {formikProps.touched.department &&
                      formikProps.errors.department ? (
                        <FormHelperText>
                          {formikProps.errors.department}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={Boolean(
                        formikProps.touched.designation &&
                          formikProps.errors.designation
                      )}
                    >
                      <Autocomplete
                        freeSolo
                        options={designations.map((option) => option.name)}
                        onChange={(_, newValue) => {
                          formikProps.setFieldValue(
                            "designation",
                            newValue || ""
                          );
                        }}
                        onInputChange={(_, newInputValue) => {
                          formikProps.setFieldValue(
                            "designation",
                            newInputValue
                          );
                        }}
                        value={formikProps.values.designation}
                        ListboxProps={{
                          style: { maxHeight: "150px", overflow: "auto" },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="designation"
                            fullWidth
                            onBlur={formikProps.handleBlur}
                            name="designation"
                            error={Boolean(
                              formikProps.touched.designation &&
                                formikProps.errors.designation
                            )}
                          />
                        )}
                      />
                      {formikProps.touched.designation &&
                      formikProps.errors.designation ? (
                        <FormHelperText>
                          {formikProps.errors.designation}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="officialEmail"
                      label="Official Email"
                      value={formikProps.values.officialEmail}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.officialEmail &&
                        Boolean(formikProps.errors.officialEmail)
                      }
                      helperText={
                        formikProps.touched.officialEmail &&
                        formikProps.errors.officialEmail
                      }
                      disabled={isEditingUser}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="officialContact"
                      label="Official Contact"
                      value={formikProps.values.officialContact}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.officialContact &&
                        Boolean(formikProps.errors.officialContact)
                      }
                      helperText={
                        formikProps.touched.officialContact &&
                        formikProps.errors.officialContact
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="employeeCode"
                      label="Employee Code"
                      value={formikProps.values.employeeCode}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.employeeCode &&
                        Boolean(formikProps.errors.employeeCode)
                      }
                      helperText={
                        formikProps.touched.employeeCode &&
                        formikProps.errors.employeeCode
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="grossSalary"
                      label="Gross Salary"
                      value={formikProps.values.grossSalary}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.grossSalary &&
                        Boolean(formikProps.errors.grossSalary)
                      }
                      helperText={
                        formikProps.touched.grossSalary &&
                        formikProps.errors.grossSalary
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="location"
                      label="Location"
                      value={formikProps.values.location}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.location &&
                        Boolean(formikProps.errors.location)
                      }
                      helperText={
                        formikProps.touched.location &&
                        formikProps.errors.location
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={
                        formikProps.touched.reportingManager &&
                        Boolean(formikProps.errors.reportingManager)
                      }
                    >
                      <Autocomplete
                        options={
                          allUser.users?.map((option: User) => option.email) ||
                          []
                        }
                        onChange={(_, newValue) => {
                          formikProps.setFieldValue(
                            "reportingManager",
                            newValue || ""
                          );
                        }}
                        value={formikProps.values.reportingManager}
                        ListboxProps={{
                          style: { maxHeight: "150px", overflow: "auto" },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Reporting Manager"
                            fullWidth
                            onBlur={formikProps.handleBlur}
                            name="reportingManager"
                            error={
                              formikProps.touched.reportingManager &&
                              Boolean(formikProps.errors.reportingManager)
                            }
                          />
                        )}
                      />
                      {formikProps.touched.reportingManager &&
                      formikProps.errors.reportingManager ? (
                        <FormHelperText>
                          {formikProps.errors.reportingManager}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="esic"
                      label="ESIC"
                      value={formikProps.values.esic}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.esic &&
                        Boolean(formikProps.errors.esic)
                      }
                      helperText={
                        formikProps.touched.esic && formikProps.errors.esic
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="uan"
                      label="UAN"
                      value={formikProps.values.uan}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={
                        formikProps.touched.uan &&
                        Boolean(formikProps.errors.uan)
                      }
                      helperText={
                        formikProps.touched.uan && formikProps.errors.uan
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={12}>
                    <Grid container justifyContent={"end"} spacing={4}>
                      <Grid item xs={12} md={3}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={info.loading}
                          startIcon={
                            info.loading ? <CircularProgress size={20} /> : null
                          }
                        >
                          Save Changes
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </Box>
    </Box>
  );
};

export default AddEmployee;
