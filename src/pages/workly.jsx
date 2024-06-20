import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MessageDialog from "../../components/MessageDialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import Style from "@mui/material/Style";
import Stack from "@mui/material/Stack";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";
import Layout from "../../common/layout";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import theme from "../../common/theme";
// import Button from './Button.css';

const drawerWidth = 240;

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const styles = {
  menuList: (provided, state) => ({
    ...provided,
    padding: 0,
    padding: 0,
 }),
}

function createData(
  day,
  of,
  work,
  deduction,
  achievements,
  overtime,
  home,
  holiday,
  content,
  total
) {
  return {
    day,
    of,
    work,
    deduction,
    achievements,
    overtime,
    home,
    holiday,
    content,
    total,
  };
}

function Data(approval, name) {
  return { approval, name };
}

function sumData(sumName, achievementsSum, overtimeSum, homeSum, holidaySum) {
  return { sumName, achievementsSum, overtimeSum, homeSum, holidaySum };
}
const rows = [
  createData("1", "月"),
  createData("2", "火"),
  createData("3", "水"),
  createData("4", "木"),
  createData("5", "金"),
  createData("6", "土"),
  createData("7", "日"),
  createData("8", "月"),
  createData("9", "火"),
  createData("10", "水"),
  createData("11", "木"),
  createData("12", "金"),
  createData("13", "土"),
  createData("14", "日"),
  createData("15", "月"),
  createData("16", "火"),
  createData("17", "水"),
  createData("18", "木"),
  createData("19", "金"),
  createData("20", "土"),
  createData("21", "日"),
  createData("22", "月"),
  createData("23", "火"),
  createData("24", "水"),
  createData("25", "木"),
  createData("26", "金"),
  createData("27", "土"),
  createData("28", "日"),
  createData("29", "月"),
  createData("30", "火"),
  // createData("合計"),
];

const rowes = [Data("承認者", " ")];

const sum = [sumData("合計")];

const workly = () => {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [keep, setKeep] = useState(false);
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const handleClickOpen=()=>{
  //   setOpen(true);
  // }

  // const handleClose=()=>{
  //   setOpen(false);
  // }
  function DialogOpen() {
    setOpen(true);
  }
  function handleCloseClick() {
    setOpen(false);
  }

  function handleClickKeep() {
    setKeep(true);
  }

  function handleCloseClickKeep() {
    setKeep(false);
  }

  // function CharacterLimit(){
  //   const [text,setText]=useState('');
  //   const maxCharacters=20;

  //   const handleChange=(event)=>{
  //     const inputText=event.target.value;
  //     if(inputText.length <= maxCharacters){
  //       setText(inputText);
  //     }
  // }  }

  return (
    <Layout isdmin={true}>
      <Grid sx={{ mt: "5px" }}>
        <Grid xs={12}>
          <Box>
            <Typography
              variant="contained"
              className="text"
              style={{ width: "200px", fontSize: "50px" }}
            >
              勤務表
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container sx={{ mt: "5px" }}>
        <Grid xs={10.5}>
          <Box>
            <Typography
              variant="contained"
              className="text"
              style={{ width: "200px", fontSize: "20px" }}
            >
              2024年4月
            </Typography>
          </Box>
        </Grid>
        <Grid xs={1.5}>
          {/* <Box
            width="100px"
            // component="form"
            component={Paper}
            // sx={{
            //   "& > :not(style)": { m: 1, width: "10ch" },
            // }}
          >
            <Table sx={{ minWidth: "150px" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">承認者</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowes.map((row) => (
                  <TableRow
                    key={row.approval}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell style={{ marginLeft: "100px" }}>
                      {row.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box> */}
        </Grid>
      </Grid>

      <Grid container>
        <Grid xs={0.5}></Grid>
        <Grid xs={6.5}>
          <Box 
            width="200px" 
            paddingTop={9}
            
            >
            <Typography
              variant="contained"
              className="text"
              style={{
                // width: "200px",
                fontSize: "20px"
                // paddingTop: "40px",
              }}
            >
              氏名:○○○○
            </Typography>
          </Box>
        </Grid>
        <Grid xs={3}>
          <TextField
            style={{ marginTop: "50px",marginLeft: "180px" }}
            size="small"
            id="作業名"
            label="作業名"
            variant="standard"
          />
        </Grid>
        <Grid xs={2}>
          <Box
            width="105px"
            // component="form"
            component={Paper}
            style={{marginLeft:"110px"}}
            // sx={{
            //   "& > :not(style)": { m: 1, width: "10ch" },
            // }}
          >
            <Table 
              sx={{ minWidth: "150px" }}
              aria-label="simple table"
              >
              <TableHead>
                <TableRow>
                  <TableCell align="center">承認者</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowes.map((row) => (
                  <TableRow
                    key={row.approval}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell style={{ marginLeft: "100px" }}>
                      {row.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>

      {/* kutunabk */}
      {/* <Grid 
      // sx={{ mt: "20px" }}
      >
        <Grid xs={12}>
          <Grid container>
            <Box>
              <Typography
                variant="contained"
                className="text"
                style={{ width: "200px", fontSize: "20px", marginTop: "10px" }}
              >
                氏名:○○○○
              </Typography>
            </Box>
            <Box>
              <TextField
                style={{ marginLeft: "500px" }}
                size="small"
                id="作業名"
                label="作業名"
                variant="standard"
              />
            </Box>
          </Grid>
          <Grid>
            <Grid xs={12}>
              <Grid container aligenItems="left" justifyContent="left" pt={3}>
                <Grid xs={10.9} />
                <Grid item xs={1.1} component={Paper}>
                  <Box
                        width="auto"
                        component="form"
                        sx={{
                          "& > :not(style)": { m: 1, width: "100ch" },
                        }}
                      >
                        <Table
                          sx={{ minWidth: "60px" }}
                          aria-label="simple table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>承認者</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rowes.map((row) => (
                              <TableRow
                                key={row.approval}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.name}
                                </TableCell>
                                <TableCell style={{ marginLeft: "100px" }}>
                                  {row.name}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid> */}

      <Grid xs={12} />
      <Grid container aligenItems="center" justifyContent="center" pt={3}>
        <Box
          width="auto"
          component="form"
          sx={{
            "& > :not(style)": { m: 0, width: "100ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TableContainer component={Paper} style={{ width: "1500px" }}>
            <Table
              sx={{ minWidth: "200px" }}
              aria-label="simple table"
              striped
              bordered
              hover
              // style={{width:'1100px'}}
              size="lg"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">日</TableCell>
                  <TableCell align="center">曜日</TableCell>
                  <TableCell align="center">作業時間 (開始)</TableCell>
                  <TableCell align="center">作業時間 (終了)</TableCell>
                  <TableCell align="center">控除時間 (開始)</TableCell>
                  <TableCell align="center">控除時間 (終了)</TableCell>
                  <TableCell align="center">実績時間</TableCell>
                  <TableCell align="center">残業時間</TableCell>
                  <TableCell align="center">在宅勤務</TableCell>
                  <TableCell align="center">休暇</TableCell>
                  <TableCell align="center">作業内容</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.day}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {row.day}
                    </TableCell>
                    <TableCell align="center">{row.of}</TableCell>
                    <TableCell align="center">
                      <TextField
                        value={row.work}
                        size="small"
                        align="center"
                        style={{ width: "70px" }}
                      ></TextField>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        value={row.work}
                        size="small"
                        align="center"
                        style={{ width: "70px" }}
                      ></TextField>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        value={row.deduction}
                        size="small"
                        align="center"
                        style={{ width: "70px" }}
                      ></TextField>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        value={row.deduction}
                        size="small"
                        align="center"
                        style={{ width: "70px" }}
                      ></TextField>
                    </TableCell>
                    <TableCell align="center" >
                      <Box
                      // className="dashed-border"
                        component="section"
                        sx={{ p: 2, backgroundColor: "#E6E6E6" }}
                        style={{ width: "70px" }}
                      >
                        {row.achievements}
                      </Box>
                    </TableCell>
                    <TableCell align="center" >
                      <Box
                        component="section"
                        sx={{ p: 2, backgroundColor: "#E6E6E6" }}
                        style={{ width: "70px" }}
                      >
                        {row.overtime}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox {...label} value={row.home}></Checkbox>
                    </TableCell>
                    <TableCell align="center" size="small">
                      <Box>
                        <FormControl
                          size="small"
                          fullWidth
                          sx={{ m: 1, minWidth: 120 }}
                        >
                          <InputLabel htmlFor="grouped-native-select"></InputLabel>
                          <Select
                            // styles={styles}
                            defaultValue=""
                            id="grouped-native-select"
                            // value={grouped}
                            // label="Grouping"
                          >
                            <MenuItem value="有給全日">有給全日</MenuItem>
                            <MenuItem value="有給半日">有給半日</MenuItem>
                            <MenuItem value="特別休暇">特別休暇</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      {row.holiday}
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        value={row.content}
                        onChange={handleChange}
                        size="small"
                        align="center"
                        style={{ width: "350px" }}
                        inputProps={{ maxLength: 20 }}
                      ></TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
      <Grid container alignItems="center" justifyContent="center" pt={-2}>
        <Box
          width="auto"
          component="form"
          sx={{
            "& > :not(style)": { width: "100ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TableContainer
            component={Paper}
            style={{ width: "630px", marginLeft: "170px" }}
          >
            <Table
              sx={{ minWidth: "200px" }}
              aria-label="simple table"
              striped
              border
              hover
              size="lg"
            >
              <TableBody>
                {sum.map((row) => (
                  <TableRow
                    key={row.sumName}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell 
                      component="th" 
                      scope="row" 
                      align="center"
                      // style={{marginLeft:"110px"}}
                      >
                      {row.sumName}
                    </TableCell>
                    <TableCell>
                      <Box
                        componet="section"
                        sx={{ p: 2, backgroundColor: "#E6E6E6" }}
                        style={{ width: "70px", marginLeft: "40px" }}
                      >
                        {row.achievementsSum}
                      </Box>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <Box
                        componet="section"
                        sx={{ p: 2, backgroundColor: "#E6E6E6" }}
                        style={{ width: "70px", marginLeft: "-55px" }}
                      >
                        {row.overtimeSum}
                      </Box>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <Box
                        componet="section"
                        sx={{ p: 2, backgroundColor: "#E6E6E6" }}
                        style={{ width: "70px", paddingLeft: "-10px" }}
                      >
                        {row.homeSum}
                      </Box>
                    </TableCell>
                
                    <TableCell component="th" scope="row" align="center">
                      <Box
                        componet="section"
                        sx={{ p: 2, backgroundColor: "#E6E6E6"}}
                        style={{ width: "70px", marginLeft: "0px", }}
                      >
                        {row.holidaySum}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
      <Box spacing={2} direction="row" align="left">
        <Button style={{ marginLeft: "100px" }} variant="contained">
          戻る
        </Button>
        <Button
          style={{ marginLeft: "1200px"}}
          variant="contained"
          onClick={handleClickKeep}
          
        >
          保存
        </Button>
        <MessageDialog
          isOpen={keep}
          title={"勤務表の保存"}
          handleCloseClick={handleCloseClickKeep}
          // handleOKClick={handleOKClick}
          handleCancelClick={handleCloseClickKeep}
        >
          <Box align="center" sx={{ whiteSpace: "pre-line" }}>
            {"勤務表を保存しますか？"}
          </Box>
        </MessageDialog>

        <Button
          style={{ marginLeft: "10px" ,backgroundColor:"red"}}
          variant="contained"
          onClick={DialogOpen}
          sx={"background-color:red;"}
        >
          確定
        </Button>

        <MessageDialog
          isOpen={open}
          title={"勤務表の確定"}
          handleCloseClick={handleCloseClick}
          // handleOKClick={handleOKClick}
          handleCancelClick={handleCloseClick}
        >
          <Box align="center" sx={{ whiteSpace: "pre-line" }}>
            {"勤務表を確定しますか？"}
          </Box>
          <Box align="center" fontsize="20px" sx={{ whiteSpace: "pre-line" }}>
            {"※確定すると編集ができなくなります。"}
          </Box>
        </MessageDialog>
      </Box>
    </Layout>
  );
};
export default workly;
