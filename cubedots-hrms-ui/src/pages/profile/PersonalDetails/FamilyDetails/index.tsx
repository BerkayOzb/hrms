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

export type FamilyDetailsProps = {
  family: PersonalDetails["family"];
};

const FamilyDetails: React.FC<FamilyDetailsProps> = ({ family }) => {
  if (family == null || !family.length) {
    return <h1>No data</h1>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Date of Birth</StyledTableCell>
            <StyledTableCell align="center">Relation</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {family.map((row, index) => {
            const dateOfBirth = new Date(row.dob);

            return (
              <StyledTableRow key={index}>
                <StyledTableCell
                  align="center"
                  sx={{ textTransform: "capitalize" }}
                >
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {dateOfBirth.toLocaleDateString("en-GB")}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{ textTransform: "capitalize" }}
                >
                  {row.relation}
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FamilyDetails;
