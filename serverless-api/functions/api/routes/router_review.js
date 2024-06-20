import express from "express";
const router = express.Router();
import { RETURN_CODE } from "../../../common/constants/index.js";
import ReviewRepository from "../repository/review.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/searchReview", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const reviewRepository = new ReviewRepository();
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
    const reviewResult = await reviewRepository.searchReview(
      body.reviewer,
      body.contractorName,
      body.prefectureCode,
      body.municipalityCode,
      body.reviewDateStart,
      body.reviewDateEnd,
      body.reviewRatingStart,
      body.reviewRatingEnd,
      body.reviewContains,
      body.rowsPerPage,
      body.offset
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      searchResult: reviewResult,
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

router.post("/deleteReview", async (req, res) => {
  let apiResult = null;
  const reviewRepository = new ReviewRepository();
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
    let loginConId = getCognitoName(userInfo.userDetails);
    console.log(userInfo);

    let body = req.body;
    const reviewResult = await reviewRepository.deleteReview(
      body.reviewId,
      loginConId
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: reviewResult,
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

//サンプルコード
// router.post("/getAcquisitionMonth", async (req, res) => {
//   console.log("run " + req.originalUrl);
//   let apiResult = null;
//   const reviewRepository = new ReviewRepository();
//   try {
    // ユーザー情報取得とAPI呼び出し権限チェック
    // let checkResult = await checkUserAPICall(
    //   req.originalUrl,
    //   req.headers.authorization
    // );
    // if (checkResult.return_code === RETURN_CODE.ERROR) {
    //   throw checkResult.message;
    // }
    // let userInfo = checkResult.result;
    // console.log(userInfo);

//     let body = req.body;
//     const reviewResult = await reviewRepository.getAcquisitionMonth(body.employeeId);
//     apiResult = {
//       return_code: RETURN_CODE.SUCCESS,
//       result: reviewResult,
//     };
//     res.json(apiResult);
//     console.log(apiResult);
//   } catch (e) {
//     apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
//     res.json(apiResult);
//     console.error(apiResult);
//   } finally {
//     console.log("end " + req.originalUrl);
//   }
// });

//参考
router.post("/getReview", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const reviewRepository = new ReviewRepository();
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
    const reviewResult = await reviewRepository.getReview(body.reviewId);
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: reviewResult,
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
