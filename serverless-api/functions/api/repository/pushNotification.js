/* プッシュ通知配信予約対応 2023/01/26 Y.Murase START */
import Repository from "./repository.js";
import { DELIVERY_CONTENT_INDEX } from "../../../common/constants/pushNotification.js";

export default class PushNotificationRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * 配信情報取得
   * @param {String} pushNotificationId ：通知ID
   * @param {String} deliveryContentCode：配信内容
   */
  async getPushNotification(pushNotificationId, deliveryContentCode) {
    let sqlParam = [pushNotificationId];
    let sql = "";

    if (deliveryContentCode == DELIVERY_CONTENT_INDEX.NOTICE) {
      sql = `
    SELECT
      u_notification_info.notification_id AS "notification_id"
      , m_code.code_name AS "notificationType"
      , m_notification_category.category_name AS "category"
      , membershipType.code_name AS "membershipType"
      , industry.code_name AS "industry"
      , prefecture.prefecture_name AS "prefecture"
      , CASE
          WHEN public_end_date is null
              THEN
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'
              ELSE
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'||to_char(public_end_date,'YYYY/MM/DD')||' '||'23:59'
        END AS "publish"
      , u_notification_info.deliverycontent AS "deliveryContent"
      , u_notification_info.subject AS "subject"
      , u_notification_info.body AS "body"
      , u_notification_info.push_notification_send_flag AS "pushNotificationSendFlag"
      , u_notification_info.image_url AS "imageUrl"
    FROM
      u_notification_info
      LEFT JOIN m_code 
            ON u_notification_info.notification_type = m_code.code AND m_code.group_code = 'CD0011'
      LEFT JOIN m_notification_category
            ON u_notification_info.category = m_notification_category.category_code
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(m_code.code_name), '、') AS code_name 
        FROM
          ( 
            SELECT
              * 
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '3' 
            ORDER BY
              u_notification_target.sort_order ASC
          ) AS target
        LEFT JOIN m_code 
            ON target.code_value = cast(m_code.code as character varying)
        WHERE
          m_code.group_code = 'CD0013'
        GROUP BY
          target.notification_id) AS membershipType ON u_notification_info.notification_id = membershipType.notification_id
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(m_code.code_name), '、') AS code_name 
        FROM
          ( 
            SELECT
              * 
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '1' 
            ORDER BY
              u_notification_target.sort_order ASC
          ) AS target
          LEFT JOIN m_code 
              ON target.code_value = cast(m_code.code as character varying)
        WHERE
          m_code.group_code = 'CD0010'
        GROUP BY
          target.notification_id) AS industry ON u_notification_info.notification_id = industry.notification_id
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(m_prefecture.prefecture_name), '、') AS prefecture_name 
        FROM
          ( 
            SELECT
              * 
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '0' 
            ORDER BY
              u_notification_target.sort_order ASC
          ) AS target 
        LEFT JOIN m_prefecture 
            ON target.code_value = m_prefecture.prefecture_code 
        GROUP BY
          target.notification_id) AS prefecture ON u_notification_info.notification_id = prefecture.notification_id
    WHERE 
      u_notification_info.notification_id = $1
    `;
    }

    if (deliveryContentCode == DELIVERY_CONTENT_INDEX.QUESTIONNAIRE) {
      sql = ` 
    SELECT
      u_notification_info.notification_id AS "notification_id"
      , m_code.code_name AS "notificationType"
      , m_notification_category.category_name AS "category"
      , membershipType.code_name AS "membershipType"
      , industry.code_name AS "industry"
      , prefecture.prefecture_name AS "prefecture"
      , CASE
          WHEN public_end_date is null
              THEN
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'
              ELSE
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'||to_char(public_end_date,'YYYY/MM/DD')||' '||'23:59'
        END AS "publish"
      , u_notification_info.deliverycontent AS "deliveryContent"
      , u_notification_info.subject AS "subject"
      , u_notification_info.body AS "body"
      , u_questionnaire_questions.question1 AS "question1"
      , u_questionnaire_questions.question2 AS "question2"
      , u_questionnaire_questions.question3 AS "question3"
      , u_questionnaire_questions.question4 AS "question4"
      , u_questionnaire_questions.question5 AS "question5"
      , u_notification_info.additionalpoints AS "additionalpoints"
      , to_char(u_notification_info.expire_datetime,'YYYY/MM/DD HH24:MI') AS "expire_datetime"
      , u_notification_info.push_notification_send_flag AS "pushNotificationSendFlag"
      , u_notification_info.image_url AS "imageUrl"
    FROM
      u_notification_info
      LEFT JOIN m_code 
            ON u_notification_info.notification_type = m_code.code AND m_code.group_code = 'CD0011'
      LEFT JOIN m_notification_category
            ON u_notification_info.category = m_notification_category.category_code
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(m_code.code_name), '、') AS code_name 
        FROM
          ( 
            SELECT
              * 
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '3' 
            ORDER BY
              u_notification_target.sort_order ASC
          ) AS target
        LEFT JOIN m_code 
            ON target.code_value = cast(m_code.code as character varying)
        WHERE
          m_code.group_code = 'CD0013'
        GROUP BY
          target.notification_id) AS membershipType ON u_notification_info.notification_id = membershipType.notification_id
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(m_code.code_name), '、') AS code_name 
        FROM
          ( 
            SELECT
              * 
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '1' 
            ORDER BY
              u_notification_target.sort_order ASC
          ) AS target
          LEFT JOIN m_code 
              ON target.code_value = cast(m_code.code as character varying)
        WHERE
          m_code.group_code = 'CD0010'
        GROUP BY
          target.notification_id) AS industry ON u_notification_info.notification_id = industry.notification_id
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(m_prefecture.prefecture_name), '、') AS prefecture_name 
        FROM
          ( 
            SELECT
              * 
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '0' 
            ORDER BY
              u_notification_target.sort_order ASC
          ) AS target 
        LEFT JOIN m_prefecture 
          ON target.code_value = m_prefecture.prefecture_code 
        GROUP BY
          target.notification_id) AS prefecture ON u_notification_info.notification_id = prefecture.notification_id
      LEFT JOIN u_questionnaire_questions
            ON u_notification_info.notification_id = u_questionnaire_questions.notification_id
    WHERE 
      u_notification_info.notification_id = $1
    `;
    }

    if (deliveryContentCode == DELIVERY_CONTENT_INDEX.APPLY) {
      sql = `
    SELECT
      u_notification_info.notification_id AS "notification_id"
      , m_code.code_name AS "notificationType"
      , m_notification_category.category_name AS "category"
      , membershipType.code_name AS "membershipType"
      , industry.code_name AS "industry"
      , prefecture.prefecture_name AS "prefecture"
      , CASE
          WHEN public_end_date is null
              THEN
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'
              ELSE
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'||to_char(public_end_date,'YYYY/MM/DD')||' '||'23:59'
        END AS "publish"
      , u_notification_info.deliverycontent AS "deliveryContent"
      , u_notification_info.subject AS "subject"
      , u_notification_info.body AS "body"
      , u_notification_info.consumptionpoints AS "consumptionpoints"
      , to_char(u_notification_info.expire_datetime,'YYYY/MM/DD HH24:MI') AS "expire_datetime"
      , u_notification_info.push_notification_send_flag AS "pushNotificationSendFlag"
      , u_notification_info.image_url AS "imageUrl"
    FROM
      u_notification_info
      LEFT JOIN m_code 
            ON u_notification_info.notification_type = m_code.code AND m_code.group_code = 'CD0011'
      LEFT JOIN m_notification_category
            ON u_notification_info.category = m_notification_category.category_code
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(m_code.code_name), '、') AS code_name 
        FROM
          ( 
            SELECT
              * 
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '3' 
            ORDER BY
              u_notification_target.sort_order ASC
          ) AS target
        LEFT JOIN m_code 
            ON target.code_value = cast(m_code.code as character varying)
        WHERE
          m_code.group_code = 'CD0013'
        GROUP BY
          target.notification_id) AS membershipType ON u_notification_info.notification_id = membershipType.notification_id
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(m_code.code_name), '、') AS code_name 
        FROM
          ( 
            SELECT
              * 
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '1' 
            ORDER BY
              u_notification_target.sort_order ASC
          ) AS target
          LEFT JOIN m_code 
              ON target.code_value = cast(m_code.code as character varying)
        WHERE
          m_code.group_code = 'CD0010'
        GROUP BY
          target.notification_id) AS industry ON u_notification_info.notification_id = industry.notification_id
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(m_prefecture.prefecture_name), '、') AS prefecture_name 
        FROM
          ( 
            SELECT
              * 
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '0' 
            ORDER BY
              u_notification_target.sort_order ASC
          ) AS target 
        LEFT JOIN m_prefecture 
          ON target.code_value = m_prefecture.prefecture_code 
        GROUP BY
          target.notification_id) AS prefecture ON u_notification_info.notification_id = prefecture.notification_id 
    WHERE 
      u_notification_info.notification_id = $1
    `;
    }

    if (deliveryContentCode == DELIVERY_CONTENT_INDEX.FORM) {
      sql = `
    SELECT
      u_notification_info.notification_id AS "notification_id"
      , m_code.code_name AS "notificationType"
      , m_notification_category.category_name AS "category"
      , CASE
          WHEN public_end_date is null
              THEN
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'
              ELSE
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'||to_char(public_end_date,'YYYY/MM/DD')||' '||'23:59'
        END AS "publish"
      , u_notification_info.deliverycontent AS "deliveryContent"
      , u_notification_info.subject AS "subject"
      , u_notification_info.body AS "body"
      , userId.code_value AS "userId"
      , u_notification_info.push_notification_send_flag AS "pushNotificationSendFlag"
      , u_notification_info.image_url AS "imageUrl"
    FROM
      u_notification_info
      LEFT JOIN m_code 
            ON u_notification_info.notification_type = m_code.code AND m_code.group_code = 'CD0011'
      LEFT JOIN m_notification_category
            ON u_notification_info.category = m_notification_category.category_code
      LEFT JOIN(
        SELECT
          target.notification_id
          , ARRAY_TO_STRING(ARRAY_AGG(target.code_value), ',') AS code_value 
        FROM(
            SELECT
              *
            FROM
              u_notification_target 
            WHERE
              u_notification_target.code_type = '2' 
            ORDER BY
              u_notification_target.sort_order ASC) AS target
        GROUP BY
          target.notification_id) AS userId ON u_notification_info.notification_id = userId.notification_id
    WHERE 
      u_notification_info.notification_id = $1
    `;
    }

    if (deliveryContentCode == DELIVERY_CONTENT_INDEX.QUIZ) {
      sql = ` 
      SELECT
        u_notification_info.notification_id AS "notification_id"
        , m_code.code_name AS "notificationType"
        , m_notification_category.category_name AS "category"
        , membershipType.code_name AS "membershipType"
        , industry.code_name AS "industry"
        , prefecture.prefecture_name AS "prefecture"
        , CASE
            WHEN public_end_date is null
                THEN
                    to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'
                ELSE
                    to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'||to_char(public_end_date,'YYYY/MM/DD')||' '||'23:59'
          END AS "publish"
        , u_notification_info.deliverycontent AS "deliveryContent"
        , u_notification_info.subject AS "subject"
        , u_notification_info.body AS "body"
        , u_quiz_questions.question1 AS "quizQuestion1"
        , u_quiz_questions.question2 AS "quizQuestion2"
        , u_quiz_questions.question3 AS "quizQuestion3"
        , u_quiz_questions.question4 AS "quizQuestion4"
        , u_quiz_questions.question5 AS "quizQuestion5"
        , u_quiz_questions.correct_answer AS "correctAnswer"
        , u_quiz_questions.commentary AS "quizCommentary"
        , u_notification_info.additionalpoints AS "additionalpoints"
        , u_notification_info.additionalpoints2 AS "additionalpoints2"
        , to_char(u_notification_info.expire_datetime,'YYYY/MM/DD HH24:MI') AS "expire_datetime"
        , u_notification_info.push_notification_send_flag AS "pushNotificationSendFlag"
        , u_notification_info.image_url AS "imageUrl"
      FROM
        u_notification_info
        LEFT JOIN m_code 
              ON u_notification_info.notification_type = m_code.code AND m_code.group_code = 'CD0011'
        LEFT JOIN m_notification_category
              ON u_notification_info.category = m_notification_category.category_code
        LEFT JOIN(
          SELECT
            target.notification_id
            , ARRAY_TO_STRING(ARRAY_AGG(m_code.code_name), '、') AS code_name 
          FROM
            ( 
              SELECT
                * 
              FROM
                u_notification_target 
              WHERE
                u_notification_target.code_type = '3' 
              ORDER BY
                u_notification_target.sort_order ASC
            ) AS target
          LEFT JOIN m_code 
              ON target.code_value = cast(m_code.code as character varying)
          WHERE
            m_code.group_code = 'CD0013'
          GROUP BY
            target.notification_id) AS membershipType ON u_notification_info.notification_id = membershipType.notification_id
        LEFT JOIN(
          SELECT
            target.notification_id
            , ARRAY_TO_STRING(ARRAY_AGG(m_code.code_name), '、') AS code_name 
          FROM
            ( 
              SELECT
                * 
              FROM
                u_notification_target 
              WHERE
                u_notification_target.code_type = '1' 
              ORDER BY
                u_notification_target.sort_order ASC
            ) AS target
            LEFT JOIN m_code 
                ON target.code_value = cast(m_code.code as character varying)
          WHERE
            m_code.group_code = 'CD0010'
          GROUP BY
            target.notification_id) AS industry ON u_notification_info.notification_id = industry.notification_id
        LEFT JOIN(
          SELECT
            target.notification_id
            , ARRAY_TO_STRING(ARRAY_AGG(m_prefecture.prefecture_name), '、') AS prefecture_name 
          FROM
            ( 
              SELECT
                * 
              FROM
                u_notification_target 
              WHERE
                u_notification_target.code_type = '0' 
              ORDER BY
                u_notification_target.sort_order ASC
            ) AS target 
          LEFT JOIN m_prefecture 
            ON target.code_value = m_prefecture.prefecture_code 
          GROUP BY
            target.notification_id) AS prefecture ON u_notification_info.notification_id = prefecture.notification_id
        LEFT JOIN u_quiz_questions
              ON u_notification_info.notification_id = u_quiz_questions.notification_id
      WHERE 
        u_notification_info.notification_id = $1
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
   * 配信情報検索
   * @param  {String}   notificationTypeCode  :振り分け種別
   * @param  {String}   categoryCode          :配信カテゴリー
   * @param  {String}   industryCode          :業種
   * @param  {String}   prefectureCode        :住所（都道府県）
   * @param  {String}   publicStartDate       :掲載期間（開始日）
   * @param  {String}   publicStartTime       :掲載期間（開始時刻）
   * @param  {String}   publicEndDate         :掲載期間（終了日）
   * @param  {String}   subject               :件名
   * @param  {String}   notice                :通知
   * @param  {String}   questionnaire         :アンケート
   * @param  {String}   apply                 :懸賞
   * @param  {String}   form                  :応募フォーム
   * @param  {String}   undelivered           :配信予定
   * @param  {String}   duringDelivery        :配信中
   * @param  {String}   endDelivery           :配信終了
   * @param  {String}   rowsPerPage           :1ページの行数
   * @param  {String}   offset                :オフセット
   */
  async searchPushNotification(
    notificationTypeCode,
    categoryCode,
    industryCode,
    prefectureCode,
    publicStartDate,
    publicStartTime,
    publicEndDate,
    subject,
    notice,
    questionnaire,
    apply,
    form,
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
    quiz,
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
    undelivered,
    duringDelivery,
    endDelivery,
    rowsPerPage,
    offset
  ) {
    let sqlParam = []; //SQLパラメータ
    let whereSql = `WHERE 1=1 `;
    let index = 1;
    let limitSql = ``;
    let deliveryContent = ``;
    let deliveryStatus = ``;

    if (notice) {
      deliveryContent += `'` + DELIVERY_CONTENT_INDEX.NOTICE + `',`;
    }
    if (questionnaire) {
      deliveryContent += `'` + DELIVERY_CONTENT_INDEX.QUESTIONNAIRE + `',`;
    }
    if (apply) {
      deliveryContent += `'` + DELIVERY_CONTENT_INDEX.APPLY + `',`;
    }
    if (form) {
      deliveryContent += `'` + DELIVERY_CONTENT_INDEX.FORM + `',`;
    }
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
    if (quiz) {
      deliveryContent += `'` + DELIVERY_CONTENT_INDEX.QUIZ + `',`;
    }
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
    if (deliveryContent == ``) {
      deliveryContent = null;
    } else {
      deliveryContent += `null`;
    }

    if (undelivered) {
      deliveryStatus += `'` + "0" + `',`;
    }
    if (duringDelivery) {
      deliveryStatus += `'` + "1" + `',`;
    }
    if (endDelivery) {
      deliveryStatus += `'` + "2" + `',`;
    }
    if (deliveryContent == ``) {
      deliveryStatus = null;
    } else {
      deliveryStatus += `null`;
    }

    //Where句を作成
    if (deliveryContent) {
      whereSql = whereSql.concat(
        `AND u_notification_info.deliverycontent IN (${deliveryContent}) `
      );
    }
    if (deliveryStatus) {
      whereSql = whereSql.concat(
        `AND u_notification_info.delivery_status IN (${deliveryStatus}) `
      );
    }
    if (notificationTypeCode) {
      whereSql = whereSql.concat(
        ` AND u_notification_info.notification_type = $`,
        index++
      );
      sqlParam.push(notificationTypeCode);
    }
    if (categoryCode) {
      whereSql = whereSql.concat(
        ` AND u_notification_info.category = $`,
        index++
      );
      sqlParam.push(categoryCode);
    }
    if (String(industryCode)) {
      whereSql = whereSql.concat(
        `AND EXISTS (SELECT 1 FROM u_notification_target WHERE code_type = '1' AND u_notification_target.notification_id = u_notification_info.notification_id AND code_value = $`,
        index++,
        `)`
      );
      sqlParam.push(industryCode);
    }
    if (prefectureCode) {
      whereSql = whereSql.concat(
        `AND EXISTS (SELECT 1 FROM u_notification_target WHERE code_type = '0' AND u_notification_target.notification_id = u_notification_info.notification_id AND code_value = $`,
        index++,
        `)`
      );
      sqlParam.push(prefectureCode);
    }
    if (publicStartDate) {
      whereSql = whereSql.concat(
        ` AND to_char(u_notification_info.public_start_date, 'YYYY/MM/DD') >= to_char(to_date($`,
        index++,
        `, 'YYYY/MM/DD'), 'YYYY/MM/DD')`
      );
      sqlParam.push(publicStartDate);
    }
    if (publicStartTime) {
      whereSql = whereSql.concat(
        ` AND to_char(CAST(u_notification_info.public_start_time AS TIME), 'HH24:MI') = to_char(CAST($`,
        index++,
        `AS TIME), 'HH24:MI')`
      );
      sqlParam.push(publicStartTime);
    }
    if (publicEndDate) {
      whereSql = whereSql.concat(
        ` AND to_char(u_notification_info.public_end_date, 'YYYY/MM/DD') <= to_char(to_date($`,
        index++,
        `, 'YYYY/MM/DD'), 'YYYY/MM/DD')`
      );
      sqlParam.push(publicEndDate);
    }
    if (subject) {
      whereSql = whereSql.concat(
        ` AND u_notification_info.subject LIKE $`,
        index++
      );
      sqlParam.push(`%` + subject + `%`);
    }

    //総件数取得用SQL文を作成
    const sqlForCount = `
      SELECT
        count(notification_id) 
      FROM
        u_notification_info
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

    //配信情報リスト取得用SQL文を作成
    const sqlForList = `
    SELECT
      u_notification_info.notification_id AS "notification_id"
      , row_number() over (ORDER BY u_notification_info.create_datetime desc) AS "rowNumber"
      , CASE delivery_status
          WHEN '0' THEN '配信予定'
          WHEN '1' THEN '配信中'
          WHEN '2' THEN '配信終了'
          ELSE ''
          END AS "deliveryStatus"
      , u_notification_info.deliverycontent AS "deliveryContent"
      , m_notification_category.category_name AS "category"
      , industry.code_name AS "industry"
      , prefecture.prefecture_name AS prefecture
      , CASE
          WHEN public_end_date is null
              THEN
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'
              ELSE
                  to_char(public_start_date,'YYYY/MM/DD')|| ' ' ||to_char(public_start_time,'HH24:MI')||'～'||to_char(public_end_date,'YYYY/MM/DD')||' '||'23:59'
        END AS "publish"
      , CASE 
          WHEN char_length(u_notification_info.subject) > 10 
              THEN
                  left(u_notification_info.subject, 10) || '...'
              ELSE
                  u_notification_info.subject
        END AS "subject"
    FROM
      u_notification_info
      LEFT JOIN m_notification_category 
          ON u_notification_info.category = m_notification_category.category_code
      LEFT JOIN(
        SELECT
          target.notification_id
          ,ARRAY_TO_STRING(ARRAY_AGG(target.code_value), ',') AS code_value
          , CASE
              WHEN (SELECT count(*) FROM u_notification_target AS a WHERE a.notification_id = target.notification_id AND a.code_type = '1') >=2
                THEN
                  (SELECT b.code_name FROM u_notification_target AS a LEFT JOIN m_code AS b ON a.code_value = cast(b.code as character varying) WHERE a.notification_id = target.notification_id AND a.code_type = '1' AND b.group_code = 'CD0010' ORDER BY a.sort_order ASC LIMIT 1)||' 他'
                ELSE
                  (SELECT b.code_name FROM u_notification_target AS a LEFT JOIN m_code AS b ON a.code_value = cast(b.code as character varying) WHERE a.notification_id = target.notification_id AND a.code_type = '1' AND b.group_code = 'CD0010' ORDER BY a.sort_order ASC LIMIT 1)
            END AS code_name
        FROM
            u_notification_target AS target
        WHERE
            target.code_type = '1'
        GROUP BY target.notification_id) AS industry on u_notification_info.notification_id = industry.notification_id
      LEFT JOIN(
        SELECT
          target.notification_id
          ,ARRAY_TO_STRING(ARRAY_AGG(target.code_value), ',') AS code_value
          , CASE
              WHEN (SELECT count(*) FROM u_notification_target AS a WHERE a.notification_id = target.notification_id AND a.code_type = '0') >=2
                THEN
                  (SELECT b.prefecture_name FROM u_notification_target AS a left join m_prefecture AS b on a.code_value = b.prefecture_code WHERE a.notification_id = target.notification_id AND a.code_type = '0' ORDER BY a.sort_order ASC LIMIT 1)||' 他'
                ELSE
                  (SELECT b.prefecture_name FROM u_notification_target AS a left join m_prefecture AS b on a.code_value = b.prefecture_code WHERE a.notification_id = target.notification_id AND a.code_type = '0' ORDER BY a.sort_order ASC LIMIT 1)
            END AS prefecture_name
        FROM
            u_notification_target AS target
        WHERE
            target.code_type = '1'
        GROUP BY target.notification_id) AS prefecture on u_notification_info.notification_id = prefecture.notification_id
  ${whereSql}
  ORDER BY u_notification_info.create_datetime DESC
  ${limitSql}
    `;

    let pushNotificationList = [];
    let newPageIndex = offset >= 0 ? offset / rowsPerPage : 0;
    let reGetFlg = false;
    do {
      let tempSqlParam = [...sqlParam];
      tempSqlParam.push(offset);
      console.log(tempSqlParam);
      //配信情報リストを取得
      pushNotificationList = await this.query(sqlForList, sqlParam)
        .then((res) => this.jsonParse(res).rows)
        .catch((err) => {
          throw err;
        });
      if (pushNotificationList.length == 0 && offset > 0) {
        offset = offset - rowsPerPage;
        newPageIndex = offset >= 0 ? offset / rowsPerPage : 0;
        reGetFlg = true;
      } else {
        reGetFlg = false;
      }
    } while (reGetFlg);

    const result = {
      pushNotificationList: pushNotificationList,
      totalNumber: totalNumber[0].count,
      newPageIndex: newPageIndex,
    };

    return result;
  }

  /**
   * 配信ID取得
   */
  async getPushNotificationId() {
    let sqlParam = [];

    const sql = `
      SELECT 
        nextval('notification_id_seq') AS nextval
      `;

    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result[0].nextval;
  }

  /**
   * おトク情報テーブル・登録
   * @param  {String}   pushNotificationId    :通知ID
   * @param  {String}   notificationTypeCode  :振り分け種別
   * @param  {String}   deliveryContent       :配信内容
   * @param  {String}   categoryCode          :配信カテゴリー
   * @param  {String}   publicStartDate       :掲載期間（開始日）
   * @param  {String}   publicStartTime       :掲載期間（開始時刻）
   * @param  {String}   publicEndDate         :掲載期間（終了日）
   * @param  {String}   subject               :件名
   * @param  {String}   body                  :本文
   * @param  {String}   imageUrl              :画像URL
   * @param  {String}   question1             :質問１
   * @param  {String}   question2             :質問２
   * @param  {String}   question3             :質問３
   * @param  {String}   question4             :質問４
   * @param  {String}   question5             :質問５
   * @param  {String}   additionalpoints      :加算ポイント
   * @param  {String}   consumptionpoints     :消費ポイント
   * @param  {String}   questionCount         :質問数
   * @param  {String}   loginConId            :ログインしている業者ID
   */

  async postPushNotificationInfo(
    pushNotificationId,
    notificationTypeCode,
    deliveryContent,
    categoryCode,
    publicStartDate,
    publicStartTime,
    publicEndDate,
    subject,
    body,
    imageUrl,
    question1,
    question2,
    question3,
    question4,
    question5,
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
    quizQuestion1,
    quizQuestion2,
    quizQuestion3,
    quizQuestion4,
    quizQuestion5,
    correctAnswer,
    quizCommentary,
    expireDate,
    expireTime,
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
    additionalpoints,
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
    additionalpoints2,
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
    consumptionpoints,
    questionCount,
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
    quizQuestionCount,
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
    /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi START */
    pushNotificationSendFlag,
    /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi END */
    loginConId
  ) {
    let result = [];
    let sqlParam = [];

    // 締切日を設定
    let expireDateTime = null;
    if (expireDate && expireTime) {
      expireDateTime = expireDate + " " + expireTime;
    } else if (expireDate && !expireDateTime) {
      expireDateTime = expireDate + " 23:59";
    }

    //おトク情報テーブル登録SQL
    let insertPushNotificationInfoSql = "";
    if (deliveryContent == DELIVERY_CONTENT_INDEX.NOTICE) {
      sqlParam = [
        pushNotificationId,
        notificationTypeCode,
        deliveryContent,
        categoryCode,
        publicStartDate,
        publicStartTime,
        publicEndDate,
        subject,
        body,
        imageUrl,
        loginConId,
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi START */
        pushNotificationSendFlag,
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi END */
      ];
      console.log(sqlParam);
      insertPushNotificationInfoSql = `
      INSERT INTO u_notification_info (
        notification_id,
        notification_type,
        deliverycontent,
        category,
        public_start_date,
        public_start_time,
        public_end_date,
        subject,
        body,
        image_url,
        delivery_status,
        additionalpoints,
        consumptionpoints,
        create_id,
        create_datetime,
        update_id,
        update_datetime,
        expire_datetime,
        push_notification_send_flag
      )
      VALUES(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        '0',
        0,
        0,
        $11,
        CURRENT_TIMESTAMP,
        $11,
        CURRENT_TIMESTAMP,
        null,
        $12
      )
    `;
    }

    if (deliveryContent == DELIVERY_CONTENT_INDEX.QUESTIONNAIRE) {
      sqlParam = [
        pushNotificationId,
        notificationTypeCode,
        deliveryContent,
        categoryCode,
        publicStartDate,
        publicStartTime,
        publicEndDate,
        subject,
        body,
        imageUrl,
        additionalpoints,
        loginConId,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
        expireDateTime,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi START */
        pushNotificationSendFlag,
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi END */
      ];

      insertPushNotificationInfoSql = `
        INSERT INTO u_notification_info (
          notification_id,
          notification_type,
          deliverycontent,
          category,
          public_start_date,
          public_start_time,
          public_end_date,
          subject,
          body,
          image_url,
          delivery_status,
          additionalpoints,
          consumptionpoints,
          create_id,
          create_datetime,
          update_id,
          update_datetime,
          expire_datetime,
          push_notification_send_flag
        )
        VALUES(
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          '0',
          cast($11 as integer),
          0,
          $12,
          CURRENT_TIMESTAMP,
          $12,
          CURRENT_TIMESTAMP,
          $13,
          $14
        )
      `;
    }

    if (deliveryContent == DELIVERY_CONTENT_INDEX.APPLY) {
      sqlParam = [
        pushNotificationId,
        notificationTypeCode,
        deliveryContent,
        categoryCode,
        publicStartDate,
        publicStartTime,
        publicEndDate,
        subject,
        body,
        imageUrl,
        consumptionpoints,
        loginConId,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
        expireDateTime,
        /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi START */
        pushNotificationSendFlag,
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi END */
      ];

      insertPushNotificationInfoSql = `
        INSERT INTO u_notification_info (
          notification_id,
          notification_type,
          deliverycontent,
          category,
          public_start_date,
          public_start_time,
          public_end_date,
          subject,
          body,
          image_url,
          delivery_status,
          additionalpoints,
          consumptionpoints,
          create_id,
          create_datetime,
          update_id,
          update_datetime,
          expire_datetime,
          push_notification_send_flag
        )
        VALUES(
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          '0',
          0,
          cast($11 as integer),
          $12,
          CURRENT_TIMESTAMP,
          $12,
          CURRENT_TIMESTAMP,
          $13,
          $14
        )
      `;
    }

    if (deliveryContent == DELIVERY_CONTENT_INDEX.FORM) {
      sqlParam = [
        pushNotificationId,
        notificationTypeCode,
        deliveryContent,
        categoryCode,
        publicStartDate,
        publicStartTime,
        publicEndDate,
        subject,
        body,
        imageUrl,
        loginConId,
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi START */
        pushNotificationSendFlag,
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi END */
      ];

      insertPushNotificationInfoSql = `
        INSERT INTO u_notification_info (
          notification_id,
          notification_type,
          deliverycontent,
          category,
          public_start_date,
          public_start_time,
          public_end_date,
          subject,
          body,
          image_url,
          delivery_status,
          additionalpoints,
          consumptionpoints,
          create_id,
          create_datetime,
          update_id,
          update_datetime,
          expire_datetime,
          push_notification_send_flag
        )
        VALUES(
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          '0',
          0,
          0,
          $11,
          CURRENT_TIMESTAMP,
          $11,
          CURRENT_TIMESTAMP,
          null,
          $12
        )
      `;
    }

    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
    if (deliveryContent == DELIVERY_CONTENT_INDEX.QUIZ) {
      sqlParam = [
        pushNotificationId,
        notificationTypeCode,
        deliveryContent,
        categoryCode,
        publicStartDate,
        publicStartTime,
        publicEndDate,
        subject,
        body,
        imageUrl,
        additionalpoints,
        loginConId,
        additionalpoints2,
        expireDateTime,
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi START */
        pushNotificationSendFlag,
        /* 懸案対応No.61 プッシュ通知送信有無設定 2023/10/30 Y.Takagi END */
      ];

      insertPushNotificationInfoSql = `
        INSERT INTO u_notification_info (
          notification_id,
          notification_type,
          deliverycontent,
          category,
          public_start_date,
          public_start_time,
          public_end_date,
          subject,
          body,
          image_url,
          delivery_status,
          additionalpoints,
          consumptionpoints,
          create_id,
          create_datetime,
          update_id,
          update_datetime,
          additionalpoints2,
          expire_datetime,
          push_notification_send_flag
        )
        VALUES(
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          '0',
          cast($11 as integer),
          0,
          $12,
          CURRENT_TIMESTAMP,
          $12,
          CURRENT_TIMESTAMP,
          $13,
          $14,
          $15
        )
      `;
    }
    /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */

    //アンケート(質問)テーブル登録SQL
    const insertQuestionnaireQuestionsSql = `
      INSERT INTO
        u_questionnaire_questions
      VALUES(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        CURRENT_TIMESTAMP,
        $8,
        CURRENT_TIMESTAMP
      )
      `;

    //クイズ(問題)テーブル登録SQL
    const insertQuizQuestionsSql = `
      INSERT INTO
        u_quiz_questions
      VALUES(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        CURRENT_TIMESTAMP,
        $10,
        CURRENT_TIMESTAMP
      )
      `;

    try {
      // おトク情報テーブル登録
      console.log(sqlParam);
      result = await this.query(insertPushNotificationInfoSql, sqlParam).catch(
        (err) => {
          throw err;
        }
      );

      // アンケート(質問)テーブル登録
      if (deliveryContent == DELIVERY_CONTENT_INDEX.QUESTIONNAIRE) {
        sqlParam = [
          pushNotificationId,
          question1,
          question2,
          question3,
          question4,
          question5,
          questionCount,
          loginConId,
        ];

        result = await this.query(
          insertQuestionnaireQuestionsSql,
          sqlParam
        ).catch((err) => {
          throw err;
        });
      }

      /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
      // クイズ(質問)テーブル登録
      if (deliveryContent == DELIVERY_CONTENT_INDEX.QUIZ) {
        sqlParam = [
          pushNotificationId,
          quizQuestion1,
          quizQuestion2,
          quizQuestion3,
          quizQuestion4,
          quizQuestion5,
          quizQuestionCount,
          correctAnswer,
          quizCommentary,
          loginConId,
        ];

        result = await this.query(insertQuizQuestionsSql, sqlParam).catch(
          (err) => {
            throw err;
          }
        );
      }
      /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
    } catch (err) {
      throw err;
    }

    return result;
  }

  /**
   * おトク情報配信先テーブル登録
   * @param  {String}   pushNotificationId  :通知ID
   * @param  {String}   sortOrder           :並び順
   * @param  {String}   codeType            :コードタイプ
   * @param  {String}   code                :コード
   * @param  {String}   loginConId          :ログインしている業者ID
   */
  async postPushNotificationTarget(
    pushNotificationId,
    sortOrder,
    codeType,
    code,
    loginConId
  ) {
    let sqlParam = [pushNotificationId, sortOrder, codeType, code, loginConId];
    console.log(sqlParam);

    const sql = `
      INSERT INTO
        u_notification_target
      VALUES(
        $1,
        $2 + 1,
        $3,
        $4,
        $5,
        CURRENT_TIMESTAMP,
        $5,
        CURRENT_TIMESTAMP
      )
      `;

    let result = [];
    try {
      result = await this.query(sql, sqlParam).catch((err) => {
        throw err;
      });
    } catch (err) {
      throw err;
    }

    return result;
  }

  /**
   * 利用者ID存在チェック
   * @param  {String}   pushNotificationId  :通知ID
   * @param  {String}   userId              :利用者ID
   */
  async checkPushNotification(pushNotificationId, userId) {
    let sqlParam = [pushNotificationId];
    let sql = ` SELECT
                  app_user_id 
                FROM
                  u_sweepstakes_entry 
                WHERE
                  notification_id = $1 AND
                  app_user_id IN(${userId})
              `;

    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });
    return result;
  }
}
/* プッシュ通知配信予約対応 2023/01/26 Y.Murase END */
