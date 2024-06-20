import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { MAIL_BODY_PARAM_KEY } from "../../../common/constants/index.js";
import { RETURN_CODE } from "../../../common/constants/index.js";
import MasterRepository from "./master.js";

const ses = new SESClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  },
});

const sns = new SNSClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  },
});

export default async function sendMail(mailInfo) {
  let result = {};

  // パラメータ「mailCode」を渡してmasterリポジトリの「getMailTemplate」を呼び出す
  const master = new MasterRepository();
  let mailTemplate = await master.getMailTemplate(mailInfo.mailCode);

  // メールテンプレートを「mailCode」以外のパラメータで受け取った値に置換する
  for (let key in MAIL_BODY_PARAM_KEY) {
    mailTemplate[0].mail_body = mailTemplate[0].mail_body.replace(
      new RegExp(MAIL_BODY_PARAM_KEY[key], "g"),
      mailInfo[key]
    );
  }

  if (mailTemplate[0].mail_attribute == 0) {
    //「mail_attribute」が「0：Eメール」の場合、aws-sdkの「sendEmail」を呼び出す
    let params = {
      Destination: {
        BccAddresses: [
          process.env.NEXT_PUBLIC_NOTIFICATION_MAILADDRESS, //システム管理会社のメールアドレスが入る
        ],
        ToAddresses: [mailInfo.emailAddress],
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: mailTemplate[0].mail_body,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: mailTemplate[0].mail_subject,
        },
      },
      Source: process.env.NEXT_PUBLIC_SEND_MAILADDRESS, //システム管理会社の自動送信用メールアドレスが入る
    };

    ses
      .send(new SendEmailCommand(params))
      .then(async () => {
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
  } else if (mailTemplate[0].mail_attribute == 1) {
    let employeePhoneNumber = mailInfo.employeePhoneNumber.slice(1);

    // 「mail_attribute」が「1：SMS」の場合、aws-sdkの「publish」を呼び出す
    let params = {
      Message: mailTemplate[0].mail_body,
      PhoneNumber: "+81" + employeePhoneNumber.replace(/-/g, ""), //PHONE_NUMBER, in the E.164 phone number structure ex:+818012345678 = 08012345678
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: process.env.NEXT_PUBLIC_SMS_SENDER_NAME, // 通知者表示に使用される送信者ID アルファベット数字のみ
        },
      },
    };

    sns
      .send(new PublishCommand(params))
      .then(async () => {
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
