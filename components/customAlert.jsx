import React from "react";

// material-ui
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const CustomAlert = (props) => {
  let { severity, icon, title, auto } = props;

  return (
    <>
      <Alert
        severity={severity}
        icon={icon}
        sx={{
          border: "1px solid currentColor",
          maxHeight: auto ? null : "250px",
          overflowY: "auto",
        }}
      >
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {props.children}
      </Alert>
    </>
  );
};

export default CustomAlert;
