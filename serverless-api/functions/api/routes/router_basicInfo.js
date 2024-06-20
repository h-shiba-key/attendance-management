import express from "express";
const router = express.Router();
import { RETURN_CODE } from "../../../common/constants/index.js";
import BasicInfoRepository from "../repository/basicInfo.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/getBasicInfo", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const basicInfoRepository = new BasicInfoRepository();
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
    const basicInfoResult = await basicInfoRepository.getBasicInfo(body.conId);
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

router.post("/putBasicInfo", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const basicInfoRepository = new BasicInfoRepository();
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

    basicInfoRepository.startTransaction();

    const basicInfoResult = await basicInfoRepository
      .putBasicInfo(
        body.conName,
        body.branchName,
        body.salesManagerName,
        body.postalCode,
        body.prefectureCode,
        body.municipalityCode,
        body.address,
        body.lat,
        body.lng,
        body.phoneNumber,
        body.faxNumber,
        body.emailAddress,
        body.disposalLicenseNumber,
        body.isExcellentCertified,
        body.isIsoHolder,
        body.isEcoActionHolder,
        body.isPurchaser,
        body.isTransportDisposalCompany,
        body.isContainerInstallationDisposal,
        body.licenseFileName,
        body.constructionLicenseType,
        body.constructionLicenseDiv,
        body.constructionLicenseYear,
        body.constructionLicenseNumber,
        body.constructionLicenseIndustry,
        body.transportLicenseNumber,
        body.securityLicenseNumber,
        body.laborDispatchLicenseNumber,
        body.bankCode,
        body.bankBranchCode,
        body.accountType,
        body.accountCode,
        body.accountHolder,
        body.updateDatetime,
        loginConId,
        body.conId
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        throw e;
      });

    // DBをコミット
    basicInfoRepository.commit();

    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: basicInfoResult,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    // DBをロールバック
    basicInfoRepository.rollback();
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    basicInfoRepository.endTransaction();
    console.log("end " + req.originalUrl);
  }
});

export default router;
