import React, { useEffect, useState } from "react";
import { APIService } from "../../../services/API";
import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { LeaveBalance as leaveBalType } from "../../../utils/formateLeaveData";
import { modalStyle } from "../../profile/PersonalDetails";
import AllocateLeave from "./AllocateLeaves";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import CancelIcon from "@mui/icons-material/Cancel";
import { LeaveType } from "../../leave";

export type LeaveBalanceType = {
  _id: string;
  name: string;
  leaveBalance: leaveBalType;
};

type LeaveBalanceProps = {
  leaveBalance: LeaveBalanceType[];
  getLeaveBalance: () => Promise<void>;
};
const LeaveBalance: React.FC<LeaveBalanceProps> = ({
  leaveBalance,
  getLeaveBalance,
}) => {
  const [leavesType, setLeavesType] = useState<LeaveType[]>([]);

  const [selectedLeave, setSelectedLeave] = useState<LeaveBalanceType | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchLeaveType = async () => {
    const leaveData = await APIService.getLeavesType();
    if (leaveData.statusCode == 7000) {
      const titleIdMap = leaveData.data.leavesType.reduce(
        (acc: any, curr: any) => {
          acc[curr.title] = curr._id;
          return acc;
        },
        {}
      );
      setLeavesType(titleIdMap);
    }
  };

  useEffect(() => {
    fetchLeaveType();
  }, []);

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "300px", overflow: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell rowSpan={2}>Name</StyledTableCell>
              {/* <StyledTableCell colSpan={3} align="center">
                Annual
              </StyledTableCell>
              <StyledTableCell colSpan={3} align="center">
                Sick
              </StyledTableCell> */}

              <StyledTableCell align="center">Eligible Annual</StyledTableCell>
              <StyledTableCell align="center">Consumed Annual</StyledTableCell>
              <StyledTableCell align="center">Available Annual</StyledTableCell>
              <StyledTableCell align="center">Eligible Sick</StyledTableCell>
              <StyledTableCell align="center">Consumed Sick</StyledTableCell>
              <StyledTableCell align="center">Available Sick</StyledTableCell>
              <StyledTableCell align="center" rowSpan={2}>
                Action
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ maxHeight: "100px", overflow: "auto" }}>
            {leaveBalance.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell
                  component="th"
                  scope="row"
                  sx={{ textTransform: "capitalize" }}
                >
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.leaveBalance?.annual?.allocated}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.leaveBalance?.annual?.taken}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.leaveBalance?.annual?.allocated -
                    row.leaveBalance?.annual?.taken}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.leaveBalance?.sick?.allocated}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.leaveBalance?.sick?.taken}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.leaveBalance?.sick?.allocated -
                    row.leaveBalance?.sick?.taken}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    onClick={() => {
                      setSelectedLeave(row);
                      handleOpenModal();
                    }}
                    sx={{ padding: '2px 2px', fontSize: '12px' }}
                  >
                    Allocate 
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <Button
            onClick={handleCloseModal}
            style={{ position: "absolute", right: "0%" }}
          >
            <CancelIcon />
          </Button>
          <AllocateLeave
            getLeaveBalance={getLeaveBalance}
            handleCloseModal={handleCloseModal}
            initialData={selectedLeave}
            leaveTypeMap={leavesType}
          />
        </Box>
      </Modal>
    </>
  );
};

export default LeaveBalance;
