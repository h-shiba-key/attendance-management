import Repository from "./repository.js";

export default class SurplusSoilRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * 残土処理場検索
   * @param {*} param0
   * @returns
   */
  async searchSurplusSoilDisposalSite(
    disposalSiteName = "",
    address = "",
    isAcceptable = false,
    isUnacceptable = false,
    acceptancePeriodStartDate = "",
    acceptancePeriodEndDate = "",
    rowsPerPage = 0,
    offset = 0
  ) {
    let sqlParam = [];
    let whereSql = `where 1 = 1`;

    let totalSql = `SELECT
                      COUNT(*)
                    FROM
                      u_surplus_soil_disposal_site sur 
                    LEFT OUTER JOIN m_prefecture pre 
                      ON pre.prefecture_code = sur.prefecture_code 
                    LEFT OUTER JOIN m_municipality mun
                      ON mun.municipality_code = sur.municipality_code
                   `;

    let disposalSiteListSql = `SELECT
                row_number() over(ORDER BY is_acceptable desc,acceptance_period_end_date) AS "rowNumber"
                , surplus_soil_disposal_site_id
                , name
                , postal_code
                , pre.prefecture_name || mun.municipality_name || address AS address
                , CASE 
                    WHEN is_acceptable = TRUE 
                        THEN '受入可能' 
                    ELSE '受入不可' 
                    END AS is_acceptable
                , to_char(acceptance_period_start_date, 'yyyy/mm/dd') || '～' || to_char(acceptance_period_end_date, 'yyyy/mm/dd')
                    AS acceptance_period
            FROM
                u_surplus_soil_disposal_site sur 
                LEFT OUTER JOIN m_prefecture pre 
                    ON pre.prefecture_code = sur.prefecture_code 
                LEFT OUTER JOIN m_municipality mun
                    ON mun.municipality_code = sur.municipality_code
            `;
    //パラメータ
    let index = 1;
    if (disposalSiteName) {
      whereSql = whereSql.concat(`AND name LIKE $`, index++);
      sqlParam.push("%" + disposalSiteName + "%");
    }
    if (address) {
      whereSql = whereSql.concat(
        ` AND pre.prefecture_name || mun.municipality_name || address LIKE $`,
        index++
      );
      sqlParam.push("%" + address + "%");
    }
    if (isAcceptable && !isUnacceptable) {
      whereSql = whereSql.concat(` AND is_acceptable = True`);
    }
    if (!isAcceptable && isUnacceptable) {
      whereSql = whereSql.concat(` AND is_acceptable = False`);
    }
    if (acceptancePeriodStartDate && acceptancePeriodEndDate) {
      whereSql = whereSql.concat(
        ` AND acceptance_period_end_date >= $`,
        index++,
        ` AND acceptance_period_start_date <= $`,
        index++
      );
      sqlParam.push(acceptancePeriodStartDate);
      sqlParam.push(acceptancePeriodEndDate);
    } else {
      if (acceptancePeriodStartDate) {
        whereSql = whereSql.concat(
          ` AND acceptance_period_start_date >= $`,
          index++
        );
        sqlParam.push(acceptancePeriodStartDate);
      }
      if (acceptancePeriodEndDate) {
        whereSql = whereSql.concat(
          ` AND acceptance_period_end_date <= $`,
          index++
        );
        sqlParam.push(acceptancePeriodEndDate);
      }
    }

    //表示件数取得
    totalSql = totalSql.concat(whereSql);
    let totalNumber = [];
    totalNumber = await this.query(totalSql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    //検索結果取得
    whereSql = whereSql.concat(` LIMIT $`, index++, ` OFFSET $`, index++);
    sqlParam.push(rowsPerPage);
    sqlParam.push(offset);

    disposalSiteListSql = disposalSiteListSql.concat(whereSql);

    let disposalSiteList = [];
    disposalSiteList = await this.query(disposalSiteListSql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    const result = {
      disposalSiteList: disposalSiteList,
      totalNumber: totalNumber[0].count,
    };
    return result;
  }

  /**
   * 残土処理情報取得
   * @param {*} disposalSiteId
   * @returns
   */
  async getSurplusSoilDisposalSite(disposalSiteId) {
    let sqlParam = [];
    let sql = `SELECT
                surplus_soil_disposal_site_id
                , name
                , postal_code
                , sur.prefecture_code
                , pre.prefecture_name
                , sur.municipality_code
                , mun.municipality_name
                , address
                , ST_X(geom ::geometry) AS longitude
                , ST_Y(geom ::geometry) AS latitude
                , phone_number
                , manager_name
                , manager_phone_number
                , responsible_person_name
                , responsible_person_phone_number
                , surplus_soil_unit_price_10t_A
                , surplus_soil_unit_price_10t_B
                , surplus_soil_unit_price_10t_C
                , surplus_soil_unit_price_4t_A
                , surplus_soil_unit_price_4t_B
                , surplus_soil_unit_price_4t_C
                , to_char(acceptance_period_start_date, 'yyyy/mm/dd') AS acceptance_period_start_date
                , to_char(acceptance_period_end_date, 'yyyy/mm/dd') AS acceptance_period_end_date
                , is_acceptable
                , extract(epoch from sur.update_datetime) AS update_datetime
            FROM
              u_surplus_soil_disposal_site sur
              LEFT OUTER JOIN m_prefecture pre 
                    ON pre.prefecture_code = sur.prefecture_code
              LEFT OUTER JOIN m_municipality mun
                    ON mun.municipality_code = sur.municipality_code 
            WHERE
              surplus_soil_disposal_site_id = $1`;

    sqlParam.push(disposalSiteId);
    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });
    return result;
  }

  /**
   * ログインID存在チェック
   */
  async checkSurplusSoilDisposalSiteId(surplusSoilDisposalSiteId) {
    let sqlParam = [];
    let sql = `SELECT EXISTS ( 
                    SELECT
                        * 
                    FROM
                        u_surplus_soil_disposal_site 
                    WHERE
                        surplus_soil_disposal_site_id = $1
                ) `;

    sqlParam.push(surplusSoilDisposalSiteId);
    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });
    return result;
  }

  /**
   * 残土処理場テーブル登録
   */
  async postSurplusSoilDisposalSite(
    surplus_soil_disposal_site_id,
    disposalSiteName,
    postal_code,
    prefecture_code,
    municipality_code,
    address,
    lng,
    lat,
    phone_number,
    manager_name,
    manager_phone_number,
    responsible_person_name,
    responsible_person_phone_number,
    surplus_soil_unit_price_10t_A,
    surplus_soil_unit_price_10t_B,
    surplus_soil_unit_price_10t_C,
    surplus_soil_unit_price_4t_A,
    surplus_soil_unit_price_4t_B,
    surplus_soil_unit_price_4t_C,
    acceptance_period_start_date,
    acceptance_period_end_date,
    is_acceptable,
    con_id
  ) {
    let sqlParam = [];
    sqlParam.push(
      surplus_soil_disposal_site_id,
      disposalSiteName,
      postal_code,
      prefecture_code,
      municipality_code,
      address,
      lng,
      lat,
      phone_number,
      manager_name,
      manager_phone_number,
      responsible_person_name,
      responsible_person_phone_number,
      surplus_soil_unit_price_10t_A,
      surplus_soil_unit_price_10t_B,
      surplus_soil_unit_price_10t_C,
      surplus_soil_unit_price_4t_A,
      surplus_soil_unit_price_4t_B,
      surplus_soil_unit_price_4t_C,
      acceptance_period_start_date,
      acceptance_period_end_date,
      is_acceptable,
      con_id
    );

    let sql = `INSERT INTO
                u_surplus_soil_disposal_site
              VALUES(
                $1,$2,$3,$4,$5,$6
                ,ST_GeographyFromText('SRID=4326;POINT(' || $7 ||' '|| $8 || ')')
                ,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
                ,$22
                ,$23,CURRENT_TIMESTAMP,$23,CURRENT_TIMESTAMP
              )`;

    const result = [];
    try {
      this.startTransaction();

      await this.query(sql, sqlParam)
        .then((res) => this.jsonParse(res))
        .catch((err) => {
          throw err;
        });

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
   * 残土処理場テーブル更新
   */
  async updateSurplusSoilDisposalSite(
    surplus_soil_disposal_site_id,
    name,
    postal_code,
    prefecture_code,
    municipality_code,
    address,
    lng,
    lat,
    phone_number,
    manager_name,
    manager_phone_number,
    responsible_person_name,
    responsible_person_phone_number,
    surplus_soil_unit_price_10t_A,
    surplus_soil_unit_price_10t_B,
    surplus_soil_unit_price_10t_C,
    surplus_soil_unit_price_4t_A,
    surplus_soil_unit_price_4t_B,
    surplus_soil_unit_price_4t_C,
    acceptance_period_start_date,
    acceptance_period_end_date,
    is_acceptable,
    con_id,
    update_datetime
  ) {
    let sqlParam = [];
    sqlParam.push(surplus_soil_disposal_site_id, update_datetime);
    //更新日時チェックSQL
    const checkTimeSql = `SELECT
                          *
                        FROM
                          u_surplus_soil_disposal_site
                        WHERE
                          surplus_soil_disposal_site_id=$1
                          AND extract(epoch from update_datetime) = $2
                        FOR UPDATE
                        `;

    //更新SQL
    const updateSql = `UPDATE 
                      u_surplus_soil_disposal_site
                    SET
                    name = $2
                    , postal_code = $3
                    , prefecture_code = $4
                    , municipality_code = $5
                    , address = $6
                    , geom = ST_GeographyFromText('SRID=4326;POINT(' || $7 ||' '|| $8 || ')')
                    , phone_number = $9
                    , manager_name = $10
                    , manager_phone_number = $11
                    , responsible_person_name = $12
                    , responsible_person_phone_number = $13
                    , surplus_soil_unit_price_10t_A = $14
                    , surplus_soil_unit_price_10t_B = $15
                    , surplus_soil_unit_price_10t_C = $16
                    , surplus_soil_unit_price_4t_A = $17
                    , surplus_soil_unit_price_4t_B = $18
                    , surplus_soil_unit_price_4t_C = $19
                    , acceptance_period_start_date = $20
                    , acceptance_period_end_date = $21
                    , is_acceptable = $22
                    , update_id = $23
                    , update_datetime = CURRENT_TIMESTAMP
                    WHERE
                      surplus_soil_disposal_site_id = $1
                    `;
    try {
      this.startTransaction();
      let checkResult = [];
      checkResult = await this.query(checkTimeSql, sqlParam).catch((err) => {
        throw err;
      });

      //取得件数が0件の場合ロールバック
      if (checkResult.rowCount == 0) {
        throw new Error();
      } else {
        sqlParam = [
          surplus_soil_disposal_site_id,
          name,
          postal_code,
          prefecture_code,
          municipality_code,
          address,
          lng,
          lat,
          phone_number,
          manager_name,
          manager_phone_number,
          responsible_person_name,
          responsible_person_phone_number,
          surplus_soil_unit_price_10t_A,
          surplus_soil_unit_price_10t_B,
          surplus_soil_unit_price_10t_C,
          surplus_soil_unit_price_4t_A,
          surplus_soil_unit_price_4t_B,
          surplus_soil_unit_price_4t_C,
          acceptance_period_start_date,
          acceptance_period_end_date,
          is_acceptable,
          con_id,
        ];

        const updateResult = await this.query(updateSql, sqlParam)
          .then((res) => this.jsonParse(res))
          .catch((err) => {
            throw err;
          });
        //処理件数が1件でない場合ロールバック
        if (updateResult.rowCount == 0) {
          this.rollback();
        } else {
          this.commit();
        }
      }
    } catch (err) {
      this.rollback();
      throw err;
    } finally {
      this.endTransaction();
    }
    return;
  }
}
