import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const barHeight = 64;

const StyledMenu = styled(Box)(({ theme }) => ({
  zIndex: 4,
  top: 58,
  position: "fixed",
  "@media screen and (max-height: 600px)": {
    position: "static",
  },
  background: theme.palette.menu.color,
  color: theme.palette.menu.text,
  height: "100%",
  minHeight: `calc(100vh - ${barHeight}px)`,
  width: "270px",
  "@media screen and (max-width: 768px)": {
    height: "100%",
    minHeight: "100vh",
    position: "static",
  },
  "@media screen and (min-width: 0px) and (orientation: landscape)": {
    top: 48,
  },
  "@media screen and (min-width: 600px)": {
    top: 64,
  },
}));

const StyledContents = styled(ListItemText)(({ theme }) => ({
  marginLeft: "20px",
}));

const AdminMenu = () => {

  return (
    <StyledMenu>
      <List>
        <ListItem>
          <StyledContents primary="勤怠管理システム"></StyledContents>
        </ListItem>
        <ListItem >
          <StyledContents primary="ログアウト"></StyledContents>
        </ListItem>
      </List>
    </StyledMenu>
  );
};

export default AdminMenu;
