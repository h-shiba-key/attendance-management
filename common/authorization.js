import { Amplify, withSSRContext } from "aws-amplify";
import { PREFIX } from "./constants/";

// サインイン処理
// 使用するユーザープール、クライアントの ID を指定
Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLID,
    userPoolWebClientId:
      process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOLWEBCLIENTID,
  },
  ssr: true,
});

/**
 * 関数名：authorization
 * 概要：ログインユーザーのパラメータを返す関数
 * 制限事項：引数contextはgetServerSidePropsの引数をパススルーすること
 * @param  {Object} context getServerSidePropsの引数
 * @return {Object} contractorinfo
 * {
 *  {String} name: AWSCognitoのnameを格納。u_contractorテーブルのcon_id。認証されていない場合,nullを返す。
 *  {String} username: AWSCognitoのusernameを格納。u_contractorテーブルのlogin_id。認証されていない場合,nullを返す。
 *  {Boolean} isAdmin: true：ログインユーザーが管理者,false：ログインユーザーが管理者でない。認証されていない場合,falseを返す。
 *  {Boolean} isContractor: true：ログインユーザーが業者,false：ログインユーザーが業者でない。認証されていない場合,falseを返す。
 * }
 */

export default async function authorization(context) {
  let contractorinfo = {};
  let isAdmin = false;
  let isContractor = false;
  const { Auth } = withSSRContext(context);

  try {
    const contractor = await Auth.currentAuthenticatedUser();
    contractorinfo = contractor.attributes;
    contractorinfo.username = contractor.username;

    //contractorinfo.name(con_id)の頭文字が「A」の時、管理者とする。
    if (contractorinfo.name.charAt(0) == PREFIX.ADMIN) {
      isAdmin = true;
      isContractor = false;
      //contractorinfo.name(con_id)の頭文字が「C」の時、業者とする。
    } else if (contractorinfo.name.charAt(0) == PREFIX.CONTRACTOR) {
      isAdmin = false;
      isContractor = true;
    } else {
      isAdmin = false;
      isContractor = false;
    }

    const session = await Auth.currentSession();
    contractorinfo.accessToken = session.getAccessToken().getJwtToken();

    contractorinfo.isAdmin = isAdmin;
    contractorinfo.isContractor = isContractor;
    return contractorinfo;
  } catch (err) {
    return {
      sub: null,
      email_verified: false,
      name: null,
      email: null,
      username: null,
      isAdmin: false,
      isContractor: false,
    };
  }
}
