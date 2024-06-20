import express from "express";
const router = express.Router();
import { RETURN_CODE } from "../../../common/constants/index.js";
import JobRepository from "../repository/job.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/getJobStatus", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const jobRepository = new JobRepository();
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
    let jobRresult = await jobRepository.getJobStatus(body.jobId);
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: jobRresult,
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

router.post("/postJob", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const jobRepository = new JobRepository();
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

    jobRepository.startTransaction();

    let jobRresult = await jobRepository
      .postJob(body.jobGroupCode, body.status, loginConId)
      .catch((e) => {
        throw e;
      });

    jobRepository.commit();
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: jobRresult,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    // DBをロールバック
    jobRepository.rollback();
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    jobRepository.endTransaction();
    console.log("end " + req.originalUrl);
  }
});

router.post("/putJobStatus", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const jobRepository = new JobRepository();
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

    jobRepository.startTransaction();

    let jobRresult = await jobRepository
      .putJobStatus(body.jobId, body.status, body.errorMessage, loginConId)
      .catch((e) => {
        throw e;
      });

    jobRepository.commit();

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: jobRresult,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    // DBをロールバック
    jobRepository.rollback();
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    jobRepository.endTransaction();
    console.log("end " + req.originalUrl);
  }
});

export default router;
