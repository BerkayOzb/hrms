import React from "react";
import { LeaveRequestRecord } from ".";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";

type LeaveRequestProps = {
  leaveRequest: LeaveRequestRecord[];
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  setSelectedLeaveRequest: React.Dispatch<
    React.SetStateAction<LeaveRequestRecord | null>
  >;
};
const LeaveRequest: React.FC<LeaveRequestProps> = ({
  leaveRequest,
  handleOpenModal,
  setSelectedLeaveRequest,
}) => {
  return (
    <Paper sx={{ width: "100%", overflow: "auto" }}>
      {leaveRequest.length == 0 ? (
        <Typography>No leave Requets</Typography>
      ) : (
        <TableContainer sx={{ maxHeight: 250, borderRadius: "10px" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="center">Start Date</StyledTableCell>
                <StyledTableCell align="center">End Date</StyledTableCell>
                <StyledTableCell align="center">Day Count</StyledTableCell>
                <StyledTableCell align="center">Leave Type</StyledTableCell>
                <StyledTableCell align="center">Reason</StyledTableCell>
                <StyledTableCell align="center">Duration</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">
                  Approver Remark
                </StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequest.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {row?.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.startDate.toLocaleDateString("en-GB")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.endDate.toLocaleDateString("en-GB")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.dayCount}
                  </StyledTableCell>

                  <StyledTableCell
                    align="center"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {" "}
                    {row.leaveType}
                  </StyledTableCell>

                  <StyledTableCell align="center">
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
                    {row.duration}
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
                      onClick={() => {
                        handleOpenModal();
                        setSelectedLeaveRequest(row);
                      }}
                      sx={{ padding: "2px 2px", fontSize: "12px" }}

                    >
                      take action
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default LeaveRequest;
