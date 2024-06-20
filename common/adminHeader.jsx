import React from "react";
import { styled } from "@mui/material/styles";
// material-ui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import Notifications from "@mui/icons-material/Notifications";

import Menu from "./menu";
import { height } from "@mui/system";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  background: theme.palette.primary.main,
  // height: '40px',
  color: `#f0f8ff`,
  display: "flex",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.white,
  position: "fixed",
  "@media screen and (max-width: 768px)": {
    display: "none",
  },
  right: "30px",
}));

const StyledMobileIconBadge = styled(Badge)(({ theme }) => ({
  "@media screen and (min-width: 768px)": {
    display: "none",
  },
  right: "5px",
  paddingBottom: 3,
}));

const StyledMobileIconNotifications = styled(Notifications)(({ theme }) => ({
  "@media screen and (min-width: 768px)": {
    display: "none",
  },
  right: "5px",
  paddingBottom: 3,
}));

const StyledMobileIconMenuIcon = styled(MenuIcon)(({ theme }) => ({
  "@media screen and (min-width: 768px)": {
    display: "none",
  },
  right: "5px",
  paddingBottom: 3,
}));

const StyledTitle = styled(Box)(({ theme }) => ({
  "@media screen and (max-width: 768px)": {
    paddingTop: 15,
  },
}));

const AdminHeader = () => {


  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={
        {
          //width: { sm: `calc(100% - ${drawerWidth}px)` },
          // ml: { sm: `${drawerWidth}px` },
        }
      }
    >
      <StyledRoot>
        <Grid container spacing={0}>
          <Grid item xs={10}>
            <StyledTitle>
              <Typography variant="h5">キー社内システム</Typography>
            </StyledTitle>
          </Grid>
          <Grid item xs={1}>
            <Box>
              <IconButton
                color="inherit"
                size="large"
                aria-label="open drawer"
                edge="start"
                //onClick={handleDrawerToggle}
                /* sx={{ mr: 2, display: { sm: 'none' } }} */
              >
                  <StyledMobileIconBadge
                    color="error"
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <StyledMobileIconNotifications />
                  </StyledMobileIconBadge>
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                size="large"
                onClick={handleDrawerToggle}
                /* sx={{ mr: 2, display: { sm: 'none' } }} */
              >
                <StyledMobileIconMenuIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        {/* <Box paddingBottom={5}>
          {notifications == 0 ? (
            <StyledButton
              color="inherit"
              size="large"
              variant="outlined"
              startIcon={<Notifications />}
              onClick={() =>
                Router.push({ pathname: ROUTES.NOTIFICATION_LIST, query: {} })
              }
            >
              通知
            </StyledButton>
          ) : (
            <StyledButton
              color="inherit"
              size="large"
              variant="outlined"
              startIcon={
                <Badge
                  color="error"
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  badgeContent={notifications}
                >
                  <Notifications />
                </Badge>
              }
              onClick={() =>
                Router.push({ pathname: ROUTES.NOTIFICATION_LIST, query: {} })
              }
            >
              通知
            </StyledButton>
          )}
        </Box> */}
        <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
          <Box>
            <Menu />
          </Box>
        </Drawer>
      </StyledRoot>
    </AppBar>
  );
};

export default AdminHeader;
