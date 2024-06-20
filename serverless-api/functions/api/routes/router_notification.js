import express from "express";
const router = express.Router();
import { RETURN_CODE, PREFIX } from "../../../common/constants/index.js";
import NotificationRepository from "../repository/notification.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/getNotification", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const notificationRepository = new NotificationRepository();
  try {
    // ユーザー情報取得とAPI呼び出し権限チェック
    let checkResult = await checkUserAPICall(
      req.originalUrl,
      req.headers.authorization
    );
    if (checkResult.return_code === RETURN_CODE.ERROR) {
      throw checkResult.message;
    }
    let userInfo = checkResult.result;
    console.log(userInfo);

    let body = req.body;
    let contractorResult = await notificationRepository.getNotification(
      body.loginId,
      body.getNotificationNumber
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: contractorResult,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    console.log("end " + req.originalUrl);
  }
});

router.post("/getNotificationForAdmin", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const notificationRepository = new NotificationRepository();
  try {
    // ユーザー情報取得とAPI呼び出し権限チェック
    let checkResult = await checkUserAPICall(
      req.originalUrl,
      req.headers.authorization
    );
    if (checkResult.return_code === RETURN_CODE.ERROR) {
      throw checkResult.message;
    }
    let userInfo = checkResult.result;
    console.log(userInfo);

    let body = req.body;
    let contractorResult = await notificationRepository.getNotificationForAdmin(
      body.getNotificationNumber
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: contractorResult,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    console.log("end " + req.originalUrl);
  }
});

router.post("/getReportForAdmin", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const notificationRepository = new NotificationRepository();
  try {
    // ユーザー情報取得とAPI呼び出し権限チェック
    let checkResult = await checkUserAPICall(
      req.originalUrl,
      req.headers.authorization
    );
    if (checkResult.return_code === RETURN_CODE.ERROR) {
      throw checkResult.message;
    }
    let userInfo = checkResult.result;
    console.log(userInfo);

    let body = req.body;
    let contractorResult = await notificationRepository.getReportForAdmin(
      body.getNotificationNumber
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: contractorResult,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    console.log("end " + req.originalUrl);
  }
});

router.post("/getNotificationApp", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const notificationRepository = new NotificationRepository();
  try {
    // ユーザー情報取得とAPI呼び出し権限チェック
    let checkResult = await checkUserAPICall(
      req.originalUrl,
      req.headers.authorization
    );
    if (checkResult.return_code === RETURN_CODE.ERROR) {
      throw checkResult.message;
    }
    let userInfo = checkResult.result;
    console.log(userInfo);
    let loginConId = getCognitoName(userInfo.userDetails);

    let body = req.body;
    let notification = {};
    if (loginConId.charAt(0) == PREFIX.CONTRACTOR) {
      // 引数はログインしている業者の業者IDを指定
      notification = await notificationRepository.getNotification(
        loginConId,
        body.getNotificationNumber
      );
    } else if (loginConId.charAt(0) == PREFIX.ADMIN) {
      notification = await notificationRepository.getNotificationForAdmin(
        body.getNotificationNumber
      );
    }
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: notification,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    console.log("end " + req.originalUrl);
  }
});

router.post("/getNumberOfNotifications", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const notificationRepository = new NotificationRepository();
  try {
    // ユーザー情報取得とAPI呼び出し権限チェック
    let checkResult = await checkUserAPICall(
      req.originalUrl,
      req.headers.authorization
    );
    if (checkResult.return_code === RETURN_CODE.ERROR) {
      throw checkResult.message;
    }
    let userInfo = checkResult.result;
    console.log(userInfo);
    let loginConId = getCognitoName(userInfo.userDetails);

    let result = {
      achievementregist: "0",
      orderapproval: "0",
      surplussoilapproval: "0",
      achievementregistforadmin: "0",
    };
    let numberofnotifications = {};
    if (loginConId.charAt(0) == PREFIX.CONTRACTOR) {
      // 引数はログインしている業者の業者IDを指定
      numberofnotifications =
        await notificationRepository.getNumberOfNotifications(loginConId);
      result = {
        ...result,
        achievementregist: numberofnotifications[0].achievementregist,
        orderapproval: numberofnotifications[0].orderapproval,
        surplussoilapproval: numberofnotifications[0].surplussoilapproval,
      };
    } else if (loginConId.charAt(0) == PREFIX.ADMIN) {
      numberofnotifications =
        await notificationRepository.getNumberOfNotificationForAdmin();
      result = {
        ...result,
        achievementregistforadmin:
          numberofnotifications[0].achievementregistforadmin,
      };
    }
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: numberofnotifications,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    console.log("end " + req.originalUrl);
  }
});

export default router;
