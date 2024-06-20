import Repository from "./repository.js";

export default class BasicInfoRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * 基本情報取得
   * @param  {} conId
   */
  async getBasicInfo(conId) {
    let sqlParam = [];
    sqlParam.push(conId);

    const sql = `
      SELECT
        u_contractor.name,
        u_contractor.branch_name,
        u_contractor.sales_manager_name,
        u_contractor.postal_code,
        u_contractor.prefecture_code,
        prefecture.prefecture_name AS prefecture_name,
        u_contractor.municipality_code,
        municipality.municipality_name AS municipality_name,
        u_contractor.address,
        ST_X(u_contractor.geom::geometry) AS lng,
        ST_Y(u_contractor.geom::geometry) AS lat,
        u_contractor.phone_number,
        u_contractor.fax_number,
        u_contractor.email_address,
        u_contractor.disposal_license_number,
        u_contractor.is_excellent_certified,
        u_contractor.is_iso_holder,
        u_contractor.is_eco_action_holder,
        u_contractor.is_purchaser,
        u_contractor.is_transport_disposal_company,
        u_contractor.is_container_installation_disposal,
        u_contractor.construction_license_type,
        construction_license_type.code_name AS construction_license_type_name,
        u_contractor.construction_license_div,
        construction_license_div.code_name AS construction_license_div_name,
        u_contractor.construction_license_year,
        u_contractor.construction_license_number,
        u_contractor.construction_license_industry,
        (
          SELECT
            string_agg(m_code.code_name, '・') AS license_industry_type_name
          FROM
            (
              SELECT
                to_number(regexp_split_to_table(construction_license_industry, ','), '99') AS license_industry_type_code
              FROM
                u_contractor
              WHERE
                u_contractor.con_id = $1
            ) AS license_industry_type_table
            JOIN m_code
              ON license_industry_type_table.license_industry_type_code = m_code.code
              AND m_code.group_code = 'CD0009'
        ) AS construction_license_industry_name,
        u_contractor.transport_license_number,
        u_contractor.security_license_number,
        u_contractor.labor_dispatch_license_number,
        u_contractor.bank_code,
        m_bank.bank_name,
        u_contractor.bank_branch_code,
        m_bank_branch.bank_branch_name,
        u_contractor.account_type,
        account_type.code_name AS account_type_name,
        u_contractor.account_code,
        u_contractor.account_holder,
        u_contractor.is_system_possible,
        extract(epoch from u_contractor.update_datetime) AS update_datetime
      FROM
        u_contractor
        JOIN m_prefecture AS prefecture
          ON prefecture.prefecture_code = u_contractor.prefecture_code
        LEFT JOIN m_municipality AS municipality
          ON municipality.municipality_code = u_contractor.municipality_code
        LEFT JOIN m_code AS construction_license_type
          ON construction_license_type.code = u_contractor.construction_license_type
        AND construction_license_type.group_code = 'CD0007'
        LEFT JOIN m_code AS construction_license_div
          ON construction_license_div.code = u_contractor.construction_license_div
          AND construction_license_div.group_code = 'CD0008'
        LEFT JOIN m_bank
          ON m_bank.bank_code = u_contractor.bank_code
        LEFT JOIN m_bank_branch
          ON m_bank_branch.bank_code = u_contractor.bank_code
          AND m_bank_branch.bank_branch_code = u_contractor.bank_branch_code
        LEFT JOIN m_code AS account_type
          ON account_type.code = u_contractor.account_type
          AND account_type.group_code = 'CD0004'
      WHERE
        con_id = $1   
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
   * 基本情報更新
   * @param  {} con_id
   */
  async putBasicInfo(
    conName,
    branchName,
    salesManagerName,
    postalCode,
    prefectureCode,
    municipalityCode,
    address,
    lat,
    lng,
    phoneNumber,
    faxNumber,
    emailAddress,
    disposalLicenseNumber,
    isExcellentCertified,
    isIsoHolder,
    isEcoActionHolder,
    isPurchaser,
    isTransportDisposalCompany,
    isContainerInstallationDisposal,
    licenseFileName,
    constructionLicenseType,
    constructionLicenseDiv,
    constructionLicenseYear,
    constructionLicenseNumber,
    constructionLicenseIndustry,
    transportLicenseNumber,
    securityLicenseNumber,
    laborDispatchLicenseNumber,
    bankCode,
    bankBranchCode,
    accountType,
    accountCode,
    accountHolder,
    updateDatetime,
    loginConId,
    conId
  ) {
    // SQL
    const selectConSql = `
      SELECT
        *
      FROM
        u_contractor
      WHERE
        con_id = $1
        AND extract(epoch from update_datetime) = $2
      FOR UPDATE
    `;

    const updateConSql = `
      UPDATE
        u_contractor
      SET
        name = $1,	
        postal_code = $2,	
        prefecture_code = $3,	
        municipality_code = $4,	
        address = $5,	
        geom = ST_GeographyFromText('SRID=4326;POINT(' || $6 || ' ' || $7 || ')'),
        phone_number = $8,	
        fax_number = $9,	
        email_address = $10,	
        branch_name = $11,	
        disposal_license_number= $12,	
        is_excellent_certified = $13,	
        is_iso_holder = $14,	
        is_eco_action_holder = $15,	
        is_purchaser = $16,	
        is_transport_disposal_company = $17,	
        is_container_installation_disposal = $18,	
        license_file_name = $19,	
        sales_manager_name = $20,	
        construction_license_type = $21,	
        construction_license_div = $22,	
        construction_license_year = $23,	
        construction_license_number = $24,	
        construction_license_industry = $25,	
        transport_license_number = $26,	
        security_license_number = $27,	
        labor_dispatch_license_number = $28,	
        bank_code = $29,	
        bank_branch_code = $30,	
        account_type = $31,	
        account_code = $32,	
        account_holder = $33,	
        update_id = $34,
        update_datetime = CURRENT_TIMESTAMP
      WHERE
        con_id = $35
    `;

    // 登録処理
    try {
      let result = [];
      let sqlParam = [];

      // 更新日時チェック
      sqlParam = [conId, updateDatetime];
      result = await this.query(selectConSql, sqlParam).catch((err) => {
        throw err;
      });

      if (result.rowCount == 0) {
        throw "update target not found";
      }

      // 更新処理
      sqlParam = [
        conName,
        postalCode,
        prefectureCode,
        municipalityCode,
        address,
        lng,
        lat,
        phoneNumber,
        faxNumber,
        emailAddress,
        branchName,
        disposalLicenseNumber,
        isExcellentCertified,
        isIsoHolder,
        isEcoActionHolder,
        isPurchaser,
        isTransportDisposalCompany,
        isContainerInstallationDisposal,
        licenseFileName,
        salesManagerName,
        constructionLicenseType,
        constructionLicenseDiv,
        constructionLicenseYear,
        constructionLicenseNumber,
        constructionLicenseIndustry,
        transportLicenseNumber,
        securityLicenseNumber,
        laborDispatchLicenseNumber,
        bankCode,
        bankBranchCode,
        accountType,
        accountCode,
        accountHolder,
        loginConId,
        conId,
      ];

      result = await this.query(updateConSql, sqlParam).catch((err) => {
        throw err;
      });

      if (result.rowCount != 1) {
        throw "result.rowCount != 1";
      }
    } catch (err) {
      throw err;
    }
    return;
  }
}
