import React from "react";
// material-ui
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";

import theme from "../common/theme";

// const StyledDialogPaper = styled(Dialog)(({ theme }) => ({
//   backgroundColor: theme.palette.backgroundColor
// }));

const MessageDialog = (props) => {
  let { isOpen, title, handleCloseClick, handleOKClick, handleCancelClick } =
    props;
  return (
    <Dialog
      open={isOpen}
      PaperProps={{ backgroundColor: theme.palette.backgroundColor }}
    >
      <Grid container alignItems="center" spaing={1}>
        <Grid item xs={10}>
          <Box ml={2}>
            <Typography variant="h6" component="h6">
              {title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box textAlign="right" sx={{ "& button": { m: 1 } }}>
            <IconButton aria-label="close" onClick={(e) => handleCloseClick(e)}>
              <Close />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box m={2} sx={{ whiteSpace: "pre-line" }}>
            {props.children}
          </Box>
          <Box sx={{ "& button": { m: 1 } }} textAlign="center">
            <Button
              variant="contained"
              color="effect"
              size="large"
              onClick={(e) => handleOKClick(e)}
            >
              はい
            </Button>
            {handleCancelClick ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={(e) => handleCancelClick(e)}
              >
                キャンセル
              </Button>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};
export default MessageDialog;
