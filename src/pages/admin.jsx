import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Layout from "../../common/layout";
import Link from "@mui/material/Link";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";


const preventDefault=(event) => event.preventDefault();

function createData(no,January,February,March,April,May,June,July,August,September,October,November,December){
    return{no,January,February,March,April,May,June,July,August,September,October,November,December};
}

const rows=[
  createData('鍵谷'),
  createData('山本'),
  createData('加知'),
  createData('青田'),
  createData('床井'),
  createData('安藤'),
  createData('福田'),
  createData('佐野'),
  createData('神田(理)'),
  createData('新宮'),
  createData('高木'),
  createData('村瀬'),
  createData('神田(江)'),
  createData('柴'),
  createData('沓名'),
]
  

const admi=()=>{
return(
<>
  <Layout isdmin={true}>
   <Grid sx={{mt:"5px"}}>
    <Grid>
     <Box>
      <Typography
        variant="contained"
        className="text"
        style={{ width:"200px",fontSize:"50px"}}
      >
       社員一覧
      </Typography>
      <Box>
    <Box spacing={2} direction="row" align="center" style={{marginTop:"-80px"}}>
      <Button style={{marginLeft:'910px'}} variant='outlined'>前年</Button>
      <Button style={{marginLeft:'2px'}} variant='outlined'>翌年</Button>
    </Box>
    <Grid container alignItems="center" justifyContent="center">
      <Typography style={{marginLeft:'900px'}} align="center">
        年
      </Typography>
      <Box
        width="auto"
        sx={{minWidth:120}}
        style={{marginLeft:"10px"}}
        >
        <FormControl fullWidth component={Paper}>
          <Select
            labelId="demo-simple-select-label"
            id="dmo-simple-select"
            label="Age"
          >
           <MenuItem value={2024}>2024</MenuItem>
           <MenuItem value={2025}>2025</MenuItem>
           <MenuItem value={2026}>2026</MenuItem>
          </Select>
         </FormControl>
        </Box>
       </Grid>
      </Box>
     </Box>
    </Grid>
   </Grid>

   

   <TableContainer 
     component={Paper}
     style={{marginTop:"10px"}}
     >
    <Table 
       sx={{minWidth:650}} 
       aria-label="simple table"
       >
      <TableHead>
        <TableRow>
          <TableCell align="center"></TableCell>
          <TableCell align="center">1月</TableCell>
          <TableCell align="center">2月</TableCell>
          <TableCell align="center">3月</TableCell>
          <TableCell align="center">4月</TableCell>
          <TableCell align="center">5月</TableCell>
          <TableCell align="center">6月</TableCell>
          <TableCell align="center">7月</TableCell>
          <TableCell align="center">8月</TableCell>
          <TableCell align="center">9月</TableCell>
          <TableCell align="center">10月</TableCell>
          <TableCell align="center">11月</TableCell>
          <TableCell align="center">12月</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row)=>(
          <TableRow
            key={row.no}
            sx={{'&:last-child td, &:last-child th':{border:0}}}
            >
           <TableCell component="th" scope="row">
            {row.no}
           </TableCell>
           <TableCell 
              value={row.January}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.February}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.March}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
            </TableCell>
            <TableCell 
              value={row.April}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.May}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.June}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.July}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.August}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.September}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.October}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.November}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
              <TableCell 
              value={row.December}
              align="center"
              sx={{
                typography:'body1',
                '& > :not(style)~ :not(style)':{
                  ml: 2,
                },
              }}
              onClick={preventDefault}
              >
                <Link href="#">未確定</Link>
              </TableCell>
          </TableRow>
        ))}
      </TableBody>
     </Table>
    </TableContainer>
   </Layout>
  </>
)
}
export default admi;