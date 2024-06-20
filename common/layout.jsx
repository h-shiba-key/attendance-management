import React from "react";
import { styled } from "@mui/material/styles";

// material-ui
import Box from "@mui/material/Box";

// component
// import Footer from "./footer";
import Header from "./header";
import Menu from "./menu";
import AdminHeader from "./adminHeader";
import AdminMenu from "./adminMenu";

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

const StyledHeaderNav = styled(Box)(({ theme }) => ({
  "@media screen and (max-width: 768px)": {
    display: "none",
  },
}));

const StyledMain = styled(Box)(({ theme }) => ({
  display: "flex",
  marginTop: 58,
  "@media screen and (min-width: 0px) and (orientation: landscape)": {
    marginTop: 48,
  },
  "@media screen and (min-width: 600px)": {
    marginTop: 64,
  },
}));

const StyledContents = styled(Box)(({ theme }) => ({
  padding: "16px 16px 32px 286px",
  width: "100%",
  overflowX: "auto",
  "@media screen and (max-width: 768px)": {
    padding: "16px 16px 32px 16px",
  },
  "@media screen and (max-height: 600px)": {
    padding: "16px 16px 32px 16px",
  },
}));

const Layout = (props) => {
  return (
    <StyledRoot>
      <Box>{props.isAdmin ? <AdminHeader /> : <Header />}</Box>
      <Box>
        <main id="main">
          <StyledMain>
            <StyledHeaderNav>
              {props.isAdmin ? <AdminMenu /> : <Menu />}
            </StyledHeaderNav>
            <StyledContents>{props.children}</StyledContents>
          </StyledMain>
        </main>
      </Box>
      {/* <Box>
        <Footer />
      </Box> */}
    </StyledRoot>
  );
};

export default Layout;
