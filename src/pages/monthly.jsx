import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
// import InputLabel from '@nui/material/InputLabel';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Router from "next/router";
// import { ROUTES, PREFIX } from "../../common/constants";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//component
import Layout from "../../common/layout";
import { ROUTES } from "../../common/constants";

//api
import apiFromServer from "../../common/apiFromServer";
import authorization from "../../common/authorization";
import { redirect } from "next/dist/server/api-utils";

function createData(month, status) {
  return { month, status };
}

const rows = [
  createData("1", "未確定"),
  createData("2", "未確定"),
  createData("3", "未確定"),
  createData("4", "未確定"),
  createData("5", "未確定"),
  createData("6", "未確定"),
  createData("7", "未確定"),
  createData("8", "未確定"),
  createData("9", "未確定"),
  createData("10", "未確定"),
  createData("11", "未確定"),
  createData("12", "未確定"),
];

const monthly = (props) => {
  //コメントアウト
  // const employee = authorization(props);

  // const employeeId = employee.name;

  // let params = {
  //   employeeId: employeeId,
  // };

  let params = {
    employeeId: "1001",
  };
  console.log("1");
  //サンプルコード
  // const result = apiFromServer.post("/review/getAcquisitionMonth", params, {
  //   accessToken: employee.accessToken,
  // });
  const result = apiFromServer.post("/review/getAcquisitionMonth", params);
  console.log("2");
  console.log(result);
  // getReview = result.result;

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Layout isAdmin={true}>
      <Grid sx={{ mt: "5px" }}>
        <Grid xs={12}>
          <Box>
            <Typography
              variant="contained"
              classname="text"
              style={{ width: "200px", fontSize: "40px" }}
            >
              年月別の勤務表
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box>
        <Box spacing={2} direction="row" align="center">
          <Button style={{ marginLeft: "35px" }} variant="contained">
            前年
          </Button>
          <Button style={{ marginLeft: "2px" }} variant="contained">
            翌年
          </Button>
        </Box>
        <Grid container alignItems="center" justifyContent="center">
          <Typography style={{ marginRight: "30px" }} align="center">
            年
          </Typography>
          <Box width="auto" sx={{ minWidth: 120 }}>
            <FormControl fullWidth component={Paper}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
                <MenuItem value={2026}>2026</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Box>
      <Grid xs={12} />
      <Grid container alignItems="center" justifyContent="center" pt={3}>
        <Box width="auto">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: "200px" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>月</TableCell>
                  <TableCell align="center">確定状況</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.month}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link href="#" to="/workly">
                        {row.month}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Layout>
  );
};
export default monthly;
