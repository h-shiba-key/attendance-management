import Repository from "./repository.js";
import { RETURN_CODE } from "../../../common/constants/index.js";

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminGetUserCommand,
  AdminEnableUserCommand,
  AdminDisableUserCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  },
});

export default class CognitoUserRepository extends Repository {
  constructor() {
    super();
  }

  async cognitoCreateUser(loginInfo) {
    let result = {};

    const createUserParams = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
      Username: loginInfo.loginId,
      ForceAliasCreation: true,
      MessageAction: "SUPPRESS",
      UserAttributes: [
        {
          Name: "name",
          Value: loginInfo.conId,
        },
      ],
    };

    result = await cognito
      .send(new AdminCreateUserCommand(createUserParams))
      .then(async () => {
        const setPasswordParams = {
          UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
          Username: loginInfo.loginId,
          Password: loginInfo.password,
          Permanent: true,
        };
        return await cognito
          .send(new AdminSetUserPasswordCommand(setPasswordParams))
          .then(() => {
            return {
              return_code: RETURN_CODE.SUCCESS,
            };
          })
          .catch((err) => {
            return {
              return_code: RETURN_CODE.ERROR,
              message: err,
            };
          });
      })
      .catch((err) => {
        return {
          return_code: RETURN_CODE.ERROR,
          message: err,
        };
      });

    return result;
  }

  async cognitoChangePassword(userInfo) {
    let result = {};

    const setPasswordParams = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
      Username: userInfo.loginId,
      Password: userInfo.password,
      Permanent: true,
    };
    result = cognito
      .send(new AdminSetUserPasswordCommand(setPasswordParams))
      .then(() => {
        return {
          return_code: RETURN_CODE.SUCCESS,
        };
      })
      .catch((err) => {
        return {
          return_code: RETURN_CODE.ERROR,
          message: err,
        };
      });

    return result;
  }

  async cognitoUpdateUser(userInfo) {
    let result = {};
    const adminGetUserParams = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
      Username: userInfo.loginId,
    };
    let data = await cognito
      .send(new AdminGetUserCommand(adminGetUserParams))
      .then((res) => {
        return {
          return_code: RETURN_CODE.SUCCESS,
          result: res,
        };
      })
      .catch((err) => {
        return {
          return_code: RETURN_CODE.ERROR,
          message: err,
        };
      });

    if (data.result.Enabled == userInfo.isActive) {
      return {
        return_code: RETURN_CODE.ERROR,
        message: "User is not Active",
      };
    }
    if (userInfo.isActive) {
      const adminEnableUserParams = {
        UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
        Username: userInfo.loginId,
      };

      result = await cognito
        .send(new AdminEnableUserCommand(adminEnableUserParams))
        .then(() => {
          return {
            return_code: RETURN_CODE.SUCCESS,
          };
        })
        .catch((err) => {
          return {
            return_code: RETURN_CODE.ERROR,
            message: err,
          };
        });
    } else {
      const adminDisableUserParams = {
        UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
        Username: userInfo.loginId,
      };

      result = await cognito
        .send(new AdminDisableUserCommand(adminDisableUserParams))
        .then(() => {
          return {
            return_code: RETURN_CODE.SUCCESS,
          };
        })
        .catch((err) => {
          return {
            return_code: RETURN_CODE.ERROR,
            message: err,
          };
        });
    }
    return result;
  }

  async cognitoDeleteUser(loginInfo) {
    let result = {};

    const adminGetUserParams = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
      Username: loginInfo.loginId,
    };
    let user = await cognito
      .send(new AdminGetUserCommand(adminGetUserParams))
      .then(async () => {
        const adminDeleteUserParams = {
          UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
          Username: loginInfo.loginId,
        };
        result = await cognito
          .send(new AdminDeleteUserCommand(adminDeleteUserParams))
          .then(() => {
            return {
              return_code: RETURN_CODE.SUCCESS,
            };
          })
          .catch((err) => {
            return {
              return_code: RETURN_CODE.ERROR,
              message: err,
            };
          });
      })
      .catch((err) => {
        return {
          return_code: RETURN_CODE.ERROR,
          message: err,
        };
      });

    return result;
  }
}
