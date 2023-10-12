import * as React from "react";
import { User } from "..";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/actions/Users";
import UserInfo from "./UserInfo";
import {
  Box,
  Button,
  Grid,
  Modal,
  Stack,
  TextField,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { style } from ".";
import AddEmployee from "./AddEmployee";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";

type EmployeeListProps = {
  usersList: User[];
  handleOpenModel: () => void;
};

export const EmployeeList: React.FC<EmployeeListProps> = ({
  usersList,
  handleOpenModel,   //for add employee
}) => {
  const dispatch = useDispatch();
  const allUser = useSelector((state: any) => state.users);
  const [openModal, setOpenModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {    //for edit employee
    setOpenModal(true);
  };

  useEffect(() => {
    dispatch(selectUser(null));
  }, []);

  useEffect(() => {
    const filtered = usersList.filter((user) => {
      const fullName =
        `${user.name.first_name} ${user.name.last_name}`.toLowerCase();
      return fullName.includes(searchInput.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [searchInput, usersList]);


  const handleDownload = () => {
    const csvContent =
      `id,Name,employee code,department,designation,manager,official mail,official contact,date of joining,date of birth,location,UAN number,ESIC number,present address,permanent address,personal email,personal contact,emergency contact,merital status,blood group,last company,date of joining,date of leaving,position,highest qualification,institute name,specialization,passing year,family member,date of birth,relation\n` +
      filteredUsers
        .map((row, index) => {
          const presentAddress =
            row.personal_details?.address.present_address.replace(/,/g, "");
          const permanentAddress =
            row.personal_details?.address.permanent_address.replace(/,/g, "");
          return `${index},${row.name.first_name} ${row.name.last_name},${row.employee_code},${row.department.name},${row.designation.name}, ${row.managerId.name.first_name} ${row.managerId.name.last_name},${row.email},${row.official_contact},${row.date_of_joining},${row.date_of_birth},${row.location},${row.uan_number},${row.esic_number},${presentAddress},${permanentAddress},${row?.personal_details?.personal_email},${row?.personal_details?.contact.personal_contact},${row?.personal_details?.contact.emergency_contact},${row?.personal_details?.marital_status},${row?.personal_details?.blood_group}, ${row.personal_details?.experience_details[0]?.company_name}, ${row.personal_details?.experience_details[0]?.date_of_joining} ,${row.personal_details?.experience_details[0]?.date_of_leaving},${row.personal_details?.experience_details[0]?.position}, ${row.personal_details?.qualification_details[0]?.course_name},${row.personal_details?.qualification_details[0]?.institute_name},${row.personal_details?.qualification_details[0]?.specialization},${row.personal_details?.qualification_details[0]?.passing_year},${row.personal_details?.family_details[0]?.name},${row.personal_details?.family_details[0]?.dob},${row.personal_details?.family_details[0]?.relation}`;
        })
        .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_data.csv"; 
    a.style.display = "none"; 
  
    document.body.appendChild(a);
    a.click();
  
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {allUser.selectedUser ? (
        <UserInfo handleOpenModal={handleOpenModal} />
      ) : (
        <div>
          <Stack
            direction={"row"}
            justifyContent={"right"}
            spacing={2}
            mb={2}
            mr={4}
          >
            <Button variant="outlined" onClick={handleOpenModel}>
              Add Employee
            </Button>
            <Button variant="outlined" onClick={handleDownload}>
              Download Data
            </Button>
            <TextField
              label="Search Employee"
              variant="outlined"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          </Stack>

          <Grid container justifyContent={"center"}>
            <TableContainer
              sx={{
                maxWidth: "900px",
                maxHeight: "75vh",
                borderRadius: "10px",
              }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    {/* <StyledTableCell align="center">
                      Employee Code
                    </StyledTableCell> */}
                    <StyledTableCell align="center">Department</StyledTableCell>
                    <StyledTableCell align="center">Designation</StyledTableCell>
                    <StyledTableCell align="center">Manager Name</StyledTableCell>
                    <StyledTableCell align="center">Location</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {`${row?.name.first_name} ${row.name.last_name}`}
                      </StyledTableCell>
                      {/* <StyledTableCell align="center">
                        {row.employee_code}
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        {row.department.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.designation.name}
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {`${row.managerId.name.first_name} ${row.managerId.name.last_name}`}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {row.location}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          onClick={() => {
                            dispatch(selectUser(row._id));
                          }}
                        >
                          View
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* {filteredUsers.map((item, index) => (
              <Grid item xs={12} sm={5} md={4} key={index}>
                <ListItem
                  button
                  onClick={() => {
                    dispatch(selectUser(item._id));
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                     style={{ width: '60px', height: '60px', marginRight:"10px" }} 
                      src={`${process.env.REACT_APP_API_URL}/${item.personal_details?.profile_photo?.path}`}
                      alt={`${item.name.first_name}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${item.name.first_name} ${item.name.last_name}`}
                    secondary={
                      <>
                        {item.department.name}
                        <br />
                        {item.designation.name}
                      </>
                    }
                    primaryTypographyProps={{
                      style: { textTransform: "capitalize" },
                    }}
                    secondaryTypographyProps={{
                      style: { textTransform: "capitalize" },
                    }}
                  />
                </ListItem>
              </Grid>
            ))} */}
          </Grid>
        </div>
      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <Box sx={{ ...style }}>
          <AddEmployee
            managerOptions={allUser.users}
            handleClose={handleCloseModal}
            isEditingUser={true}
            initialData={{
              ...allUser.userDetails[allUser.selectedUser]?.official,
              reportingManager:
                allUser.userDetails[allUser.selectedUser]?.official
                  ?.reportingMangerEmail,
            }}
          />
        </Box>
      </Modal>
    </>
  );
};
