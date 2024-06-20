import Repository from "./repository.js";
import {
  APPROVAL_STATUS,
  APPROVAL_STATUS_INDEX,
  VENDOR_CLASS,
} from "../../../common/constants/contractor.js";
import sendMail from "../repository/sendMail.js";
import { PREFIX, RETURN_CODE } from "../../../common/constants/index.js";

export default class ContractorRepository extends Repository {
  constructor() {
    super();
  }
  /**
   * 紹介元情報取得
   */
  async getReferralSource() {
    let sqlParam = [];

    const sql = `
  SELECT
    con_id
    , name 
  FROM
    u_contractor
  WHERE
    is_active = true
  ORDER BY
    convert_to(name,'UTF8')
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
   * 利用業者情報取得
   * @param {String} conId：業者ID
   */
  async getContractor(conId) {
    let sqlParam = [conId];

    const sql = `
  SELECT
    u_contractor.name
    , u_contractor.con_id
    , u_contractor.branch_name
    , u_contractor.postal_code
    , u_contractor.prefecture_code
    , m_prefecture.prefecture_name
    , u_contractor.municipality_code
    , m_municipality.municipality_name
    , u_contractor.address
    , ST_X(u_contractor.geom ::geometry) AS lng
    , ST_Y(u_contractor.geom ::geometry) AS lat
    , u_contractor.phone_number
    , u_contractor.fax_number
    , u_contractor.email_address
    , u_contractor.login_id
    , u_contractor.referral_source
    ,(
      SELECT 
        name 
      FROM 
        u_contractor con
      WHERE 
        con.con_id = u_contractor.referral_source) AS referral_source_name
    , u_contractor.disposal_license_number
    , u_contractor.is_excellent_certified
    , u_contractor.is_iso_holder
    , u_contractor.is_eco_action_holder
    , u_contractor.is_purchaser
    , u_contractor.is_transport_disposal_company
    , u_contractor.is_container_installation_disposal
    , u_contractor.license_file_name
    , u_contractor.construction_license_type
    , construction_license_type.code_name AS construction_license_type_name
    , u_contractor.construction_license_div
    , construction_license_div.code_name AS construction_license_div_name
    , u_contractor.construction_license_year
    , u_contractor.construction_license_number
    , u_contractor.construction_license_industry
    , ( 
        SELECT
            string_agg(m_code.code_name, '・') AS license_industry_type_name 
        FROM
            ( 
                SELECT
                    to_number( 
                        regexp_split_to_table(construction_license_industry, ',')
                        , '99'
                    ) AS license_industry_type_code 
                FROM
                    u_contractor 
                WHERE
                    u_contractor.con_id = $1
            ) AS license_industry_type_table JOIN m_code 
                ON license_industry_type_table.license_industry_type_code = m_code.code 
                AND m_code.group_code = 'CD0009'
    ) AS construction_license_industry_name
    , u_contractor.sales_manager_name
    , u_contractor.transport_license_number
    , u_contractor.security_license_number
    , u_contractor.labor_dispatch_license_number
    , u_contractor.bank_code
    , m_bank.bank_name
    , u_contractor.bank_branch_code
    , m_bank_branch.bank_branch_name
    , u_contractor.account_type
    , account_type.code_name AS account_type_name
    , u_contractor.account_code
    , u_contractor.account_holder
    , u_contractor.is_cash_possible
    , u_contractor.is_transfer_possible
    , u_contractor.is_slip_possible
    , u_contractor.is_system_possible
    , u_contractor.approval_status
    , u_contractor.rejection_reasons
    , ( 
        SELECT
            string_agg(m_code.code_name, ' ') AS division_name 
        FROM
            ( 
                SELECT
                    con_class AS division_code 
                FROM
                    u_contractor_class 
                WHERE
                    u_contractor_class.con_id = $1
            ) AS division_table JOIN m_code 
                ON division_table.division_code = m_code.code 
                AND m_code.group_code = 'CD0001'
    ) AS division
    , u_contractor.is_active
    , u_contractor.self_regist_con_id
    , to_char(u_contractor.update_datetime, 'YYYY/MM/DD HH24:MI') AS update_datetime 
  FROM
    u_contractor JOIN m_prefecture 
        ON u_contractor.prefecture_code = m_prefecture.prefecture_code 
    LEFT JOIN m_municipality 
        ON u_contractor.municipality_code = m_municipality.municipality_code 
    LEFT JOIN m_code AS construction_license_type 
        ON construction_license_type.code = u_contractor.construction_license_type 
        AND construction_license_type.group_code = 'CD0007' 
    LEFT JOIN m_code AS construction_license_div 
        ON construction_license_div.code = u_contractor.construction_license_div 
        AND construction_license_div.group_code = 'CD0008' 
    LEFT JOIN m_bank 
        ON u_contractor.bank_code = m_bank.bank_code 
    LEFT JOIN m_bank_branch 
        ON u_contractor.bank_code = m_bank_branch.bank_code 
        AND u_contractor.bank_branch_code = m_bank_branch.bank_branch_code 
    LEFT JOIN m_code AS account_type 
        ON account_type.code = u_contractor.account_type 
        AND account_type.group_code = 'CD0004' 
  WHERE
    u_contractor.con_id = $1
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
   * 利用業者ログインID一意性チェック
   * @param {String} loginId：ログインID
   */
  async checkUniqueLoginIdForContractor(loginId) {
    let sqlParam = [loginId];

    const sql = `
    SELECT
    EXISTS (SELECT * FROM u_contractor WHERE login_id = $1);
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
   * 利用業者検索
   * @param  {String}   unapproval       :未承認
   * @param  {String}   approval         :承認
   * @param  {String}   disapproval      :否認
   * @param  {String}   selfRegistration :自社
   * @param  {String}   name             :名称
   * @param  {String}   branchName       :支店名
   * @param  {String}   prefectureCode   :住所（都道府県）
   * @param  {String}   municipalityCode :住所（市区町村）
   * @param  {String}   isActive         :利用状況
   * @param  {String}   rowsPerPage      :1ページに表示する件数
   * @param  {String}   offset           :オフセット
   */
  async searchContractor(
    /* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi START */
    disposal,
    sale,
    /* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi END */
    unapproval,
    approval,
    disapproval,
    selfRegistration,
    name,
    branchName,
    prefectureCode,
    municipalityCode,
    isActive,
    rowsPerPage,
    offset
  ) {
    let sqlParam = []; //SQLパラメータ
    let whereSql = `WHERE 1=1 `;
    let index = 1;
    let limitSql = ``;
    let vendorClass = ``;
    let approvalStatus = ``;

    /* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi START */
    if (disposal) {
      vendorClass += VENDOR_CLASS.DISPOSAL + `,`;
    }
    if (sale) {
      vendorClass += VENDOR_CLASS.SALE + `,`;
    }
    if (vendorClass == ``) {
      vendorClass = null;
    } else {
      vendorClass += `null`;
    }
    /* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi END */

    if (unapproval) {
      approvalStatus += `'` + APPROVAL_STATUS_INDEX.UNAPPROVAL + `',`;
    }
    if (approval) {
      approvalStatus += `'` + APPROVAL_STATUS_INDEX.APPROVAL + `',`;
    }
    if (disapproval) {
      approvalStatus += `'` + APPROVAL_STATUS_INDEX.DISAPPROVAL + `',`;
    }
    if (selfRegistration) {
      approvalStatus += `'` + APPROVAL_STATUS_INDEX.SELFREGISTRATION + `',`;
    }
    if (approvalStatus == ``) {
      approvalStatus = null;
    } else {
      approvalStatus += `null`;
    }
    if (isActive === "active") {
      isActive = `true`;
    } else if (isActive === "inactive") {
      isActive = `false`;
    } else {
      isActive = `true`;
    }

    //Where句を作成
    /* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi START */
    if (vendorClass) {
      whereSql = whereSql.concat(
        `AND u_contractor.contractor_div_code IN (${vendorClass}) `
      );
    }
    /* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi END */
    if (approvalStatus) {
      whereSql = whereSql.concat(
        `AND u_contractor.approval_status IN (${approvalStatus}) `
      );
    }
    if (name) {
      whereSql = whereSql.concat(` AND u_contractor.name LIKE $`, index++);
      sqlParam.push(`%` + name + `%`);
    }
    if (branchName) {
      whereSql = whereSql.concat(
        ` AND u_contractor.branch_name LIKE $`,
        index++
      );
      sqlParam.push(`%` + branchName + `%`);
    }
    if (prefectureCode) {
      whereSql = whereSql.concat(
        ` AND u_contractor.prefecture_code = $`,
        index++
      );
      sqlParam.push(prefectureCode);
    }
    if (municipalityCode) {
      whereSql = whereSql.concat(
        ` AND u_contractor.municipality_code = $`,
        index++
      );
      sqlParam.push(municipalityCode);
    }
    whereSql = whereSql.concat(` AND u_contractor.is_active = $`, index++);
    sqlParam.push(isActive);

    //総件数取得用SQL文を作成
    const sqlForCount = `
      SELECT
        count(con_id) 
      FROM
        u_contractor
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
    limitSql = limitSql.concat(` LIMIT $`, index++, ` OFFSET $`, index++);
    sqlParam.push(rowsPerPage);
    sqlParam.push(offset);

    //利用業者情報リスト取得用SQL文を作成
    const sqlForList = `
  SELECT
    row_number() over (ORDER BY convert_to(u_contractor.name,'UTF8')) AS "rowNumber"
    , u_contractor.con_id AS "conId"
    , u_contractor.approval_status AS "approvalStatus"
    , u_contractor.name AS "name"
    , u_contractor.branch_name AS "branchName"
    , COUNT(u_employee.login_id) AS "appUsers"
    , u_contractor.contractor_div_code AS "contractorDivCode"
    , m_prefecture.prefecture_name AS "prefecture"
    , m_municipality.municipality_name AS "municipality"
    , u_contractor.is_active AS "isActive"
  FROM
    u_contractor 
    LEFT OUTER JOIN u_employee 
        ON u_contractor.con_id = u_employee.con_id 
    LEFT OUTER JOIN m_prefecture 
        ON u_contractor.prefecture_code = m_prefecture.prefecture_code
    LEFT OUTER JOIN m_municipality 
        ON u_contractor.municipality_code = m_municipality.municipality_code
  ${whereSql}
  GROUP BY u_contractor.con_id,m_prefecture.prefecture_name,m_municipality.municipality_name
  ORDER BY convert_to(u_contractor.name,'UTF8')
  ${limitSql}
    `;
    //利用業者情報リストを取得
    const contractorList = await this.query(sqlForList, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });
    console.log(sqlParam);

    const result = {
      contractorList: contractorList,
      totalNumber: totalNumber[0].count,
    };

    return result;
  }
  /**
   * 紹介元取得
   * @param  {} con_id
   */
  async getContractorList() {
    const sql = `
        SELECT
            u_contractor.name
        FROM
            u_contractor`;

    let result = [];
    result = await this.query(sql, [])
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }

  async checkUniqueConId(conId) {
    let sqlParam = [conId];
    const sql = ` SELECT EXISTS(
                    SELECT
                      *
                    FROM
                      u_contractor
                    WHERE
                      con_id = $1
                  )`;

    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }

  /**
   * 新規利用申請登録
   */
  async insertContractor(
    conId,
    name,
    branchName,
    postalCode,
    prefectureCode,
    municipalityCode,
    address,
    lng,
    lat,
    phoneNumber,
    faxNumber,
    emailAddress,
    referralSource,
    planCode,
    selfRegistConId,
    conClass,
    prefecture,
    municipality
  ) {
    let sqlParam = [];

    const insertSql = `
        INSERT INTO u_contractor (
            con_id
            , name
            , branch_name
            , postal_code
            , prefecture_code
            , municipality_code
            , address
            , geom
            , phone_number
            , fax_number
            , email_address
            , referral_source
            , plan_code
            , last_agreement_datetime
            , create_id
            , create_datetime
            , update_id
            , update_datetime
            , self_regist_con_id
            , is_active
        )
        VALUES (
            $1
            , $2
            , $3
            , $4
            , $5
            , $6
            , $7
            , ST_GeographyFromText('SRID=4326;POINT(' || $8 ||' '|| $9 || ')')
            , $10
            , $11
            , $12
            , $13
            , $14
            , CURRENT_TIMESTAMP
            , $1
            , CURRENT_TIMESTAMP
            , $1
            , CURRENT_TIMESTAMP
            , $15
            , FALSE
        );
        `;

    const conClassSql = `
        INSERT INTO u_contractor_class(
          con_id
          , con_class
          , create_id
          , create_datetime
          , update_id
          , update_datetime
        )
        VALUES(
          $1
          , $2
          , $1
          , CURRENT_TIMESTAMP
          , $1
          , CURRENT_TIMESTAMP
        )`;

    try {
      this.startTransaction();

      //業者テーブル登録
      sqlParam = [
        conId,
        name,
        branchName,
        postalCode,
        prefectureCode,
        municipalityCode,
        address,
        lng,
        lat,
        phoneNumber,
        faxNumber,
        emailAddress,
        referralSource.value,
        planCode,
        selfRegistConId,
      ];
      let result = [];
      result = await this.query(insertSql, sqlParam)
        .then((res) => this.jsonParse(res.rows))
        .catch((err) => {
          throw err;
        });
      this.commit();

      //利用区分テーブル新規登録
      await Promise.all(
        conClass.map(async (rows) => {
          if (rows.checked == true) {
            sqlParam = [conId, rows.value];
            await this.query(conClassSql, sqlParam)
              .then((res) => this.jsonParse(res.rows))
              .catch((err) => {
                throw err;
              });
          }
        })
      );

      let mailConClass = conClass.map((rows) => {
        return rows.label;
      });

      //登録成功したらメール送信
      let mailResult = await sendMail({
        mailCode: "01",
        emailAddress: emailAddress,
        name: name,
        branchName: branchName,
        postalCode: postalCode,
        prefecture: prefecture.label,
        municipality: municipality.label,
        address: address,
        phoneNumber: phoneNumber,
        faxNumber: faxNumber,
        division: mailConClass,
        referralSource: referralSource.label,
      });
      if (mailResult.return_code === RETURN_CODE.ERROR) {
        throw mailResult.message;
      }

      this.commit();
    } catch (err) {
      this.rollback();
      throw err;
    } finally {
      this.endTransaction();
    }
    return;
  }

  /**
   * 申請画面用利用業者検索
   * @param  {} con_id
   */
  async searchContractorForApplication(name, postalCode) {
    let sqlParam = ["%" + name + "%", postalCode];
    const sql = `
      SELECT
          row_number() over(ORDER BY u_contractor.name) AS "rowNumber"
          ,u_contractor.con_id AS "conId"
          ,u_contractor.name AS "name"
          ,u_contractor.branch_name AS "branchName"
          ,u_contractor.postal_code AS "postalCode"
          ,m_prefecture.prefecture_name AS "prefecture"
          ,m_municipality.municipality_name AS "municipality"
          ,u_contractor.address AS "address"
      FROM
          u_contractor
          LEFT OUTER JOIN
            m_prefecture
          ON
            u_contractor.prefecture_code = m_prefecture.prefecture_code
          LEFT OUTER JOIN
            m_municipality
          ON
            u_contractor.municipality_code = m_municipality.municipality_code
      WHERE
          (u_contractor.name LIKE $1
          OR u_contractor.postal_code = $2)

          AND u_contractor.approval_status = 3

      GROUP BY u_contractor.con_id,m_prefecture.prefecture_name,m_municipality.municipality_name
      ORDER BY u_contractor.name
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
   * 利用業者情報更新
   * @param  {String}   conId            :業者ID
   * @param  {String}   loginId          :ログインID
   * @param  {String}   name             :名称
   * @param  {String}   postalCode       :郵便番号
   * @param  {String}   prefectureCode   :都道府県コード
   * @param  {String}   municipalityCode :市区町村コード
   * @param  {String}   address          :住所（番地以降）
   * @param  {String}   lng              :緯度
   * @param  {String}   lat              :経度
   * @param  {String}   phoneNumber      :電話番号
   * @param  {String}   faxNumber        :FAX番号
   * @param  {String}   emailAddress     :メールアドレス
   * @param  {String}   referralSource   :紹介元
   * @param  {String}   branchName       :支店名
   * @param  {String}   approvalStatus   :承認状態
   * @param  {String}   rejectionReasons :否認理由
   * @param  {String}   isActive         :利用状況
   * @param  {String}   updateDatetime   :更新日時
   * @param  {String}   loginConId       :ログインしている業者ID
   */
  async putContractor(
    conId,
    loginId,
    name,
    postalCode,
    prefectureCode,
    municipalityCode,
    address,
    lng,
    lat,
    phoneNumber,
    faxNumber,
    emailAddress,
    referralSource,
    branchName,
    approvalStatus,
    rejectionReasons,
    isActive,
    updateDatetime,
    loginConId
  ) {
    let result = [];
    let sqlParam = [];
    let setSql = ``;

    //更新日時チェックSQL
    const checkUpdateDatetimeSql = `
      SELECT
        *
      FROM
        u_contractor
      WHERE
        con_id = $1
      AND to_char(update_datetime, 'YYYY/MM/DD HH24:MI') = $2
      FOR UPDATE
      `;
    try {
      // 更新日時チェック
      sqlParam = [conId, updateDatetime];
      result = await this.query(checkUpdateDatetimeSql, sqlParam).catch(
        (err) => {
          throw err;
        }
      );
      //取得件数 = 0件の場合、ロールバックし、エラーを返す
      if (result.rowCount == 0) {
        throw "update target not found";
      }

      //利用業者情報更新処理
      sqlParam = [];
      sqlParam.push(conId);
      let index = 2;
      if (loginId) {
        setSql = setSql.concat(` ,login_id = $`, index++);
        sqlParam.push(loginId);
      }
      if (name) {
        setSql = setSql.concat(` ,name = $`, index++);
        sqlParam.push(name);
      }
      if (postalCode) {
        setSql = setSql.concat(` ,postal_code = $`, index++);
        sqlParam.push(postalCode);
      }
      if (prefectureCode) {
        setSql = setSql.concat(` ,prefecture_code = $`, index++);
        sqlParam.push(prefectureCode);
      }
      if (municipalityCode) {
        setSql = setSql.concat(` ,municipality_code = $`, index++);
        sqlParam.push(municipalityCode);
      }
      if (address) {
        setSql = setSql.concat(` ,address = $`, index++);
        sqlParam.push(address);
      }
      if (lng && lat) {
        setSql = setSql.concat(
          ` ,geom = ST_GeographyFromText('SRID=4326;POINT(' || $`,
          index++
        );
        sqlParam.push(lng);
        setSql = setSql.concat(` || ' ' || $`, index++);
        sqlParam.push(lat);
        setSql = setSql.concat(`|| ')')`);
      }
      if (phoneNumber) {
        setSql = setSql.concat(` ,phone_number = $`, index++);
        sqlParam.push(phoneNumber);
      }
      if (faxNumber) {
        setSql = setSql.concat(` ,fax_number = $`, index++);
        sqlParam.push(faxNumber);
      }
      if (emailAddress) {
        setSql = setSql.concat(` ,email_address = $`, index++);
        sqlParam.push(emailAddress);
      }
      if (referralSource) {
        setSql = setSql.concat(` ,referral_source = $`, index++);
        sqlParam.push(referralSource);
      }
      if (branchName) {
        setSql = setSql.concat(` ,branch_name = $`, index++);
        sqlParam.push(branchName);
      }
      if (approvalStatus) {
        setSql = setSql.concat(` ,approval_status = $`, index++);
        sqlParam.push(approvalStatus);
      }
      if (rejectionReasons) {
        setSql = setSql.concat(` ,rejection_reasons = $`, index++);
        sqlParam.push(rejectionReasons);
      }
      if (typeof isActive === "boolean") {
        setSql = setSql.concat(` ,is_active = $`, index++);
        sqlParam.push(isActive);
      }
      if (loginConId) {
        setSql = setSql.concat(` ,update_id = $`, index++);
        sqlParam.push(loginConId);
      }
      //利用業者情報更新SQL
      const putContractorSql = `
      UPDATE
        u_contractor
      SET
        update_datetime = CURRENT_TIMESTAMP
        ${setSql}
      WHERE
        con_id = $1
      `;
      result = await this.query(putContractorSql, sqlParam).catch((err) => {
        throw err;
      });
      //処理件数が1件でない場合、ロールバックし、エラーを返す
      if (result.rowCount != 1) {
        throw "result.rowCount != 1";
      }
    } catch (err) {
      //エラーを返す
      throw err;
    }
    return;
  }

  /**
   * 品目・単価情報（業者情報）取得
   * @param  {} con_id
   */
  async getApprovalStatus(con_id) {
    let sqlParam = [];
    sqlParam.push(con_id);

    const sql = `
      SELECT
        approval_status
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
    return result[0]?.approval_status || "";
  }

  /* 0.5次開発、1次開発の改善 No.51 品目の自社、利用業者の共同編集対応 2022/09/20 Y.Takagi START */
  /**
   * 業者情報取得
   * @param  {} con_id
   */
  async getContractorInfo(con_id) {
    let sqlParam = [];
    sqlParam.push(con_id);

    const sql = `
        SELECT
        is_active
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
    return result[0]?.is_active || "";
  }
  /* 0.5次開発、1次開発の改善 No.51 品目の自社、利用業者の共同編集対応 2022/09/20 Y.Takagi END */
}
