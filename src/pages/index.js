import React, { useState } from "react";
// import Layout from "../common/layout";
// import BreadCrumbs from "../components/breadCrumbs";
// import InformationList from "../components/information/list";
// import NotificationList from "../components/notification/list";
// import ReportList from "../components/notification/reportList";
// import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import authorization from "../../common/authorization";
import { ROUTES } from "../../common/constants";

//api
// import apiFromServer from "../common/apiFromServer";
export async function getServerSideProps(context) {
  const contractorinfo = await authorization(context);
  if (!contractorinfo.name) {
    return {
      redirect: {
        permanent: false, // 永続的なリダイレクトかどうか
        destination: ROUTES.LOGIN, // リダイレクト先
      },
    };
  }

  // let notification = {};
  // let reportList = {};
  // if (contractorinfo.isContractor) {
  //   var promiseGetNotification = new Promise(async function (resolve, reject) {
  //     let notificationParam = {
  //       loginId: contractorinfo.name,
  //       getNotificationNumber: process.env.NEXT_PUBLIC_GET_NOTIFICATION_NUMBER,
  //     };
  //     const notificationResult = await apiFromServer.post(
  //       "/notification/getNotification",
  //       notificationParam,
  //       { accessToken: contractorinfo.accessToken }
  //     );
  //     resolve(notificationResult.result);
  //   });
  //   const [getNotification] = await Promise.all([promiseGetNotification]);
  //   notification = getNotification;
  // } else if (contractorinfo.isAdmin) {
  //   var promiseGetNotificationForAdmin = new Promise(async function (
  //     resolve,
  //     reject
  //   ) {
  //     let notificationParam = {
  //       getNotificationNumber:
  //         process.env.NEXT_PUBLIC_GET_NOTIFICATION_NUMBER_FOR_ADMIN,
  //     };
  //     const notificationResult = await apiFromServer.post(
  //       "/notification/getNotificationForAdmin",
  //       notificationParam,
  //       { accessToken: contractorinfo.accessToken }
  //     );
  //     resolve(notificationResult.result);
  //   });
  //   var promiseGetReportForAdmin = new Promise(async function (
  //     resolve,
  //     reject
  //   ) {
  //     let notificationParam = {
  //       getNotificationNumber:
  //         process.env.NEXT_PUBLIC_GET_NOTIFICATION_NUMBER_FOR_ADMIN,
  //     };
  //     const reportResult = await apiFromServer.post(
  //       "/notification/getReportForAdmin",
  //       notificationParam,
  //       { accessToken: contractorinfo.accessToken }
  //     );
  //     resolve(reportResult.result);
  //   });
  //   const [getNotificationForAdmin, getReportForAdmin] = await Promise.all([
  //     promiseGetNotificationForAdmin,
  //     promiseGetReportForAdmin,
  //   ]);
  //   notification = getNotificationForAdmin;
  //   reportList = getReportForAdmin;
  // }
//   return { props: { contractorinfo, notification, reportList } };
return
 }

const Home = (props) => {
  
};

export default Home;
