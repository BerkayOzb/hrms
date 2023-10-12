import React from "react";
import { PersonalDetails } from "..";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";

export type QualificationDetailsProps = {
  qualification: PersonalDetails["qualification"];
};

const QualificationDetails: React.FC<QualificationDetailsProps> = ({
  qualification,
}) => {
  if (qualification == null || !qualification.length) {
    return <h1>No data</h1>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Course</StyledTableCell>
            <StyledTableCell align="center">Specialization</StyledTableCell>
            <StyledTableCell align="center">Institution Name</StyledTableCell>
            <StyledTableCell align="center">Passing Year</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qualification.map((row, index) => {
            return (
              <StyledTableRow key={index}>
                <StyledTableCell align="center" sx={{textTransform:"capitalize"}}>{row.courseName}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.specialization}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{textTransform:"capitalize"}}>
                  {row.instituteName}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.passingYear.getFullYear()}
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QualificationDetails;
