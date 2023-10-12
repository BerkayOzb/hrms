import { styled } from "@mui/material/styles";
import { Grid, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { SnackbarProvider } from "notistack";

const ScrollableContainer = styled(Grid)({
  height: "100vh",
  overflowY: "auto",
  flex: "1",
});

const minimalLayoutTheme = createTheme({
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

// const minimalLayoutTheme = createTheme({
//   typography: {
//     fontFamily: [
//       "System-ui",
//       "Poppins",
//       "Times",
//       "Times New Roman",
//       '"Georgia"',
//       "serif",
//       "sans-serif",
//     ].join(","),
//   },
// });

const MinimalLayout: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={minimalLayoutTheme}>
        <CssBaseline />
        <ScrollableContainer
          container
          sx={{
            padding: "15px 40px",
          }}
          alignContent="start"
          justifyContent="space-between"        
        >
          <Grid item xs={12}>
            <img
              src="assets\images\cubedots-logo.svg"
              height={"60px"}
              width={"160px"}
            />
          </Grid>

          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
            mt={"30px"}
          >
            <Grid item md={6}>
              <img
                src="assets\images\login-banner.svg"
                style={{ maxWidth: "100%" }}
              />
            </Grid>
            <Grid item md={4}>
              <Outlet />
            </Grid>
          </Grid>
        </ScrollableContainer>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

export default MinimalLayout;
