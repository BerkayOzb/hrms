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
import '../styles.css'
export type ExperienceDetailsProps = {
  experience: PersonalDetails["experience"];
};


const ExperienceDetails: React.FC<ExperienceDetailsProps> = ({
  experience,
}) => {
  if (experience == null || !experience.length) {
    return <h1>No data</h1>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Company Name</StyledTableCell>
            <StyledTableCell align="center">Date of Joining</StyledTableCell>
            <StyledTableCell align="center">Date of Leaving</StyledTableCell>
            <StyledTableCell align="center">Position</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {experience.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align="center" sx={{textTransform:"capitalize"}}>{row.companyName}</StyledTableCell>
              <StyledTableCell align="center">{row.doj.toLocaleDateString('en-GB')}</StyledTableCell>
              <StyledTableCell align="center">{row.dol.toLocaleDateString('en-GB')}</StyledTableCell>
              <StyledTableCell align="center" sx={{textTransform:"capitalize"}}>{row.position}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExperienceDetails;
