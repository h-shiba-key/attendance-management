import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import CustomAlert from "../../components/customAlert";
import { Amplify, Auth } from "aws-amplify";
import Router from "next/router";
import authorization from "../../common/authorization";
import { ROUTES, PREFIX } from "../../common/constants";

// const ariaLabel = { "aria-label": "description" };

export async function getServerSideProps(context) {
  const contractorinfo = await authorization(context);
  if (contractorinfo.name !== null) {
    return {
      redirect: {
        permanent: false, // 永続的なリダイレクトかどうか
        destination: ROUTES.MONTHLY, // リダイレクト先
      },
    };
  }
  return { props: {} };
}

const Login = (props) => {
  // サインイン処理
  // 使用するユーザープール、クライアントの ID を指定
  Amplify.configure({
    Auth: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
      userPoolWebClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLWEBCLIENTID,
    },
    ssr: true,
  });

  const [loginId, setLoginId] = useState("");
  const [values, setPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (prop) => (event) => {
    setPassword({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setPassword({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function onClickLogin() {
    try {
      const contractor = await Auth.signIn(loginId, values.password);
      console.log(contractor);
      console.log(contractor.attributes.name.charAt(0));
      if (
        contractor.attributes.name.charAt(0) == PREFIX.ADMIN ||
        contractor.attributes.name.charAt(0) == PREFIX.CONTRACTOR
      ) {
        Router.push({ pathname: ROUTES.MONTHLY, query: {} });
      } else {
        await Auth.signOut();
        setErrorMessage(
          "IDとパスワードの組み合わせが間違っています。やり直してください。"
        );
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(
        "IDとパスワードの組み合わせが間違っています。やり直してください。"
      );
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton></IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              キー社内システム
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ mt: "30px" }}
      >
        <Grid xs={12}>
          <Box textAlign="center">
            <Typography variant="h2" paddingTop={3}>
              ログイン
            </Typography>
            {/* <hr/> */}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: errorMessage == "" ? "none" : "block" }}
        >
          <CustomAlert severity="error">
            <Box>{errorMessage}</Box>
          </CustomAlert>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ mt: "50px" }}
        // mt="100px"
      >
        <Grid xs={12}>
          <Box
            textAlign="center"
            component="form"
            sx={{ "& > :not(style)": { m: 1 } }}
            noValidate
            autoComplete="off"
            name="loginId"
            onChange={(e) => setLoginId(e.target.value)}
          >
            <TextField size="small" placeholder="社員IDを入力" />
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        // mt="100px"
        sx={{ mt: "25px" }}
      >
        <Grid xs={12}>
          <Box
            textAlign="center"
            component="form"
            sx={{ "& > :not(style)": { m: 1 } }}
            noValidate
            autoComplete="off"
            className="formField"
          >
            <TextField
              size="small"
              placeholder="パスワードを入力"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              // endAdornment={
              // <InputAdornment position="end">
              //   <IconButton
              //     aria-label="toggle password visibility"
              //     onClick={handleClickShowPassword}
              //     onMouseDown={handleMouseDownPassword}
              //     edge="end"
              //   >
              //     {values.showPassword ? (
              //       <StyledVisibilityIconOut />
              //     ) : (
              //       <StyledVisibilityIconOff />
              //     )}
              //   </IconButton>
              // </InputAdornment>
              // }
            />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ mt: "-10px" }}
      >
        <Grid xs={12}>
          <Stack spacing={2} direction="row" justifyContent="center">
            <Box sx={{ "& button": { m: 11 } }}>
              <Button
                variant="contained"
                style={{ width: "200px" }}
                onClick={() => onClickLogin()}
              >
                ログイン
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <React.Fragment>
        <AppBar
          position="fixed"
          color="primary"
          sx={{ top: "auto", bottom: 0 }}
        >
          <Toolbar></Toolbar>
        </AppBar>
      </React.Fragment>
    </>
  );
};

export default Login;
