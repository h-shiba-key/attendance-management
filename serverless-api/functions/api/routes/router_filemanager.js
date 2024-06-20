import express from "express";
const router = express.Router();
import { RETURN_CODE } from "../../../common/constants/index.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";
import FileManagerRepository from "../repository/fileManager.js";

// アップロード用URL取得
router.post("/getUploadUrl", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const fileManagerRepository = new FileManagerRepository();
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
    let fileResult = await fileManagerRepository.getUploadUrl(
      body.job_id,
      body.file_name,
      body.folder_name
    );

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: fileResult,
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

// アップロード用URL取得
router.post("/getCommonUploadUrl", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const fileManagerRepository = new FileManagerRepository();
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
    let fileResult = await fileManagerRepository.getCommonUploadUrl(
      body.file_name,
      body.folder_name,
      body.feature_name
    );

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: fileResult,
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
