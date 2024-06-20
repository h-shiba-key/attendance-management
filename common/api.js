// クライアントからAPIをリクエスト
const { HTTP_OPTION_MULTIPART_FORMDATA } = require("./constants/HTTP");
import axios from "axios";
import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
    userPoolWebClientId:
      process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLWEBCLIENTID,
  },
  ssr: true,
});

export default class api {
  static dispatchShowProcessing = null;
  static dispatchHideProcessing = null;

  static post = (url, param, option) => {
    let _param = {};
    if (param) {
      _param = param;
    }
    let _option = {};
    if (option) {
      _option = option;
    }

    let isLoading = true;
    if (_option.isLoading === false) {
      isLoading = _option.isLoading;
    }
    if (isLoading) {
      // ローディング画面開始
      this.dispatchShowProcessing(true);
    }

    return this.getToken(_option).then((result) => {
      _option.headers = result;
      return this.commonPost(
        process.env.NEXT_PUBLIC_API_HOST + url,
        _param,
        _option
      );
    });
  };


  //コメントアウト柴
  // static getToken(option) {
  //   return new Promise((resolve, reject) => {
  //     Auth.currentSession()
  //       .then((result) => {
  //         let headers = {
  //           Authorization: `Bearer ${result.getAccessToken().getJwtToken()}`,
  //           "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  //         };
  //         if (option == HTTP_OPTION_MULTIPART_FORMDATA) {
  //           headers = {
  //             Authorization: `Bearer ${result.getAccessToken().getJwtToken()}`,
  //             "content-type": `multipart/form-data`,
  //             "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  //           };
  //         }
  //         resolve(headers);
  //       })
  //       .catch((error) => {
  //         let headers = {
  //           Authorization: ``,
  //           "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  //         };
  //         if (option == HTTP_OPTION_MULTIPART_FORMDATA) {
  //           headers = {
  //             Authorization: ``,
  //             "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  //             "content-type": `multipart/form-data`,
  //           };
  //         }
  //         resolve(headers);
  //       });
  //   });
  // }

  static async commonPost(url, param, option) {
    let isLoading = true;
    if (option.isLoading === false) {
      isLoading = option.isLoading;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url, param, { headers: option.headers })
        .then((result) => {
          if (isLoading) {
            // ローディング画面終了
            this.dispatchHideProcessing(false);
          }
          console.log(result);
          resolve(result.data);
        })
        .catch((error) => {
          if (isLoading) {
            // ローディング画面終了
            this.dispatchHideProcessing(false);
          }
          console.log(error);
          reject(new Error(error));
        });
    });
  }
}
