import React from "react";

import styled from "@emotion/styled";
import { CssBaseline, Grid, ThemeProvider, createTheme } from "@mui/material";
import { Footer } from "./Footer";
import { Main } from "./Main";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { store } from "../../redux/store";
import { Provider } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SnackbarProvider } from "notistack";

const OuterContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  overflow: "hidden",
});

const InnerContainer = styled(Grid)({
  height: "90vh",
  overflowY: "auto",
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
});

const mainLayoutTheme = createTheme({
  palette: {
    primary: {
      main: "#E45725",
    },
    secondary: {
      main: "#1A3665",
    },
  },
  typography: {
    fontFamily: [
      "System-ui",
      "Poppins",
      "Times",
      "Times New Roman",
      '"Georgia"',
      "serif",
      "sans-serif",
    ].join(","),
  },
});

// interface ILayoutProps {
//   children: NonNullable<ReactNode>;
// }

export const MainLayout = () => (
  <SnackbarProvider maxSnack={3}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Provider store={store}>
        <ThemeProvider theme={mainLayoutTheme}>
          <CssBaseline />
            <OuterContainer>
              <Header />
              <InnerContainer>
                <Main>
                  <Outlet />
                </Main>
                  {/* <Footer>Footer</Footer> */}
              </InnerContainer>
            </OuterContainer>
        </ThemeProvider>
      </Provider>
    </LocalizationProvider>
  </SnackbarProvider>
);
