import { TableRow, TableCell, styled, tableCellClasses } from "@mui/material";


interface StyledTableCellProps {
  customBackgroundColor?: string;
  customcolor?: string;
}

export const StyledTableCell = styled(TableCell)<StyledTableCellProps>(({ theme, customcolor }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#58748b",
    color: customcolor || "white",
    border: `1px solid ${theme.palette.divider}`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: `1px solid ${theme.palette.divider}`,
    color: customcolor || 'inherrit'
  },
}));

export const StyledTableRow = styled(TableRow)<StyledTableCellProps>(
  ({ theme, customBackgroundColor }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: customBackgroundColor || theme.palette.action.hover,
    },
  })
);
