import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Repository from "./repository.js";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  },
});

export default class FileManagerRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * アップロード用URLを取得
   */
  async getUploadUrl(job_id, file_name, folder_name) {
    let fileName = (job_id ? job_id + "_" : "") + file_name;
    console.log(fileName);
    let uplodeFilePath = `upload_file/${
      folder_name ? folder_name + "/" : ""
    }${fileName}`;
    console.log(uplodeFilePath);
    let bucketParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
      Key: uplodeFilePath,
    };

    const url = await getSignedUrl(s3, new GetObjectCommand(bucketParams));
    console.log("Presigned URL: ", url);

    var bucketFilePath = await getSignedUrl(
      s3,
      new GetObjectCommand(bucketParams)
    );
    var uploadUrl = await getSignedUrl(s3, new PutObjectCommand(bucketParams));

    return [
      {
        uploadUrl: uploadUrl,
        bucketFilePath: bucketFilePath,
        filePath: uplodeFilePath,
        fileName: fileName,
      },
    ];
  }

  /**
   * アップロード用URLを取得
   */
  async getCommonUploadUrl(file_name, folder_name, feature_name) {
    const fileName = file_name;
    console.log(fileName);
    let uplodeFilePath = `upload_file/${
      folder_name ? folder_name + "/" : ""
    }${fileName}`;
    console.log(uplodeFilePath);
    const bucketName = this._getBucketName(feature_name);
    console.log(bucketName);
    let bucketParams = {
      Bucket: bucketName,
      Key: uplodeFilePath,
    };

    const bucketFilePath = await getSignedUrl(
      s3,
      new GetObjectCommand(bucketParams)
    );
    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand(bucketParams)
    );

    return [
      {
        uploadUrl: uploadUrl,
        bucketFilePath: bucketFilePath,
        filePath: uplodeFilePath,
        fileName: fileName,
      },
    ];
  }

  /**
   * @param {string} featureName
   * @returns {string}
   */
  _getBucketName(featureName) {
    const AWS_S3_PUSHNOTIFICATION = "pushNotification";
    console.log(featureName);

    switch (featureName) {
      case AWS_S3_PUSHNOTIFICATION:
        return process.env.NEXT_PUBLIC_AWS_BUCKET_PUSHNOTIFICATION;
    }

    return null;
  }
}
