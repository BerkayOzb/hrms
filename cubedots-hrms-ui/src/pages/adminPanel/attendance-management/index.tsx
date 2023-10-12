import React, { useEffect, useState } from "react";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { APIService } from "../../../services/API";
import { attendanceEntry } from "../../attendence";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import AttedanceNotations from "../../attendence/AttedanceNotations";
import "./styles.css";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import { useDispatch } from "react-redux";
import { showError, hideError } from "../../../redux/actions/Info";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const columns: GridColDef[] = [
  { field: "id", headerName: "S. no", width: 100 },
  { field: "empName", headerName: "Name", flex: 1 },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("en-GB");
    },
  },
  { field: "dayOfWeek", headerName: "Day", flex: 1 },
  {
    field: "inTime",
    headerName: "In Time",
    flex: 1,
    cellClassName: (params) => {
      const inTime = params.value;
      if (inTime && inTime > "09:40") {
        return "red-text";
      }
      return "";
    },
  },
  {
    field: "outTime",
    headerName: "Out Time",
    flex: 1,
  },
  { field: "duration", headerName: "Working Hours", flex: 1 },
  { field: "attendance", headerName: "Attendance", flex: 1 },
  { field: "employeeRemark", headerName: "Employee Remark", flex: 1 },
  {
    field: "managerRemark",
    headerName: "Reporting Person Remark",
    flex: 1,
  },
];

const AttendanceManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attendance, setAttendance] = useState<attendanceEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    const res = await APIService.getAllAttendance(
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
  }, [startDate, endDate]);

  const rows = attendance.map((row, index) => {
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

    return {
      id: index + 1,
      empName: row.empName,
      date: row.date,
      dayOfWeek: daysOfWeek[new Date(row.date).getDay()],
      inTime: row.inTime || "-",
      outTime: row.outTime || "-",
      duration: duration,
      attendance: row.attendance,
      employeeRemark: row.employeeRemark
        ? `${row.employeeRemark} leave (${row.leaveDuration})`
        : "-",
      managerRemark: row.managerRemark || "-",
    };
  });

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    if (date) setStartDate(date);
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    if (date) setEndDate(date);
  };

  const filteredRows = rows.filter((row) =>
    row.empName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = () => {
    const csvContent =
      "id,Name,Date,Day,In Time,Out Time,Working Hours,Attendance,Employee Remark,Reporting Person Remark\n" +
      filteredRows
        .map(
          (row, index) =>
            `${index},${row.empName},"${new Date(row.date).toLocaleDateString(
              "en-GB"
            )}","${daysOfWeek[new Date(row.date).getDay()]}","${
              row.inTime || "-"
            }","${row.outTime || "-"}","${row.duration || "00:00"}","${
              row.attendance || "-"
            }","${row.employeeRemark ? `${row.employeeRemark}` : "-"}","${
              row.managerRemark || "-"
            }"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_data.csv";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Paper
      sx={{
        overflow: "auto",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <Typography variant="h5" component="h2" sx={{ marginBottom: "15px" }}>
        Attendance Data
      </Typography>

      <Stack direction={"row"} spacing={2} mb={2}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DatePicker
          label="Select Start Date"
          value={dayjs(startDate)}
          onChange={handleStartDateChange}
          format="DD/MM/YYYY"
        />
        <DatePicker
          label="Select End Date"
          value={dayjs(endDate)}
          onChange={handleEndDateChange}
          format="DD/MM/YYYY"
        />
        <Button onClick={handleDownload} variant="contained" color="primary">
          Download Data
        </Button>
      </Stack>

      <div
        style={{
          overflow: "auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {isLoading ? (
          <div style={{ position: "relative", height: "80vh" }}>
            <CircularProgress sx={{ position: "absolute", top: "50%" }} />
          </div>
        ) : (
          <TableContainer
            sx={{ maxHeight: "80vh", maxWidth: "1000px", borderRadius: "10px" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>S. no</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Day</StyledTableCell>
                  <StyledTableCell>In Time</StyledTableCell>
                  <StyledTableCell>Out Time</StyledTableCell>
                  <StyledTableCell>Working Hours</StyledTableCell>
                  <StyledTableCell>Attendance</StyledTableCell>
                  <StyledTableCell>Employee Remark</StyledTableCell>
                  <StyledTableCell>Reporting Person Remark</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, index) => {
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
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{row.empName}</StyledTableCell>
                      <StyledTableCell>
                        {new Date(row.date).toLocaleDateString("en-GB")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {daysOfWeek[new Date(row.date).getDay()]}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ color: row.inTime > "09:40" ? "red" : "inherit" }}
                      >
                        {row.inTime || "-"}
                      </StyledTableCell>
                      <StyledTableCell>{row.outTime || "-"}</StyledTableCell>
                      <StyledTableCell>
                        {row.duration || "00:00"}
                      </StyledTableCell>
                      <StyledTableCell customcolor={bg}>
                        {row.attendance || "-"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.employeeRemark ? `${row.employeeRemark}` : "-"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.managerRemark || "-"}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <AttedanceNotations />
    </Paper>
  );
};

export default AttendanceManagement;
