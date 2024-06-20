import * as dotenv from "dotenv";
dotenv.config();
import { CognitoJwtVerifier } from "aws-jwt-verify";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { RETURN_CODE } from "../constants/index.js";

const cognito = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  },
});

export async function accessTokenAuthorizer(accountToken) {
  try {
    const verifier1 = new Promise(async (resolve, reject) => {
      const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
        tokenUse: "access",
        clientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLWEBCLIENTID,
      });
      await verifier
        .verify(accountToken)
        .then(function (res) {
          resolve(res);
        })
        .catch(function (e) {
          console.log(e);
          reject(e.message);
        });
    });

    let verifierResult = await Promise.allSettled([verifier1]).then(
      (results) => {
        return results.filter((element) => {
          return element.status === "fulfilled";
        });
      }
    );

    if (verifierResult.length === 0) {
      throw "Invalid access token";
    }

    // アクセストークンをが取得できた場合は、詳細情報を取得する
    let sub = verifierResult[0].value.sub;
    let params = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
      Filter: 'sub="' + sub + '"',
      Limit: 1,
    };
    let user = await cognito.send(new ListUsersCommand(params));

    return {
      return_code: RETURN_CODE.SUCCESS,
      result: {
        userOverview: verifierResult[0].value,
        userDetails: user.Users[0],
      },
    };
  } catch (e) {
    return { return_code: RETURN_CODE.ERROR, message: e };
  }
}
