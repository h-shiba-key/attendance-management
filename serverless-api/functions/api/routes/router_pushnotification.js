import express from "express";
const router = express.Router();
import { RETURN_CODE } from "../../../common/constants/index.js";
import { DELIVERY_CONTENT_INDEX } from "../../../common/constants/pushNotification.js";
import PushNotificationRepository from "../repository/pushNotification.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/searchPushNotification", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const pushNotificationRepository = new PushNotificationRepository();
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
    const pushNotificationResult =
      await pushNotificationRepository.searchPushNotification(
        body.notificationTypeCode,
        body.categoryCode,
        body.industryCode,
        body.prefectureCode,
        body.publicStartDate,
        body.publicStartTime,
        body.publicEndDate,
        body.subject,
        body.notice,
        body.questionnaire,
        body.apply,
        body.form,
        body.quiz,
        body.undelivered,
        body.duringDelivery,
        body.endDelivery,
        body.rowsPerPage,
        body.offset
      );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      searchResult: pushNotificationResult,
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

router.post("/getPushNotification", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const pushNotificationRepository = new PushNotificationRepository();
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
    const pushNotificationResult =
      await pushNotificationRepository.getPushNotification(
        body.pushNotificationId,
        body.deliveryContentCode
      );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: pushNotificationResult,
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

router.post("/postPushNotification", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const pushNotification = new PushNotificationRepository();
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
    let loginConId = getCognitoName(userInfo.userDetails);

    //トランザクション処理を開始
    pushNotification.startTransaction();

    let result = {};
    let pushNotificationId = "";

    //配信IDを採番する
    pushNotificationId = await pushNotification.getPushNotificationId();
    console.log(pushNotificationId);

    //pushNotificationリポジトリのpostPushNotificationInfoを使用
    const imageUrl = body.imageUrl.join(",");
    console.log(imageUrl);

    result = await pushNotification
      .postPushNotificationInfo(
        pushNotificationId,
        body.notificationTypeCode,
        body.deliveryContent,
        body.categoryCode,
        body.publicStartDate,
        body.publicStartTime,
        body.publicEndDate,
        body.subject,
        body.body,
        imageUrl,
        body.question1,
        body.question2,
        body.question3,
        body.question4,
        body.question5,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
        body.quizQuestion1,
        body.quizQuestion2,
        body.quizQuestion3,
        body.quizQuestion4,
        body.quizQuestion5,
        body.correctAnswer,
        body.quizCommentary,
        body.expireDate,
        body.expireTime,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
        body.additionalpoints,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
        body.additionalpoints2,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi EMD */
        body.consumptionpoints,
        body.questionCount,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
        body.quizQuestionCount,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi START */
        body.pushNotificationSendFlag,
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi END */
        loginConId
      )
      .catch((e) => {
        throw e;
      });

    //pushNotificationリポジトリのpostPushNotificationTargetを使用
    if (body.deliveryContent !== DELIVERY_CONTENT_INDEX.FORM) {
      //配信会員種別の登録
      let membershipTypeCode = body.membershipTypeCode.sort(function (a, b) {
        return a.value < b.value ? -1 : 1; //オブジェクトの昇順ソート
      });

      let indexMembership = 0;
      for (let membershipType of membershipTypeCode) {
        result = await pushNotification
          .postPushNotificationTarget(
            pushNotificationId,
            indexMembership,
            "3",
            membershipType.value,
            loginConId
          )
          .catch((e) => {
            throw e;
          });
        indexMembership++;
      }

      //業種の登録
      let industryCode = body.industryCode.sort(function (a, b) {
        return a.value < b.value ? -1 : 1; //オブジェクトの昇順ソート
      });

      let indexIndustry = 0;
      for (let industry of industryCode) {
        result = await pushNotification
          .postPushNotificationTarget(
            pushNotificationId,
            indexIndustry,
            "1",
            industry.value,
            loginConId
          )
          .catch((e) => {
            throw e;
          });
        indexIndustry++;
      }

      //都道府県の登録
      let prefectureCode = body.prefectureCode.sort(function (a, b) {
        return a.value < b.value ? -1 : 1; //オブジェクトの昇順ソート
      });

      let indexPrefecture = 0;
      for (let prefecture of prefectureCode) {
        result = await pushNotification
          .postPushNotificationTarget(
            pushNotificationId,
            indexPrefecture,
            "0",
            prefecture.value,
            loginConId
          )
          .catch((e) => {
            throw e;
          });
        indexPrefecture++;
      }
    }

    if (body.deliveryContent == DELIVERY_CONTENT_INDEX.FORM) {
      //利用者の登録
      let userIdList = body.userId.split(",");

      let indexUserId = 0;
      for (let userId of userIdList) {
        result = await pushNotification
          .postPushNotificationTarget(
            pushNotificationId,
            indexUserId,
            "2",
            userId,
            loginConId
          )
          .catch((e) => {
            throw e;
          });
        indexUserId++;
      }
    }

    // DBをコミット
    pushNotification.commit();

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    // DBをロールバック
    pushNotification.rollback();
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    pushNotification.endTransaction();
    console.log("end " + req.originalUrl);
  }
});

router.post("/checkPushNotification", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
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
    const pushNotification = new PushNotificationRepository();

    //利用者存在チェック
    const userId = "'" + body.userIdList.join("','") + "'";
    const pushNotificationResult = await pushNotification.checkPushNotification(
      body.pushNotificationId,
      userId
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: pushNotificationResult,
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
