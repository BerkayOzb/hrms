import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { APIService } from "../../services/API";
import { Box, Button, Modal, Tooltip, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  hideError,
  hideMessage,
  loading,
  notLoading,
  showError,
  showMessage,
} from "../../redux/actions/Info";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import { style } from "../adminPanel/employee-management";
import ApplyLeaveForm from "./ApplyLeave";
import { ApplyLeaveType } from "../../services/Type";
import { LeaveType } from ".";

type LeaveEntryType = {
  leaveId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  leaveType: string;
  duration: string;
  status: string;
  dayCount: string;
  reason: string;
  approverRemark: string;
};
type LeaveTableProps = {
  leavesData: LeaveEntryType[];
  setLeavesData: React.Dispatch<React.SetStateAction<LeaveEntryType[]>>;
  fectchLeaveBalance: () => Promise<void>;
  getData: () => Promise<void>;
  leavesType: LeaveType[];
};

const LeaveTable: React.FC<LeaveTableProps> = ({
  leavesData,
  fectchLeaveBalance,
  getData,
  leavesType,
}) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<null | ApplyLeaveType>(
    null
  );

  const handleClickLeave = (leave: LeaveEntryType) => {
    const temp = {
      leaveId: leave.leaveId,
      leaveType: leavesType.filter((l) => l.title == leave.leaveType)[0]._id,
      startDate: leave.startDate.toISOString().substr(0, 10),
      endDate: leave.endDate.toISOString().substr(0, 10),
      leaveDuration: leave.duration,
      reason: leave.reason,
    };
    setSelectedLeave(temp);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const cancelLeave = async (leaveId: string) => {
    dispatch(loading());
    const res = await APIService.cancelLeave(leaveId);
    if (res.statusCode == "7000") {
      getData();
      fectchLeaveBalance();
      dispatch(notLoading());
      dispatch(showMessage(res.message));
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

  return (
    <>
      <Paper sx={{ width: "100%", height: "100%", overflow: "auto" }}>
        <Typography variant="h6">Leave Request Status</Typography>

        {leavesData.length == 0 ? (
          <Typography>No Request Available</Typography>
        ) : (
          <TableContainer
            sx={{ maxHeight: 200, borderRadius: "10px", overflow: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  {/* <StyledTableCell align="right">End Date</StyledTableCell> */}
                  <StyledTableCell align="center">Leave Type</StyledTableCell>
                  <StyledTableCell align="center">Duration</StyledTableCell>
                  <StyledTableCell align="center">Reason</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Remark</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {leavesData.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {row?.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {`${row.startDate.toLocaleDateString(
                        "en-GB"
                      )} to ${row.endDate.toLocaleDateString("en-GB")}`}
                    </StyledTableCell>
                    {/* <StyledTableCell align="right">
                  {row.endDate.toLocaleDateString("en-US")}
                </StyledTableCell> */}
                    <StyledTableCell
                      align="center"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {row.leaveType}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {row.dayCount}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ textTransform: "capitalize" }}
                    >
                      <Tooltip title={row.reason} arrow>
                        <span>
                          {row.reason.slice(0, 20)}
                          {row.reason.length > 20 ? "..." : ""}
                        </span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Tooltip title={row.approverRemark} arrow>
                        <span>
                          {row.approverRemark.slice(0, 20)}
                          {row.approverRemark.length > 20 ? "..." : ""}
                        </span>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        disabled={row.status != "pending"}
                        onClick={() => cancelLeave(row.leaveId)}
                        sx={{ padding: "2px 2px", fontSize: "12px" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={row.status != "pending"}
                        onClick={() => handleClickLeave(row)}
                        sx={{ padding: "2px 2px", fontSize: "12px" }}
                      >
                        Edit
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...style, overflow: "auto" }}>
          <ApplyLeaveForm
            leavesType={leavesType}
            getData={getData}
            fectchLeaveBalance={fectchLeaveBalance}
            initialData={selectedLeave as ApplyLeaveType}
          />
        </Box>
      </Modal>
    </>
  );
};

export default LeaveTable;
