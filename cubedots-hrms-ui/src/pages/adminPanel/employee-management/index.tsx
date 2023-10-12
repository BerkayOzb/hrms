import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Modal } from "@mui/material";
import AddEmployee from "./AddEmployee";
import { EmployeeList } from "./EmployeeList";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../redux/actions/Users";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 2,
  pb: 3,
  maxHeight: "90vh",
};

type EmployeeManagementProps = object;

const EmployeeManagement: React.FC<EmployeeManagementProps> = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const allUser = useSelector((state: any) => state.users);

  if (user?.role != "admin") {
    return <Navigate to="/not-authorized" />;
  }

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    dispatch<any>(fetchUsers());
  }, []);

  return (
    <>
      {allUser.loading ? (
        <CircularProgress />
      ) : (
        <>
          
          <EmployeeList
            usersList={allUser.users}
            handleOpenModel={handleOpenModal}
          />
        </>
      )}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...style }}>
          <AddEmployee
            managerOptions={allUser.users}
            handleClose={handleCloseModal}
          />
        </Box>
      </Modal>
    </>
  );
};

export default EmployeeManagement;
