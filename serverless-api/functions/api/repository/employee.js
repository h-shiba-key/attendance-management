import Repository from "./repository.js";

export default class EmployeeRepository extends Repository {
  constructor() {
    super();
  }
  /**
   * 従業員情報検索
   */
  async searchEmployee(
    conId = null,
    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
    sei = null,
    mei = null,
    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */
    phoneNumber = null,
    offset = 0,
    rowsPerPage = 0
  ) {
    let sqlParam = []; //SQLパラメータ
    let whereParam = []; //
    let paramCount = 0;

    whereParam.push("con_id =" + "$".concat(++paramCount));
    sqlParam.push(conId);

    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
    //パラメータより条件を作成
    new Array(
      { key: "name_sei", value: sei },
      { key: "name_mei", value: mei },
      { key: "phone_number", value: phoneNumber },
      { key: "is_deleted", value: "FALSE" }
    ).map(function (row) {
      if (row.value) {
        switch (row.key) {
          case "name_sei":
            whereParam.push(row.key + " LIKE " + "$".concat(++paramCount));
            sqlParam.push("%" + row.value + "%");
            break;
          case "name_mei":
            whereParam.push(row.key + " LIKE " + "$".concat(++paramCount));
            sqlParam.push("%" + row.value + "%");
            break;
          default:
            whereParam.push(row.key + "=" + "$".concat(++paramCount));
            sqlParam.push(row.value);
        }
      }
    });
    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */

    //Where句を作成
    let whereSql = "";
    if (whereParam.length !== 0) {
      whereSql += "WHERE " + whereParam.join(" AND ");
    }

    //総件数取得用SQL文を作成
    const sqlForCount = `
        SELECT
          count(con_id)
        FROM
          u_employee
        ${whereSql}
        `;
    //総件数を取得
    let totalNumber = [];
    totalNumber = await this.query(sqlForCount, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    //LIMIT、OFFSET句を作成
    let limitSql = "";
    limitSql =
      "LIMIT " +
      "$".concat(++paramCount) +
      " OFFSET " +
      "$".concat(++paramCount);
    sqlParam.push(rowsPerPage);

    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
    //従業員情報リスト取得用SQL文を作成
    const sqlForList = `
        SELECT
        row_number() over(ORDER BY convert_to(name_kana_sei || name_kana_mei ,'UTF8') ) AS "rowNumber",
          employee_Id As "employeeId",
          name_sei || '　' || name_mei AS "name",
          phone_number AS "phoneNumber"
        FROM
          u_employee
        ${whereSql}
        ${limitSql}
        
        `;
    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */
    let employeesList = [];
    let newPageIndex = offset >= 0 ? offset / rowsPerPage : 0;
    let reGetFlg = false;
    do {
      let tempSqlParam = [...sqlParam];
      tempSqlParam.push(offset);
      console.log(tempSqlParam);
      //従業員情報リストを取得
      employeesList = await this.query(sqlForList, tempSqlParam)
        .then((res) => this.jsonParse(res).rows)
        .catch((err) => {
          throw err;
        });
      if (employeesList.length == 0 && offset > 0) {
        offset = offset - rowsPerPage;
        newPageIndex = offset >= 0 ? offset / rowsPerPage : 0;
        reGetFlg = true;
      } else {
        reGetFlg = false;
      }
    } while (reGetFlg);

    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */

    const result = {
      employeesList: employeesList,
      totalNumber: totalNumber[0].count,
      /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Takagi START */
      newPageIndex: newPageIndex,
      /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Takagi END */
    };

    return result;
  }

  /**
   * 従業員登録数・登録可能数取得
   */
  async getRegistrationNumber(conId) {
    let sqlParam = [];

    sqlParam.push(conId);

    //従業員総数取得SQL
    const sqlForTotalNumber = `
        SELECT
          count(con_id)
        FROM
          u_employee
        WHERE
          con_id = $1
        AND is_deleted = FALSE
        `;

    let totalNumber = [];
    totalNumber = await this.query(sqlForTotalNumber, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    //従業員登録可能数取得SQL
    const sqlForRegistrableNumber = `
        SELECT
          employee_num
        FROM
          m_plan
        LEFT OUTER JOIN u_contractor
        ON  m_plan.plan_code = u_contractor.plan_code
        WHERE
          u_contractor.con_id = $1
        `;
    console.log(sqlParam);
    let registrableNumber = [];
    registrableNumber = await this.query(sqlForRegistrableNumber, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    const result = {
      totalNumber: totalNumber[0].count,
      registrableNumber: registrableNumber[0].employee_num,
    };

    return result;
  }

  /**
   * 従業員情報取得
   */
  async getEmployee(conId, employeeId) {
    let sqlParam = [conId, employeeId];

    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
    const sql = `
        SELECT
          name_sei AS "sei",
          name_mei AS "mei",
          name_kana_sei AS "seiKana",
          name_kana_mei AS "meiKana",
          phone_number AS "phoneNumber",
          login_id AS "loginId",
          extract(epoch from update_datetime) AS "updateDateTime"
        FROM
          u_employee
        WHERE
          con_id = $1
        AND employee_id = $2
        AND is_deleted = FALSE
        `;
    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */

    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }

  /**
   * ログインID一意性チェック
   */
  async checkUniqueLoginId(loginId) {
    let sqlParam = [loginId];

    const sql = `
        SELECT EXISTS
          (
            SELECT
              *
            FROM
              u_employee
            WHERE
              login_id = $1
          )
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
   * 従業員ID一意性チェック
   */
  async checkUniqueEmployeeId(employeeId) {
    let sqlParam = [employeeId];

    const sql = `
        SELECT EXISTS
          (
            SELECT
              *
            FROM
              u_employee
            WHERE
              employee_id = $1
          )
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
   * 従業員情報登録
   */
  /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
  async postEmployee(
    employeeId,
    loginId,
    sei,
    mei,
    seiKana,
    meiKana,
    phoneNumber,
    conId
  ) {
    let sqlParam = [
      employeeId,
      loginId,
      sei,
      mei,
      seiKana,
      meiKana,
      phoneNumber,
      conId,
    ];

    console.log(sqlParam);

    const sql = `
        INSERT INTO
          u_employee
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          FALSE,
          $8,
          CURRENT_TIMESTAMP,
          $8,
          CURRENT_TIMESTAMP
        )
        `;
    let result = [];
    result = await this.query(sql, sqlParam).catch((err) => {
      throw err;
    });

    return result;
  }
  /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */

  /**
   * メール用業者情報取得
   */
  async getUserInfoForMail(conId) {
    let sqlParam = [conId];

    console.log(sqlParam);

    const sql = `
        SELECT
          name
          ,email_address AS "emailAddress"
        FROM
          u_contractor
        WHERE
          con_id = $1
        `;

    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    console.log(result);

    return result;
  }

  /**
   * 従業員情報削除
   */
  async deleteEmployee(employeeId, conId, updateDateTime) {
    let result = [];
    let sqlParam = [];

    console.log(sqlParam);

    //更新日時チェックSQL
    const checkUpdateDateTimeSql = `
        SELECT
           *
        FROM
          u_employee
        WHERE
          employee_id = $1
        AND extract(epoch from update_datetime) = $2 
        FOR UPDATE
        `;
    //従業員情報更新SQL
    const updateEmployeeSql = `
        UPDATE
          u_employee
        SET
          is_deleted = TRUE
        ,update_id = $2
        ,update_datetime = CURRENT_TIMESTAMP
        WHERE
          employee_id = $1
        `;

    try {
      //トランザクション処理を開始
      this.startTransaction();

      // 更新日時チェック
      sqlParam = [employeeId, updateDateTime];
      result = await this.query(checkUpdateDateTimeSql, sqlParam).catch(
        (err) => {
          throw err;
        }
      );

      //取得件数 = 0件の場合、ロールバックし、エラーを返す
      if (result.rowCount == 0) {
        this.rollback();
        throw err;
      }

      // 削除処理（論理削除）
      sqlParam = [employeeId, conId];
      result = await this.query(updateEmployeeSql, sqlParam).catch((err) => {
        throw err;
      });

      //結果が1件でない場合、ロールバックし、エラーを返す
      if (result.rowCount != 1) {
        this.rollback();
        throw err;
      }

      //変更をコミット
      this.commit();
    } catch (err) {
      //ロールバック
      this.rollback();
      throw err;
    } finally {
      //トランザクション処理を終了
      this.endTransaction();
    }
    return;
  }

  /**
   * 従業員情報更新
   */
  /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
  async updateEmployee(
    employeeId,
    sei,
    mei,
    seiKana,
    meiKana,
    phoneNumber,
    conId,
    updateDateTime
  ) {
    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */

    let result = [];
    let sqlParam = [];

    //更新日時チェックSQL
    const checkUpdateDateTimeSql = `
        SELECT
          *
        FROM
          u_employee
        WHERE
          employee_id = $1
        AND extract(epoch from update_datetime) = $2 
        FOR UPDATE
       `;
    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
    //従業員情報更新SQL
    const updateEmployeeSql = `
        UPDATE
          u_employee
        SET
          name_sei = $2 ,
          name_mei = $3 ,
          name_kana_sei = $4 ,
          name_kana_mei = $5 ,
          phone_number = $6 ,
          update_id = $7 ,
          update_datetime = CURRENT_TIMESTAMP
        WHERE
          employee_id = $1
       `;
    /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */

    try {
      // 更新日時チェック
      sqlParam = [employeeId, updateDateTime];
      result = await this.query(checkUpdateDateTimeSql, sqlParam).catch(
        (err) => {
          throw err;
        }
      );

      //取得件数 = 0件の場合、ロールバックし、エラーを返す
      if (result.rowCount == 0) {
        this.rollback();
        throw err;
      }

      /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase START */
      // 更新処理
      sqlParam = [employeeId, sei, mei, seiKana, meiKana, phoneNumber, conId];
      /* 0.5次開発、1次開発の改善 No.13 従業員名対応 2022/08/19 Y.Murase END */
      result = await this.query(updateEmployeeSql, sqlParam).catch((err) => {
        throw err;
      });

      //処理件数が1件でない場合、ロールバックし、エラーを返す
      if (result.rowCount != 1) {
        throw "rowCount != 1";
      }
      //コミット
      this.commit();
    } catch (err) {
      //エラーを返す
      throw err;
    }
    return;
  }
}
