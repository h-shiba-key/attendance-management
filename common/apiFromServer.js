// サーバーからAPIをリクエスト
import axios from "axios";

export default class apiFromServer {
  static post = (url, param, option) => {
    let _param = {};
    if (param) {
      _param = param;
    }
    let _option = {};
    if (option) {
      _option = option;
    }
    if (_option.accessToken) {
      _option.headers = {
        Authorization: `Bearer ${option.accessToken}`,
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      };
    } else {
      _option.headers = {
        Authorization: ``,
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      };
    }
    return this.commonPost(
      process.env.NEXT_PUBLIC_API_HOST + url,
      _param,
      _option
    );
  };

  static async commonPost(url, param, option) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, param, { headers: option.headers })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          //  reject(new Error(error));
        });
    });
  }
}

// export default class apiFromServer {
//   static post = (url, param) => {
//     let _param = {};
//     if (param) {
//       _param = param;
//     }
//     // let _option = {};
//     // if (option) {
//     //   _option = option;
//     // }
//     // if (_option.accessToken) {
//     //   _option.headers = {
//     //     Authorization: `Bearer ${option.accessToken}`,
//     //     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//     //   };
//     // } else {
//     //   _option.headers = {
//     //     Authorization: ``,
//     //     "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
//     //   };
//     // }
//     return this.commonPost(
//       process.env.NEXT_PUBLIC_API_HOST + url,
//       _param,
//       // _option
//     );
//   };

//   static async commonPost(url, param, option) {
//     return new Promise((resolve, reject) => {
//       axios
//         .post(url, param, 
//           // { headers: option.headers }
//         )
//         .then((result) => {
//           resolve(result.data);
//         })
//         .catch((error) => {
//            reject(new Error(error));
//         });
//     });
//   }//


