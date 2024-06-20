import * as dotenv from "dotenv";
dotenv.config();
import log from "../../../common/log.js";
import mysql from "mysql";
const { Client } = mysql;

const SLOW_QUERY_MILLISECOND = 1000;

class Connection {
  static client = null;

  static getClient = () => {
    if (this.client == null) {
      this.client = new Client({
        user: process.env.MYSQL_USER,
        host: process.env.MYSQL_LOCAL,
        database: process.env.MYSQL_DATABASE,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT,
      });

      this.client.on("error", (err) => {
        console.log("mysql error :");
        console.log(err);

        this.client.connect();
      });

      this.client.connect();
    }

    return this.client;
  };

  static dispose = () => {
    this.client.end((err) => {
      if (!err) {
        this.client = null;
      }
    });
  };
}

// リポジトリ基底クラス
export default class Repository {
  // コンストラクタ
  constructor() {
    log.log("getClient start");
    this.client = Connection.getClient();
    this.transactionCount = 0;
    log.log("getClient end");
  }

  // 検索
  async query(sql, param) {
    if (!this.verify(param)) {
      log.error("mysql verify error:");
      log.error(param);
      return null;
    }

    const before_time = Date.now();

    log.log(sql);
    log.log(param);
    return await this.client.query(sql, param).then((res) => {
      const dtime = Date.now() - before_time;
      if (dtime > SLOW_QUERY_MILLISECOND) {
        log.warn(`WARN: slow query ${dtime} ms`);
        log.warn("sql");
        log.warn(sql);
        log.warn("param");
        log.warn(param);
      }
      return res;
    });
  }

  // トランザクション処理
  startTransaction() {
    log.log("Start Transaction");
    this.client.query("BEGIN");
    this.transactionCount++;
    if (this.transactionCount > 1) {
      log.warn("transactionCount error :" + this.transactionCount);
    }
  }
  commit() {
    log.log("Commit");
    this.client.query("COMMIT");
    this.transactionCount--;
    if (this.transactionCount > 0) {
      log.warn("transactionCount error :" + this.transactionCount);
    }
  }
  rollback() {
    log.log("Rollback");
    this.client.query("ROLLBACK");
    this.transactionCount--;
    if (this.transactionCount > 0) {
      log.warn("transactionCount error :" + this.transactionCount);
    }
  }
  endTransaction() {
    log.log("End Transaction");
  }

  // パラメータ確認
  verify(param) {
    if (!Array.isArray(param)) return false;
    return true;
  }

  // DBへの接続を切る
  dispose() {
    Connection.dispose();
    this.client = null;
  }

  // json変換
  jsonParse(result) {
    return JSON.parse(JSON.stringify(result));
  }
}
