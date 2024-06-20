import express from "express";
const router = express.Router();
import { RETURN_CODE } from "../../../common/constants/index.js";
import SurplusSoilRepository from "../repository/surplusSoilDisposal.js";
import { generateSurplusSoilDisposalSiteId } from "../../../common/util.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/searchSurplusSoilDisposalSite", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const surplusSoilRepository = new SurplusSoilRepository();
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
    const reviewResult =
      await surplusSoilRepository.searchSurplusSoilDisposalSite(
        body.disposalSiteName,
        body.address,
        body.isAcceptable,
        body.isUnacceptable,
        body.acceptancePeriodStartDate,
        body.acceptancePeriodEndDate,
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

router.post("/getSurplusSoilDisposalSite", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const surplusSoilRepository = new SurplusSoilRepository();
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
    const surplusSoilResult =
      await surplusSoilRepository.getSurplusSoilDisposalSite(
        body.disposalSiteId
      );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: surplusSoilResult,
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

router.post("/postSurplusSoilDisposalSite", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const surplusSoilRepository = new SurplusSoilRepository();
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
    let surplusSoilDisposalSiteId = "";
    let checkIdResult = true;

    do {
      //処理場IDの採番
      surplusSoilDisposalSiteId = generateSurplusSoilDisposalSiteId();
      checkIdResult =
        await surplusSoilRepository.checkSurplusSoilDisposalSiteId(
          surplusSoilDisposalSiteId
        );

      if (surplusSoilDisposalSiteId == "AAAAAAAA") {
        checkIdResult = true;
      }
    } while (checkIdResult[0].exists);

    const surplusSoilResult =
      await surplusSoilRepository.postSurplusSoilDisposalSite(
        surplusSoilDisposalSiteId,
        body.disposalSiteName,
        body.postal_code,
        body.prefecture_code,
        body.municipality_code,
        body.address,
        body.lng,
        body.lat,
        body.phone_number,
        body.manager_name,
        body.manager_phone_number,
        body.responsible_person_name,
        body.responsible_person_phone_number,
        body.surplus_soil_unit_price_10t_A,
        body.surplus_soil_unit_price_10t_B,
        body.surplus_soil_unit_price_10t_C,
        body.surplus_soil_unit_price_4t_A,
        body.surplus_soil_unit_price_4t_B,
        body.surplus_soil_unit_price_4t_C,
        body.acceptance_period_start_date,
        body.acceptance_period_end_date,
        body.is_acceptable,
        body.con_id
      );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: { surplusSoilDisposalSiteId: surplusSoilDisposalSiteId },
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

router.post("/updateSurplusSoilDisposalSite", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const surplusSoilRepository = new SurplusSoilRepository();
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
    await surplusSoilRepository.updateSurplusSoilDisposalSite(
      body.surplus_soil_disposal_site_id,
      body.disposalSiteName,
      body.postal_code,
      body.prefecture_code,
      body.municipality_code,
      body.address,
      body.lng,
      body.lat,
      body.phone_number,
      body.manager_name,
      body.manager_phone_number,
      body.responsible_person_name,
      body.responsible_person_phone_number,
      body.surplus_soil_unit_price_10t_A,
      body.surplus_soil_unit_price_10t_B,
      body.surplus_soil_unit_price_10t_C,
      body.surplus_soil_unit_price_4t_A,
      body.surplus_soil_unit_price_4t_B,
      body.surplus_soil_unit_price_4t_C,
      body.acceptance_period_start_date,
      body.acceptance_period_end_date,
      body.is_acceptable,
      body.con_id,
      body.update_datetime
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
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
