import React, { useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { CircularProgress, styled } from "@mui/material";
import {
  closeSnackbar,
  useSnackbar,
} from "notistack";
import { useSelector } from "react-redux";

const StyledMain = styled("main")`
  height: 100% !important;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
`;

export const Main = ({ children }: PropsWithChildren<unknown>) => {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const info = useSelector((state: any) => state.info);
  useEffect(() => {
    if (info.showMessage) {
      closeSnackbar();
      enqueueSnackbar(info.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
    } else if (info.showError) {
      closeSnackbar();
      enqueueSnackbar(info.error, { variant: "error", autoHideDuration: 2000 });
    } else if (info.loading) {
      closeSnackbar();
      enqueueSnackbar(<CircularProgress />, { variant: "default" });
    }
  }, [
    info.message,
    info.showMessage,
    info.showError,
    info.loading,
    closeSnackbar,
    enqueueSnackbar,
  ]);

  return (
    <>
      <StyledMain>{children}</StyledMain>
    </>
  );
};
