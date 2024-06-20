import React from "react";
// component
import Footer from "./footer";

// material-ui
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const StyledRoot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.backgroundColor,
  height: "100%",
  minHeight: "calc(100vh - 58px)",
  "@media screen and (min-width: 0px) and (orientation: landscape)": {
    minHeight: "calc(100vh - 48px)",
  },
  "@media screen and (min-width: 600px)": {
    minHeight: "calc(100vh - 64px)",
  },
}));

const StyledHeader = styled(Toolbar)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: `#f0f8ff`,
  display: "flex",
}));

const StyledTitle = styled(Box)(({ theme }) => ({
  "@media screen and (max-width: 768px)": {
    paddingTop: 15,
  },
}));

const StyledMain = styled(Box)(({ theme }) => ({
  marginTop: 58,
  "@media screen and (min-width: 0px) and (orientation: landscape)": {
    marginTop: 48,
  },
  "@media screen and (min-width: 600px)": {
    marginTop: 64,
  },
}));

const LayoutBeforeLogin = (props) => {
  return (
    <StyledRoot>
      <AppBar position="fixed">
        <StyledHeader>
          <StyledTitle>
            <Typography variant="h5">産業処分場管理システム</Typography>
          </StyledTitle>
        </StyledHeader>
      </AppBar>
      <Box>
        <main id="main">
          <StyledMain>
            <Box sx={{ width: 1, overflowX: "auto" }} p={2} pb={4}>
              {props.children}
            </Box>
          </StyledMain>
        </main>
      </Box>
      <Box>
        <Footer />
      </Box>
    </StyledRoot>
  );
};

export default LayoutBeforeLogin;