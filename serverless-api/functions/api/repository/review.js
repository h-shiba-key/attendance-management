/* 0.5次開発、1次開発の改善 No.2 口コミ削除画面対応 2022/09/05 Y.Takagi START */
import Repository from "./repository.js";

export default class ReviewRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * 口コミ情報取得
   * @param {String} reviewId：口コミID
   */
  async getReview(reviewId) {
    let sqlParam = [reviewId];

    const sql = `
    SELECT
      u_review.create_id AS "reviewer"
    , u_contractor.name AS "contractorName"
    , m_prefecture.prefecture_name AS "prefecture"
    , m_municipality.municipality_name AS "municipality"
    , to_char(u_review.create_datetime, 'YYYY/MM/DD HH24:MI:SS') AS "reviewDate"
    , u_review.evaluation AS "reviewRating"
    , u_review.review_comment AS "reviewContains"
  FROM
    u_review 
    LEFT JOIN u_contractor 
        ON u_review.con_id = u_contractor.con_id 
    LEFT OUTER JOIN m_prefecture 
        ON u_contractor.prefecture_code = m_prefecture.prefecture_code
    LEFT OUTER JOIN m_municipality 
        ON u_contractor.municipality_code = m_municipality.municipality_code
    WHERE
        u_review.review_id = $1
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
   * 口コミ情報検索
   * @param  {String}   reviewer          :
   * @param  {String}   contractorName    :業者名
   * @param  {String}   prefectureCode    :住所（都道府県）
   * @param  {String}   municipalityCode  :住所（市区町村）
   * @param  {String}   reviewDateStart   :口コミ投稿日（開始）
   * @param  {String}   reviewDateEnd     :口コミ投稿日（終了）
   * @param  {String}   reviewRatingStart :口コミ評価（下限）
   * @param  {String}   reviewRatingEnd   :口コミ評価（上限）
   * @param  {String}   reviewContains    :口コミ投稿内容
   * @param  {String}   rowsPerPage       :1ページの行数
   * @param  {String}   offset            :オフセット
   */
  async searchReview(
    reviewer,
    contractorName,
    prefectureCode,
    municipalityCode,
    reviewDateStart,
    reviewDateEnd,
    reviewRatingStart,
    reviewRatingEnd,
    reviewContains,
    rowsPerPage,
    offset
  ) {
    let sqlParam = []; //SQLパラメータ
    let whereSql = `WHERE 1=1 `;
    let index = 1;
    let limitSql = ``;

    //Where句を作成
    if (reviewer) {
      whereSql = whereSql.concat(` AND u_review.create_id LIKE $`, index++);
      sqlParam.push(`%` + reviewer + `%`);
    }
    if (contractorName) {
      whereSql = whereSql.concat(` AND u_contractor.name LIKE $`, index++);
      sqlParam.push(`%` + contractorName + `%`);
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
    if (reviewDateStart) {
      whereSql = whereSql.concat(
        ` AND to_char(u_review.create_datetime, 'YYYY/MM/DD') >= to_char(to_date($`,
        index++,
        `, 'YYYY/MM/DD'), 'YYYY/MM/DD')`
      );
      sqlParam.push(reviewDateStart);
    }
    if (reviewDateEnd) {
      whereSql = whereSql.concat(
        ` AND to_char(u_review.create_datetime, 'YYYY/MM/DD') <= to_char(to_date($`,
        index++,
        `, 'YYYY/MM/DD'), 'YYYY/MM/DD')`
      );
      sqlParam.push(reviewDateEnd);
    }
    if (reviewRatingStart) {
      whereSql = whereSql.concat(` AND u_review.evaluation >= $`, index++);
      sqlParam.push(reviewRatingStart);
    }
    if (reviewRatingEnd) {
      whereSql = whereSql.concat(` AND u_review.evaluation <= $`, index++);
      sqlParam.push(reviewRatingEnd);
    }
    if (reviewContains) {
      whereSql = whereSql.concat(
        ` AND u_review.review_comment LIKE $`,
        index++
      );
      sqlParam.push(`%` + reviewContains + `%`);
    }

    //総件数取得用SQL文を作成
    const sqlForCount = `
      SELECT
        count(review_id) 
      FROM
        u_review
      LEFT JOIN u_contractor
        ON u_review.con_id = u_contractor.con_id
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

    //利用業者情報リスト取得用SQL文を作成
    const sqlForList = `
    SELECT
      u_review.review_id AS "review_id"
    , row_number() over (ORDER BY u_review.create_datetime desc) AS "rowNumber"
    , u_review.create_id AS "reviewer_id"
    , u_contractor.name AS "contractorName"
    , m_prefecture.prefecture_name AS "prefecture"
    , m_municipality.municipality_name AS "municipality"
    , to_char(u_review.create_datetime, 'YYYY/MM/DD HH24:MI:SS') AS "reviewDate"
    , u_review.evaluation AS "reviewRating"
    , CASE 
        WHEN char_length(u_review.review_comment) > 10 THEN
          left(u_review.review_comment, 10) || '...'
        ELSE
          u_review.review_comment
      END AS "reviewContains"
  FROM
    u_review 
    LEFT JOIN u_contractor
        ON u_review.con_id = u_contractor.con_id
    LEFT OUTER JOIN m_prefecture 
        ON u_contractor.prefecture_code = m_prefecture.prefecture_code
    LEFT OUTER JOIN m_municipality 
        ON u_contractor.municipality_code = m_municipality.municipality_code
  ${whereSql}
  ORDER BY u_review.create_datetime desc
  ${limitSql}
    `;

    let reviewList = [];
    let newPageIndex = offset >= 0 ? offset / rowsPerPage : 0;
    let reGetFlg = false;
    do {
      let tempSqlParam = [...sqlParam];
      tempSqlParam.push(offset);
      console.log(tempSqlParam);
      //口コミ投稿リストを取得
      reviewList = await this.query(sqlForList, tempSqlParam)
        .then((res) => this.jsonParse(res).rows)
        .catch((err) => {
          throw err;
        });
      if (reviewList.length == 0 && offset > 0) {
        offset = offset - rowsPerPage;
        newPageIndex = offset >= 0 ? offset / rowsPerPage : 0;
        reGetFlg = true;
      } else {
        reGetFlg = false;
      }
    } while (reGetFlg);

    const result = {
      reviewList: reviewList,
      totalNumber: totalNumber[0].count,
      newPageIndex: newPageIndex,
    };

    return result;
  }

  /**
   * 口コミのバックアップと削除
   * @param {*} reviewId
   * @param {*} loginId
   */
  async deleteReview(reviewId, loginId) {
    let sqlParam = [];

    //口コミ削除履歴テーブル更新SQL
    let insertSql = `
      INSERT INTO u_review_del_his (
          review_id,
          con_id,
          evaluation,
          review_comment,
          reviewer_id,
          org_create_id,
          org_create_datetime,
          org_update_id,
          org_update_datetime,
          delete_id,
          delete_datetime) 
          SELECT
            review_id,
            con_id,
            evaluation,
            review_comment,
            reviewer_id,
            create_id AS org_create_id,
            create_datetime AS org_create_datetime,
            update_id AS org_update_id,
            update_datetime AS org_update_datetime,
            $1 AS delete_id,
            CURRENT_TIMESTAMP AS delete_datetime
          FROM u_review
           WHERE review_id = $2
    `;

    //口コミテーブル削除SQL
    let deleteSql = `
      DELETE 
      FROM u_review
      WHERE review_id = $1
    `;

    try {
      this.startTransaction();

      //口コミ履歴テーブルデータ更新
      sqlParam = [loginId, reviewId];
      console.log(sqlParam);
      let result = [];
      // バックアップを実施
      result = await this.query(insertSql, sqlParam).catch((err) => {
        throw new Error("review backup error");
      });

      sqlParam = [reviewId];
      console.log(sqlParam);
      //口コミテーブルデータ削除
      result = await this.query(deleteSql, sqlParam).catch((err) => {
        throw new Error("review delete error");
      });

      // 削除対象が見つからなかった場合、
      if (result.rowCount == 0) {
        this.rollback();
        throw new Error("update target not found");
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

//サンプルコード
   /**
   * 
   * @param  {} employeeId
   */
  async getAcquisitionMonth(employeeId) {
    let sqlParam = [employeeId];

    const sql = `
    SELECT 
      year,
      month,
      confirmation_status 
    FROM 
      t_confirmation_status 
    WHERE 
      employee_id=$1
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
  async putReview(
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
        u_review
      WHERE
        con_id = $1
      AND to_char(update_datetime, 'YYYY/MM/DD HH24:MI') = $2
      FOR UPDATE
      `;
    try {
      //トランザクション処理を開始
      this.startTransaction();
      // 更新日時チェック
      sqlParam = [conId, updateDatetime];
      result = await this.query(checkUpdateDatetimeSql, sqlParam).catch(
        (err) => {
          throw err;
        }
      );
      //取得件数 = 0件の場合、ロールバックし、エラーを返す
      if (result.rowCount == 0) {
        this.rollback();
        throw { message: "update target not found" };
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
      const putReviewSql = `
      UPDATE
        u_review
      SET
        update_datetime = CURRENT_TIMESTAMP
        ${setSql}
      WHERE
        con_id = $1
      `;
      result = await this.query(putReviewSql, sqlParam).catch((err) => {
        throw err;
      });
      //処理件数が1件でない場合、ロールバックし、エラーを返す
      if (result.rowCount != 1) {
        this.rollback();
        throw err;
      }
      //コミット
      this.commit();
    } catch (err) {
      //ロールバック
      this.rollback();
      //エラーを返す
      throw err;
    } finally {
      //トランザクション処理を終了する
      this.endTransaction();
    }
    return;
  }
}
/* 0.5次開発、1次開発の改善 No.2 口コミ削除画面対応 2022/09/05 Y.Takagi END */
