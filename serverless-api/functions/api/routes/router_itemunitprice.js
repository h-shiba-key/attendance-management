import express from "express";
const router = express.Router();
import { RETURN_CODE, PREFIX } from "../../../common/constants/index.js";
import ContractorRepository from "../repository/contractor.js";
import ItemUnitPriceRepository from "../repository/itemUnitPrice.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/getItemUnitPriceData", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const itemUnitPriceRepository = new ItemUnitPriceRepository();
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
    const itemUnitPriceResult =
      await itemUnitPriceRepository.getItemUnitPriceData(body.conId);
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: itemUnitPriceResult,
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

router.post("/getItemUnitPriceList", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const itemUnitPriceRepository = new ItemUnitPriceRepository();
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
    const itemUnitPriceResult =
      await itemUnitPriceRepository.getItemUnitPriceList(body.conId);
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: itemUnitPriceResult,
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

router.post("/getDisposalAcceptableDate", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const itemUnitPriceRepository = new ItemUnitPriceRepository();
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
    const itemUnitPriceResult =
      await itemUnitPriceRepository.getDisposalAcceptableDate(body.conId);
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: itemUnitPriceResult,
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

router.post("/getSaleAcceptableDate", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const itemUnitPriceRepository = new ItemUnitPriceRepository();
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
    const itemUnitPriceResult =
      await itemUnitPriceRepository.getSaleAcceptableDate(body.conId);
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: itemUnitPriceResult,
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

router.post("/getWorkableDate", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const itemUnitPriceRepository = new ItemUnitPriceRepository();
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
    const itemUnitPriceResult = await itemUnitPriceRepository.getWorkableDate(
      body.conId
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: itemUnitPriceResult,
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

router.post("/putItemUnitPrice", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const itemUnitPriceRepository = new ItemUnitPriceRepository();
  const contractorRepository = new ContractorRepository();
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

    let result = {};
    let conId = loginConId;

    if (loginConId.charAt(0) == PREFIX.ADMIN) {
      conId = body.conId;

      // 承認状態取得
      const approvalStatus = await contractorRepository.getApprovalStatus(
        body.conId
      );
      /* 0.5次開発、1次開発の改善 No.51 品目の自社、利用業者の共同編集対応 2022/09/20 Y.Takagi START */
      const isActive = await contractorRepository.getContractorInfo(conId);

      if (!(approvalStatus == 3) && !(approvalStatus == 1 && isActive)) {
        /* 0.5次開発、1次開発の改善 No.51 品目の自社、利用業者の共同編集対応 2022/09/20 Y.Takagi END */
        // 自社登録データ（デフォルトデータ）でない場合はアクセスできない
        throw "実行権限がありません。";
      }
    }

    let itemUnitPriceResult = await itemUnitPriceRepository
      .putItemUnitPrice(
        conId,
        body.itemUnitPriceData,
        body.itemUnitPriceList,
        body.disposalAcceptableDate,
        body.saleAcceptableDate,
        body.workableDate,
        loginConId
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        throw e;
      });
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      result: itemUnitPriceResult,
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
