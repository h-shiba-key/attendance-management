import Repository from "./repository.js";

export default class JobRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * ジョブステータス取得
   * @param  {} jobId
   */
  async getJobStatus(jobId) {
    let sqlParam = [jobId];

    const sql = `
      SELECT
        status,
        error_message
      FROM
        u_job
      WHERE
        job_id = $1
    `;

    let result = [];

    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });
    return result;
  }

  /**
   * ジョブ追加
   * @param  {} jobGroupCode
   * @param  {} status
   * @param  {} loginConId
   */
  async postJob(jobGroupCode, status, loginConId) {
    // SQL
    const postJobSql = `
      INSERT INTO
        u_job
      (
        job_group_code,
        status,
        create_id,
        create_datetime,
        update_id,
        update_datetime
      )
      VALUES
      (
        $1,
        $2,
        $3,
        CURRENT_TIMESTAMP,
        $3,
        CURRENT_TIMESTAMP
      )
    `;

    const selectIdSql = `
      SELECT
        LASTVAL() AS job_id
    `;
    let result = [];

    // 登録処理
    try {
      let sqlParam = [jobGroupCode, status, loginConId];

      result = await this.query(postJobSql, sqlParam).catch((err) => {
        throw err;
      });

      if (result.rowCount == 0) {
        throw "result.rowCount == 0";
      }

      result = await this.query(selectIdSql, [])
        .then((res) => this.jsonParse(res).rows)
        .catch((err) => {
          throw err;
        });

      if (!result[0]?.job_id) {
        throw "!result[0]?.job_id";
      }
    } catch (err) {
      throw err;
    }

    return result[0]?.job_id;
  }

  /**
   * ジョブステータス更新
   * @param  {} jobId
   * @param  {} status
   * @param  {} errorMessage
   * @param  {} loginConId
   */
  async putJobStatus(jobId, status, errorMessage, loginConId) {
    // SQL
    const putJobSql = `
      UPDATE
        u_job
      SET
        status = $1,
        error_message = $2,
        update_id = $3,
        update_datetime = CURRENT_TIMESTAMP
      WHERE
        job_id = $4
    `;

    let result = [];

    // 登録処理
    try {
      let sqlParam = [status, errorMessage, loginConId, jobId];

      result = await this.query(putJobSql, sqlParam).catch((err) => {
        throw err;
      });

      if (result.rowCount == 0) {
        throw "result.rowCount == 0";
      }
    } catch (err) {
      throw err;
    }

    return;
  }
}
