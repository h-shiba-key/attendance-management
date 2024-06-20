import express from "express";
const router = express.Router();
import { RETURN_CODE } from "../../../common/constants/index.js";
import { BUTTON_TYPE_INDEX } from "../../../common/constants/contractor.js";
import { generateContractorId } from "../../../common/util.js";
import ContractorRepository from "../repository/contractor.js";
import CognitoUser from "../repository/cognitoUser.js";
import sendMail from "../repository/sendMail.js";
import {
  checkUserAPICall,
  getCognitoName,
} from "../../../common/authorization/api_setting.js";

router.post("/getContractor", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
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
    let contractorResult = await contractorRepository.getContractor(body.conId);
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
// getContractorInfo

router.post("/getApprovalStatus", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
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
    let contractorResult = await contractorRepository.getContractorInfo(
      body.conId
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

router.post("/checkUniqueLoginIdForContractor", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
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
    let contractorResult =
      await contractorRepository.checkUniqueLoginIdForContractor(body.loginId);
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

router.post("/putContractor", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
  const contractorRepository = new ContractorRepository();
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

    contractorRepository.startTransaction();

    if (body.updateType === BUTTON_TYPE_INDEX.APPROVAL) {
      await contractorRepository
        .putContractor(
          body.conId,
          body.loginId,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          body.approvalStatus,
          "",
          body.isActive,
          body.updateDatetime,
          loginConId
        )
        .catch((e) => {
          throw e;
        });

      Promise.allSettled([
        //登録が成功した場合、Cognitoへの登録処理を行う
        cognitoUser.cognitoCreateUser({
          conId: body.conId, //業者ID
          loginId: body.loginId, //生成したログインID
          password: body.password, //生成したパスワード
        }),
        //更新後のログインID,パスワードをメール送信
        sendMail({
          mailCode: "02", //テンプレートコード
          emailAddress: body.emailAddress, //メールアドレス
          name: body.name, //業者名
          loginId: body.loginId, //生成したログインID
          password: body.password, //生成したパスワード
        }),
      ]).catch((e) => {
        throw e;
      });
    } else if (body.updateType === BUTTON_TYPE_INDEX.DISAPPROVAL) {
      result = await contractorRepository
        .putContractor(
          body.conId,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          body.approvalStatus,
          body.rejectionReasons,
          body.isActive,
          body.updateDatetime,
          loginConId
        )
        .then((res) => {
          return res;
        })
        .catch((e) => {
          throw e;
        });
    } else if (body.updateType === BUTTON_TYPE_INDEX.ACTIVE) {
      await contractorRepository
        .putContractor(
          body.conId,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          body.approvalStatus,
          "",
          body.isActive,
          body.updateDatetime,
          loginConId
        )
        .catch((e) => {
          throw e;
        });

      if (body.loginId) {
        let ret = await cognitoUser.cognitoUpdateUser({
          loginId: body.loginId, //ログインID
          isActive: body.isActive, //利用状態
        });
      }
    } else if (body.updateType === BUTTON_TYPE_INDEX.INACTIVE) {
      await contractorRepository
        .putContractor(
          body.conId,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          body.approvalStatus,
          "",
          body.isActive,
          body.updateDatetime,
          loginConId
        )
        .then((res) => {
          return res;
        })
        .catch((e) => {
          throw e;
        });

      if (body.loginId) {
        let ret = await cognitoUser.cognitoUpdateUser({
          loginId: body.loginId, //ログインID
          isActive: body.isActive, //利用状態
        });
      }
    } else if (body.updateType === BUTTON_TYPE_INDEX.UPDATE) {
      result = await contractorRepository
        .putContractor(
          body.conId,
          body.loginId,
          body.name,
          body.postalCode,
          body.prefectureCode,
          body.municipalityCode,
          body.address,
          body.lng,
          body.lat,
          body.phoneNumber,
          body.faxNumber,
          body.emailAddress,
          body.referralSource,
          body.branchName,
          body.approvalStatus,
          body.rejectionReasons,
          body.isActive,
          body.updateDatetime,
          loginConId
        )
        .then((res) => {
          return res;
        })
        .catch((e) => {
          throw e;
        });
    }
    contractorRepository.commit();
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
    };
    res.json(apiResult);
    console.log(apiResult);
  } catch (e) {
    apiResult = { return_code: RETURN_CODE.ERROR, error_message: e };
    // DBをロールバック
    contractorRepository.rollback();
    res.json(apiResult);
    console.error(apiResult);
  } finally {
    contractorRepository.endTransaction();
    console.log("end " + req.originalUrl);
  }
});

router.post("/searchContractor", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
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
    const contractorResult = await contractorRepository.searchContractor(
      /* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi START */
      body.disposal,
      body.sale,
      /* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi END */
      body.unapproval,
      body.approval,
      body.disapproval,
      body.selfRegistration,
      body.name,
      body.branchName,
      body.prefectureCode,
      body.municipalityCode,
      body.isActive,
      body.rowsPerPage,
      body.offset
    );
    apiResult = {
      return_code: RETURN_CODE.SUCCESS,
      searchResult: contractorResult,
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

router.post("/getApprovalStatus", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
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
    const contractorResult = await contractorRepository.getApprovalStatus(
      body.conId
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

router.post("/getReferralSource", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
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

    const contractorResult = await contractorRepository.getReferralSource();
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

router.post("/searchContractorForApplication", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
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
    let contractorResult =
      await contractorRepository.searchContractorForApplication(
        body.name,
        body.postalCode
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

//新規利用申請登録処理
router.post("/insertContractor", async (req, res) => {
  console.log("run " + req.originalUrl);
  let apiResult = null;
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
    let conId = "";
    let checkIdResult = true;

    //業者ID採番
    do {
      conId = generateContractorId();
      checkIdResult = await contractorRepository.checkUniqueConId(conId);
    } while (checkIdResult[0].exists);

    await contractorRepository.insertContractor(
      conId,
      body.name,
      body.branchName,
      body.postalCode,
      body.prefecture.value,
      body.municipality.value,
      body.address,
      body.lng,
      body.lat,
      body.phoneNumber,
      body.faxNumber,
      body.emailAddress,
      body.referralSource,
      body.planCode,
      body.selfRegistConId,
      body.registrationDivision,
      body.prefecture,
      body.municipality
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
