import React, { useEffect, useState } from "react";
import { APIService } from "../../services/API";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  CircularProgress,
  Typography,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import AttedanceNotations from "./AttedanceNotations";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { showError, hideError } from "../../redux/actions/Info";

export type attendanceEntry = {
  id: string;
  date: string;
  empCode: string;
  duration: string;
  empName: string;
  inTime: string;
  outTime: string;
  status: string;
  tillDate: string;
  attendance: string;
  managerRemark: string;
  employeeRemark: string;
  leaveDuration: string;
};
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Attendence = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attendance, setAttendance] = useState<attendanceEntry[]>([]);
  const today = dayjs();
  const lastMonthStartDate = today.subtract(1, "month").date(26).startOf("day");
  const currentMonthEndDate = today.endOf("day");
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(
    dayjs(lastMonthStartDate)
  );

  const [endDate, setEndDate] = useState<dayjs.Dayjs>(
    dayjs(currentMonthEndDate)
  );

  const getAttendance = async () => {
    setIsLoading(true);
    const res = await APIService.getAttendance(
      startDate?.toDate(),
      endDate?.toDate()
    );
    if (res.statusCode == "7000") {
      setAttendance(res.data.attendance);
    } else {
      dispatch(showError(res.message));
      setTimeout(() => {
        dispatch(hideError());
      }, 3000);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAttendance();
  }, []);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Paper
      sx={{
        overflow: "auto",
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" component="h2" sx={{ marginBottom: "15px" }}>
        Attendance Data
      </Typography>
      <TableContainer
        sx={{ maxHeight: "80vh", maxWidth: "900px", borderRadius: "10px" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>S. No</StyledTableCell>
              <StyledTableCell align="left">Date</StyledTableCell>
              <StyledTableCell align="left">Day</StyledTableCell>
              <StyledTableCell align="left">In Time</StyledTableCell>
              <StyledTableCell align="left">Out Time</StyledTableCell>
              <StyledTableCell align="left">Working Hours</StyledTableCell>
              {/* <StyledTableCell align="left">Punching Status</StyledTableCell> */}
              <StyledTableCell align="left">Attedance</StyledTableCell>
              <StyledTableCell align="left">Employee Remark</StyledTableCell>
              <StyledTableCell align="left">
                Reporting Person Remark
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((row: attendanceEntry, index) => {
              const d = new Date(row.date);
              const inTime = row.inTime ? row.inTime : "00:00";
              const outTime = row.outTime ? row.outTime : "00:00";

              const start = new Date(`1970-01-01T${inTime}`);
              const end = new Date(`1970-01-01T${outTime}`);
              const timeDifference = end.getTime() - start.getTime();
              const hours = Math.floor(timeDifference / (60 * 60 * 1000));
              const minutes = Math.floor(
                (timeDifference % (60 * 60 * 1000)) / (60 * 1000)
              );

              const formattedHours = String(hours).padStart(2, "0");
              const formattedMinutes = String(minutes).padStart(2, "0");

              const duration =
                row.inTime && row.outTime
                  ? `${formattedHours}:${formattedMinutes}`
                  : `00:00`;

              const bg =
                row.attendance == "L"
                  ? "red"
                  : row.attendance == "H"
                  ? "#FA832D"
                  : row.attendance == "WO"
                  ? "#1D6FC4"
                  : row.attendance == "P2"
                  ? "orange"
                  : "green";

              return (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {d.toLocaleDateString("en-GB")}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {daysOfWeek[d.getDay()]}
                  </StyledTableCell>
                  <StyledTableCell
                    align="left"
                    sx={{ color: row.inTime > "09:40" ? "red" : "inherit" }}
                  >
                    {row.inTime ? row.inTime : "-"}
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    {row.outTime ? row.outTime : "-"}
                  </StyledTableCell>
                  <StyledTableCell align="left">{duration}</StyledTableCell>
                  {/* <StyledTableCell align="left">{row.status}</StyledTableCell> */}
                  <StyledTableCell
                    align="left"
                    sx={{ textTransform: "capitalize" }}
                    customcolor={bg}
                  >
                    {row.attendance}
                  </StyledTableCell>
                  <StyledTableCell
                    align="left"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {row.employeeRemark
                      ? `${row.employeeRemark} leave (${row.leaveDuration})`
                      : "-"}
                  </StyledTableCell>
                  <StyledTableCell
                    align="left"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {row.managerRemark ? row.managerRemark : "-"}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <AttedanceNotations />
    </Paper>
  );
};

export default Attendence;
