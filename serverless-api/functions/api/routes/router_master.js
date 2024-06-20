import express from "express";
const router = express.Router();
import { RETURN_CODE } from "../../../common/constants/index.js";
import MasterRepository from "../repository/master.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/getPrefecture", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const masterRepository = new MasterRepository();
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

    const masterResult = await masterRepository.getPrefecture();
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: masterResult,
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

router.post("/getMunicipality", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const masterRepository = new MasterRepository();
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
    const masterResult = await masterRepository.getMunicipality(
      body.prefectureCode
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: masterResult,
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

router.post("/getItemMajorClass", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const masterRepository = new MasterRepository();
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
    const masterResult = await masterRepository.getItemMajorClass(
      body.item_divisions
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: masterResult,
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

router.post("/getItemMinorClass", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const masterRepository = new MasterRepository();
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
    const masterResult = await masterRepository.getItemMinorClass();
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: masterResult,
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

router.post("/getCode", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const masterRepository = new MasterRepository();
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
    const masterResult = await masterRepository.getCode(body.groupCode);
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: masterResult,
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

router.post("/getCategory", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const masterRepository = new MasterRepository();
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

    const masterResult = await masterRepository.getCategory();
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: masterResult,
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

router.post("/getBankName", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const masterRepository = new MasterRepository();
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
    let masterResult = await masterRepository.getBankName(body.bankCode);
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: masterResult,
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

router.post("/getBankBranchName", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const masterRepository = new MasterRepository();
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
    let masterResult = await masterRepository.getBankBranchName(
      body.bankCode,
      body.bankBranchCode
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: masterResult,
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
