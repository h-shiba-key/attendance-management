import { RETURN_CODE, PREFIX } from "../constants/index.js";
import { accessTokenAuthorizer } from "./access_token_authorizer.js";

const API_AUTH_NO_LOGIN = "noLogin";
const API_AUTH_ADMIN = "admin";
const API_AUTH_CONTRACTOR = "contractor";
const API_GETPREFECTURE = "/master/getPrefecture";
const API_GETMUNICIPALITY = "/master/getMunicipality";
const API_GETITEMMAJORCLASS = "/master/getItemMajorClass";
const API_GETITEMMINORCLASS = "/master/getItemMinorClass";
const API_GETCODE = "/master/getCode";
const API_GETCATEGORY = "/master/getCategory";
const API_GET_BANK_NAME = "/master/getBankName";
const API_GET_BANK_BRANCH_NAME = "/master/getBankBranchName";
const API_GETNOTIFICATION = "/notification/getNotification";
const API_GETNOTIFICATIONFORADMIN = "/notification/getNotificationForAdmin";
const API_GETREPORTFORADMIN = "/notification/getReportForAdmin";
const API_GETNOTIFICATIONAPP = "/notification/getNotificationApp";
const API_GETNUMBEROFNOTIFICATIONS = "/notification/getNumberOfNotifications";
const API_GETCONTRACTOR = "/contractor/getContractor";
const API_GETCONTRACTORINFO = "/contractor/getContractorInfo";
const API_CHECK_UNIQUE_LOGINID_FOR_CONTRACTOR =
  "/contractor/checkUniqueLoginIdForContractor";
const API_PUTCONTRACTOR = "/contractor/putContractor";
const API_SEARCHCONTRACTOR = "/contractor/searchContractor";
const API_GETAPPROVALSTATUS = "/contractor/getApprovalStatus";
const API_GETREFERRALSOURCE = "/contractor/getReferralSource";
const API_SEARCHCONTRACTORFORAPPLICATION =
  "/contractor/searchContractorForApplication";
const API_INSERT_CONTRACTOR = "/contractor/insertContractor";
const API_GET_JOB_STATUS = "/job/getJobStatus";
const API_POST_JOB = "/job/postJob";
const API_PUT_JOB_STATUS = "/job/putJobStatus";
const API_SEARCHPUSHNOTIFICATION = "/pushnotification/searchPushNotification";
const API_GETPUSHNOTIFICATION = "/pushnotification/getPushNotification";
const API_POSTPUSHNOTIFICATION = "/pushnotification/postPushNotification";
const API_CHECKPUSHNOTIFICATION = "/pushnotification/checkPushNotification";
const API_SEARCHREVIEW = "/review/searchReview";
const API_DELETEREVIEW = "/review/deleteReview";
const API_GETREVIEW = "/review/getReview";
//サンプルコード
const API_GET_ACQUISITION_MONTH = "/review/getAcquisitionMonth";
const API_LOCAL_GETREVIEW="review/localgetReview";
const API_SEARCH_SURPLUS_SOIL_DISPOSAL_SITE =
  "/surplussoildisposal/searchSurplusSoilDisposalSite";
const API_GETSURPLUS_SOIL_DISPOSAL_SITE =
  "/surplussoildisposal/getSurplusSoilDisposalSite";
const API_POST_SURPLUS_SOIL_DISPOSAL_SITE =
  "/surplussoildisposal/postSurplusSoilDisposalSite";
const API_UPDATE_SURPLUS_SOIL_DISPOSAL_SITE =
  "/surplussoildisposal/updateSurplusSoilDisposalSite";
const API_SEARCH_EMPLOYEE = "/employee/searchEmployee";
const API_GET_EMPLOYEE = "/employee/getEmployee";
const API_GET_REGISTRATION_NUMBER = "/employee/getRegistrationNumber";
const API_POST_EMPLOYEE = "/employee/postEmployee";
const API_UPDATE_EMPLOYEE = "/employee/updateEmployee";
const API_DELETE_EMPLOYEE = "/employee/deleteEmployee";
const API_GET_BASIC_INFO = "/basicInfo/getBasicInfo";
const API_PUT_BASIC_INFO = "/basicInfo/putBasicInfo";
const API_GET_ITEM_UNIT_PRICE_DATA = "/itemunitprice/getItemUnitPriceData";
const API_GET_ITEM_UNIT_PRICE_LIST = "/itemunitprice/getItemUnitPriceList";
const API_GET_DISPOSAL_ACCEPTABLE_DATE =
  "/itemunitprice/getDisposalAcceptableDate";
const API_GET_SALE_ACCEPTABLE_DATE = "/itemunitprice/getSaleAcceptableDate";
const API_GET_WORKABLE_DATE = "/itemunitprice/getWorkableDate";
const API_PUT_ITEM_UNIT_PRICE = "/itemunitprice/putItemUnitPrice";
const API_GET_UPLOAD_URL = "/filemanager/getUploadUrl";
const API_GET_COMMON_UPLOAD_URL = "/filemanager/getCommonUploadUrl";
const API_CHECK_UNIQUE_EMPLOYEE_ID = "/api/checkUniqueEmployeeId";
const API_GET_USER_INFO_FOR_MAIL = "/api/getUserInfoForMail";
const API_CHECK_SURPLUS_SOIL_DISPOSAL_SITE_ID =
  "/api/checkSurplusSoilDisposalSiteId";

const API_SETTING = {
  [API_GETPREFECTURE]: {
    auth: [API_AUTH_NO_LOGIN, API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GETMUNICIPALITY]: {
    auth: [API_AUTH_NO_LOGIN, API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GETITEMMAJORCLASS]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GETITEMMINORCLASS]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GETCODE]: {
    auth: [API_AUTH_NO_LOGIN, API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GETCATEGORY]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GET_BANK_NAME]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GET_BANK_BRANCH_NAME]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GETNOTIFICATION]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GETNOTIFICATIONFORADMIN]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_GETREPORTFORADMIN]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_GETNOTIFICATIONAPP]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GETCONTRACTOR]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_GETCONTRACTORINFO]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_CHECK_UNIQUE_LOGINID_FOR_CONTRACTOR]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_PUTCONTRACTOR]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_SEARCHCONTRACTOR]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_GETAPPROVALSTATUS]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_GETREFERRALSOURCE]: {
    auth: [API_AUTH_ADMIN, API_AUTH_NO_LOGIN],
  },
  [API_SEARCHCONTRACTORFORAPPLICATION]: {
    auth: [API_AUTH_NO_LOGIN, API_AUTH_ADMIN],
  },
  [API_INSERT_CONTRACTOR]: {
    auth: [API_AUTH_NO_LOGIN],
  },
  [API_GET_JOB_STATUS]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_POST_JOB]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_PUT_JOB_STATUS]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_SEARCHPUSHNOTIFICATION]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_GETPUSHNOTIFICATION]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_POSTPUSHNOTIFICATION]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_CHECKPUSHNOTIFICATION]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_SEARCHREVIEW]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_DELETEREVIEW]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_GETREVIEW]: {
    auth: [API_AUTH_ADMIN],
  },
  //サンプルコード
  [API_GET_ACQUISITION_MONTH]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_LOCAL_GETREVIEW]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_SEARCH_SURPLUS_SOIL_DISPOSAL_SITE]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_GETSURPLUS_SOIL_DISPOSAL_SITE]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_POST_SURPLUS_SOIL_DISPOSAL_SITE]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_UPDATE_SURPLUS_SOIL_DISPOSAL_SITE]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_SEARCH_EMPLOYEE]: {
    auth: [API_AUTH_CONTRACTOR],
  },
  [API_GET_EMPLOYEE]: {
    auth: [API_AUTH_CONTRACTOR],
  },
  [API_GET_REGISTRATION_NUMBER]: {
    auth: [API_AUTH_CONTRACTOR],
  },
  [API_POST_EMPLOYEE]: {
    auth: [API_AUTH_CONTRACTOR],
  },
  [API_UPDATE_EMPLOYEE]: {
    auth: [API_AUTH_CONTRACTOR],
  },
  [API_DELETE_EMPLOYEE]: {
    auth: [API_AUTH_CONTRACTOR],
  },
  [API_GET_BASIC_INFO]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_PUT_BASIC_INFO]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GET_ITEM_UNIT_PRICE_DATA]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GET_ITEM_UNIT_PRICE_LIST]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GET_DISPOSAL_ACCEPTABLE_DATE]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GET_SALE_ACCEPTABLE_DATE]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GET_WORKABLE_DATE]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_PUT_ITEM_UNIT_PRICE]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GETNUMBEROFNOTIFICATIONS]: {
    auth: [API_AUTH_ADMIN, API_AUTH_CONTRACTOR],
  },
  [API_GET_UPLOAD_URL]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_GET_COMMON_UPLOAD_URL]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_CHECK_SURPLUS_SOIL_DISPOSAL_SITE_ID]: {
    auth: [API_AUTH_ADMIN],
  },
  [API_CHECK_UNIQUE_EMPLOYEE_ID]: {
    auth: [API_AUTH_CONTRACTOR],
  },
  [API_GET_USER_INFO_FOR_MAIL]: {
    auth: [API_AUTH_CONTRACTOR],
  },
};

export function getCognitoName(user) {
  let name = user.Attributes.filter((element) => {
    return element.Name === "name";
  })[0].Value;
  return name;
}

export async function checkUserAPICall(cmd, accessToken) {
  try {
    if (accessToken) {
      accessToken = accessToken.replace("Bearer ", "");
    } else {
      accessToken = "";
    }

    const setting = API_SETTING[cmd];
    if (setting == undefined) {
      // 存在しない
      throw "API settings not found";
    }

    let userInfo = null;
    let loginConId = "";

    if (accessToken !== "") {
      userInfo = await accessTokenAuthorizer(accessToken);
      if (userInfo.return_code === RETURN_CODE.ERROR) {
        throw userInfo.message;
      }
      loginConId = getCognitoName(userInfo.result.userDetails);
    }
    console.log(loginConId);

    if (loginConId === "") {
      if (setting.auth.indexOf(API_AUTH_NO_LOGIN) < 0) {
        // ログインユーザーの権限不正
        throw "Do not have permission to call this API (" + loginConId + ")";
      }
      //contractorinfo.name(con_id)の頭文字が「A」の時、管理者とする。
    } else if (loginConId.charAt(0) == PREFIX.ADMIN) {
      if (setting.auth.indexOf(API_AUTH_ADMIN) < 0) {
        // ログインユーザーの権限不正
        throw "Do not have permission to call this API (" + loginConId + ")";
      }
      //contractorinfo.name(con_id)の頭文字が「C」の時、業者とする。
    } else if (loginConId.charAt(0) == PREFIX.CONTRACTOR) {
      if (setting.auth.indexOf(API_AUTH_CONTRACTOR) < 0) {
        // ログインユーザーの権限不正
        throw "Do not have permission to call this API (" + loginConId + ")";
      }
    } else {
      // ログインユーザーの権限不正
      throw "Do not have permission to call this API (" + loginConId + ")";
    }
    let res = null;
    if (loginConId === "") {
      res = { return_code: RETURN_CODE.SUCCESS, result: null };
    } else {
      res = { return_code: RETURN_CODE.SUCCESS, result: userInfo.result };
    }
    return res;
  } catch (e) {
    return { return_code: RETURN_CODE.ERROR, message: e };
  }
}
