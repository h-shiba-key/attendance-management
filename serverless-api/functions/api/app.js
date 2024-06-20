import express from "express";
const app = express();
import routerMaster from "./routes/router_master.js";
import routerNotification from "./routes/router_notification.js";
import routerContractor from "./routes/router_contractor.js";
import routerJob from "./routes/router_job.js";
import routerPusnotification from "./routes/router_pushnotification.js";
import routerReview from "./routes/router_review.js";
import routerSurplussoildisposal from "./routes/router_surplussoildisposal.js";
import routerEmployee from "./routes/router_employee.js";
import routerBasicInfo from "./routes/router_basicInfo.js";
import routerItemuUitPrice from "./routes/router_itemunitprice.js";
import router_FileManager from "./routes/router_filemanager.js";
import bodyParser from "body-parser";

var allowCrossDomains = function (req, res, next) {
  console.log("Access Origin " + req.headers.origin);
  res.header(
    "Access-Control-Allow-Origin",
    [process.env.ALLOW_ORIGIN_1, process.env.ALLOW_ORIGIN_2].includes(
      req.headers.origin
    )
      ? "*"
      : ""
  );
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
};
app.use(allowCrossDomains);

app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use("/master", routerMaster);
app.use("/notification", routerNotification);
app.use("/contractor", routerContractor);
app.use("/job", routerJob);
app.use("/pushnotification", routerPusnotification);
app.use("/review", routerReview);
app.use("/surplussoildisposal", routerSurplussoildisposal);
app.use("/basicInfo", routerBasicInfo);
app.use("/employee", routerEmployee);
app.use("/itemunitprice", routerItemuUitPrice);
app.use("/filemanager", router_FileManager);

export default app;
