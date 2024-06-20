import Repository from "./repository.js";

export default class MasterRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * 都道府県取得
   * @param  {}
   */
  async getPrefecture() {
    let sql = `SELECT
                    prefecture_code
                    , prefecture_name
                FROM
                    m_prefecture 
                ORDER BY
                    prefecture_code
                    `;
    let result = [];
    result = await this.query(sql, [])
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }

  /**
   * 市区町村取得
   * @param  prefectureCode：都道府県コード
   */
  async getMunicipality(prefectureCode) {
    let sqlParam = [];
    let whereSql = `WHERE 1=1 `;
    let index = 1;
    //Where句を作成
    if (prefectureCode) {
      whereSql = whereSql.concat(`AND prefecture_code = $`, index++);
      sqlParam.push(prefectureCode);
    }
    const sql = `
    SELECT
      municipality_code,
      municipality_name
    FROM
      m_municipality
    ${whereSql}
      ORDER BY municipality_code;
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
   * コードマスタ取得
   * @param  {} groupCode
   */
  async getCode(groupCode) {
    let sqlParam = [];
    sqlParam.push(groupCode);

    const sql = `
      SELECT
        code,
        code_name
      FROM
        m_code
      WHERE
        group_code = $1
      ORDER BY
        sort_order    
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
   * 品目大分類マスタ取得
   * @param  {} itemDivision
   */
  async getItemMajorClass(itemDivision) {
    let sqlParam = [];

    let sql = `
      SELECT
        item_major_code,
        item_major_name,
        item_division
      FROM
        m_item_major_class
    `;

    if (Array.isArray(itemDivision) && itemDivision.length > 0) {
      sqlParam = itemDivision;
      const strParam = itemDivision.map(function (element, index) {
        return "$" + (index + 1);
      });

      sql =
        sql +
        `
        WHERE
          item_division IN(` +
        strParam.join(",") +
        `)
      `;
    }

    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }

  /**
   * 品目小分類マスタ取得
   * @param  {}
   */
  async getItemMinorClass() {
    let sql = `
      SELECT
        item_minor_code,
        item_major_code,
        item_minor_name
      FROM
        m_item_minor_class
      ORDER BY
        item_major_code
    `;

    let result = [];
    result = await this.query(sql, [])
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }

  /**
   * メールテンプレート取得
   * @param  {} mailCode：メールコード
   */
  async getMailTemplate(mailCode) {
    let sqlParam = [];
    sqlParam.push(mailCode);

    const sql = `
      SELECT
        mail_subject,    
        mail_body,
        mail_attribute
      FROM
        m_mail_template
      WHERE
        mail_code = $1   
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
   * 銀行名取得
   * @param  {} bankCode
   */
  async getBankName(bankCode) {
    let sqlParam = [];
    sqlParam.push(bankCode);

    const sql = `
      SELECT
        bank_name
      FROM
        m_bank
      WHERE
        bank_code = $1
    `;

    let result = [];

    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });
    return result[0]?.bank_name || "";
  }

  /**
   * 支店名取得
   * @param  {} bankCode
   * @param  {} bankBranchCode
   */
  async getBankBranchName(bankCode, bankBranchCode) {
    let sqlParam = [];
    sqlParam.push(bankCode);
    sqlParam.push(bankBranchCode);

    const sql = `
        SELECT
          bank_branch_name
        FROM
          m_bank_branch
        WHERE
          bank_code = $1
          AND bank_branch_code = $2
      `;

    let result = [];

    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });
    return result[0]?.bank_branch_name || "";
  }

  /* プッシュ通知配信予約対応 2023/01/26 Y.Murase START */
  /**
   * 配信カテゴリー取得
   * @param  {}
   */
  async getCategory() {
    let sql = `
      SELECT
        category_code,
        category_name
      FROM
        m_notification_category 
      ORDER BY
        sort_order
      `;
    let result = [];
    result = await this.query(sql, [])
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }
  /* プッシュ通知配信予約対応 2023/01/26 Y.Murase END */
}
