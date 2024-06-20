import express from "express";
const router = express.Router();
import { RETURN_CODE } from "../../../common/constants/index.js";
import { generateEmployeeId, generateLoginId } from "../../../common/util.js";
import EmployeeRepository from "../repository/employee.js";
import CognitoUser from "../repository/cognitoUser.js";
import sendMail from "../repository/sendMail.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/searchEmployee", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const employeeRepository = new EmployeeRepository();
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

    //emoloyeeリポジトリのsearchEmployeeを使用
    let employeeResult = await employeeRepository.searchEmployee(
      loginConId,
      body.sei,
      body.mei,
      body.phoneNumber,
      body.offset,
      body.rowsPerPage
    );

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      searchResult: employeeResult,
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

router.post("/getEmployee", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const employeeRepository = new EmployeeRepository();
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

    const basicInfoResult = await employeeRepository.getEmployee(
      loginConId,
      body.employeeId
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: basicInfoResult,
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

router.post("/getRegistrationNumber", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const employeeRepository = new EmployeeRepository();
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

    let employeeResult = {
      totalNumber: 0, //従業員総数
      registrableNumber: 0, //登録可能数
    };

    //emoloyeeリポジトリのgetRegistrationNumberを使用
    employeeResult = await employeeRepository.getRegistrationNumber(loginConId);

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: employeeResult,
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

router.post("/postEmployee", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const employeeRepository = new EmployeeRepository();
  const cognitoUser = new CognitoUser();
  let result = {};
  let checkIdResult = true;
  let employeeId = "";
  let loginId = "";
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

    /* 0.5次開発、1次開発の改善 不具合管理表No.1 2022/09/08 Y.Takagi START */
    employeeRepository.startTransaction();
    /* 0.5次開発、1次開発の改善 不具合管理表No.1 2022/09/08 Y.Takagi END */

    do {
      //従業員IDを採番する
      employeeId = generateEmployeeId();

      //従業員IDの重複を確認する
      checkIdResult = await employeeRepository.checkUniqueEmployeeId(
        employeeId
      );
    } while (checkIdResult[0].exists);

    do {
      //ログインIDを採番する
      loginId = generateLoginId(8);

      //ログインIDの重複を確認する
      checkResult = await employeeRepository.checkUniqueLoginId(loginId);
    } while (checkResult[0].exists);

    //emoloyeeリポジトリのpostEmployeeを使用
    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
    result = await employeeRepository
      .postEmployee(
        employeeId,
        loginId,
        body.sei,
        body.mei,
        body.seiKana,
        body.meiKana,
        body.phoneNumber,
        loginConId
      )
      /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */
      .then(() => {
        return {
          result: RETURN_CODE.SUCCESS,
          loginId: loginId,
        };
      })
      .catch((e) => {
        return {
          result: RETURN_CODE.ERROR,
          message: e,
        };
      });

    if (result.result == RETURN_CODE.SUCCESS) {
      //メールアドレスを取得する
      const userInfo = await employeeRepository.getUserInfoForMail(loginConId);

      /* 0.5次開発、1次開発の改善 不具合管理表No.1 2022/09/08 Y.Takagi START */
      //登録が成功した場合、Cognitoへの登録処理を行う
      await cognitoUser
        .cognitoCreateUser({
          conId: employeeId, //従業員ID
          loginId: loginId, //生成したログインID
          password: body.password, //生成したパスワード
        })
        .then((result) => {
          // 結果を出力
          console.log(result);
          // エラーがある場合、catchにスローする
          if (result.return_code === RETURN_CODE.ERROR) {
            console.log("cognito error");
            throw result.message;
          }
        });

      //登録したログインIDをメール送信
      await sendMail({
        mailCode: "04", //テンプレートコード
        emailAddress: userInfo[0].emailAddress, //メールアドレス
        name: userInfo[0].name, //業者名
        loginId: loginId, //ログインID
        password: body.password, //パスワード
        /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
        employeeName: body.sei + "　" + body.mei, //従業員氏名
        employeeNameKana: body.seiKana + " " + body.meiKana, //従業員氏名カナ名
        /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */
        employeePhoneNumber: body.phoneNumber, //連絡先（電話番号）
      }).then((result) => {
        // 結果を出力
        console.log(result);
        // エラーがある場合、catchにスローする
        if (result.return_code === RETURN_CODE.ERROR) {
          console.log("mail error");
          throw result.message;
        }
      });

      //登録したログインIDをSMS送信
      await sendMail({
        mailCode: "08", //テンプレートコード
        loginId: loginId, //ログインID
        password: body.password, //パスワード
        employeePhoneNumber: body.phoneNumber,
      }).then((result) => {
        // 結果を出力
        console.log(result);
        // エラーがある場合、catchにスローする
        if (result.return_code === RETURN_CODE.ERROR) {
          console.log("SMS error");
          throw result.message;
        }
      });

      /* 0.5次開発、1次開発の改善 不具合管理表No.1 2022/09/08 Y.Takagi END */
    } else {
      throw result.message;
    }

    // DBをコミット
    employeeRepository.commit();

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: { loginId: loginId },
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    // DBをロールバック
    employeeRepository.rollback();
    console.error(apiResult);
    console.log("error loginid = " + loginId);
    // cognitoに登録されている場合、ユーザを削除する。
    try {
      cognitoUser.cognitoDeleteUser({
        loginId: loginId, //生成したログインID
      });
    } catch (e) {
      apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    }
    res.json(apiResult);
  } finally {
    employeeRepository.endTransaction();
    console.log("end " + req.originalUrl);
  }
});

router.post("/updateEmployee", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const employeeRepository = new EmployeeRepository();
  const cognitoUser = new CognitoUser();
  let result = {};

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

    employeeRepository.startTransaction();

    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/09/09 Y.Murase START */
    result = await employeeRepository
      .updateEmployee(
        body.employeeId,
        body.sei,
        body.mei,
        body.seiKana,
        body.meiKana,
        body.phoneNumber,
        loginConId,
        body.updateDateTime
      )
      /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/09/09 Y.Murase END */
      .then((res) => {
        return res;
      })
      .catch((e) => {
        throw e;
      });

    //メールアドレスを取得する
    const userMailInfo = await employeeRepository.getUserInfoForMail(
      loginConId
    );

    if (body.password) {
      Promise.allSettled([
        //パスワードが変更されている場合、Cognitoへのパスワード変更処理を行う
        await cognitoUser.cognitoChangePassword({
          loginId: body.loginId, //ログインID
          password: body.password, //パスワード
        }),
        //登録したパスワードをメール送信
        sendMail({
          mailCode: "07", //テンプレートコード
          emailAddress: userMailInfo[0].emailAddress, //メールアドレス
          name: userMailInfo[0].name, //業者名
          loginId: body.loginId, //ログインID
          /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/09/09 Y.Murase START */
          employeeName: body.sei + "　" + body.mei, //従業員氏名
          employeeNameKana: body.seiKana + " " + body.meiKana, //従業員氏名カナ名
          /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/09/09 Y.Murase END */
          employeePhoneNumber: body.phoneNumber, //連絡先（電話番号）
          password: body.password, //パスワード
        }),
        //登録したログインIDをSMS送信
        sendMail({
          mailCode: "09", //テンプレートコード
          loginId: body.loginId, //ログインID
          password: body.password, //パスワード
          employeePhoneNumber: body.phoneNumber,
        }),
      ]).then((results) => results.forEach((results) => console.log(results)));
    } else {
      //更新後の情報をメール送信
      sendMail({
        mailCode: "06", //テンプレートコード
        emailAddress: userMailInfo[0].emailAddress, //メールアドレス
        name: userMailInfo[0].name, //業者名
        loginId: body.loginId, //ログインID
        /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/09/09 Y.Murase START */
        employeeName: body.sei + "　" + body.mei, //従業員氏名
        employeeNameKana: body.seiKana + " " + body.meiKana, //従業員氏名カナ名
        /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/09/09 Y.Murase END */
        employeePhoneNumber: body.phoneNumber, //連絡先（電話番号）
      }).then((results) => console.log(results));
    }

    // DBをコミット
    employeeRepository.commit();

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    // DBをロールバック
    employeeRepository.rollback();
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    employeeRepository.endTransaction();
    console.log("end " + req.originalUrl);
  }
});

router.post("/deleteEmployee", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const employeeRepository = new EmployeeRepository();
  const cognitoUser = new CognitoUser();
  let result = {};

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

    employeeRepository.startTransaction();

    //emoloyeeリポジトリのdeleteEmployeeを使用
    result = await employeeRepository
      .deleteEmployee(body.employeeId, loginConId, body.updateDateTime)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        throw e;
      });

    cognitoUser
      .cognitoUpdateUser({
        loginId: body.loginId, //ログインID
      })
      .then((results) => console.log(results));

    // DBをコミット
    employeeRepository.commit();

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    // DBをロールバック
    employeeRepository.rollback();
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    employeeRepository.endTransaction();
    console.log("end " + req.originalUrl);
  }
});

export default router;
