import Repository from "./repository.js";
import { NOTIFICATION_TYPE } from "../../../common/constants/notification.js";

export default class NotificationRepository extends Repository {
  constructor() {
    super();
  }
  /**
   * 通知一覧取得
   * @param  {} loginId
   * @param  {} getNotificationNumber
   */
  async getNotification(loginId, getNotificationNumber) {
    let sqlParam = [];
    sqlParam.push(loginId, getNotificationNumber);

    const sql =
      `
        SELECT
            u_order.order_id AS id,
            u_contractor.name AS name,
            to_char(u_order.update_datetime, 'YYYY/MM/DD HH24:MI:SS') AS update_datetime,
            u_order.period_planned_to AS deadline,
            ` +
      NOTIFICATION_TYPE.ORDERAPPROVAL +
      `AS notification_type
        FROM
            u_order
        JOIN 
            u_contractor
        ON
            u_order.order_side_con_id = u_contractor.con_id
        WHERE
            u_order.status = 2 AND u_order.ordering_side_con_id = $1
        UNION ALL
        
        SELECT
            u_order.order_id AS id,
            u_contractor.name AS name,
            to_char(u_order.update_datetime, 'YYYY/MM/DD HH24:MI:SS') AS update_datetime,
            u_order.period_planned_to AS deadline,
            ` +
      NOTIFICATION_TYPE.ACHIEVEMENTREGIST +
      `AS notification_type
        FROM
            u_order
        JOIN
            u_contractor
        ON
            u_order.ordering_side_con_id = u_contractor.con_id
        WHERE
            u_order.status = 0 AND u_order.order_side_con_id = $1
        UNION ALL
        
        SELECT
            u_surplus_soil_disposal_request.surplus_soil_disposal_request_id AS id,
            'システム管理会社' AS name,
            to_char(u_surplus_soil_disposal_request.update_datetime, 'YYYY/MM/DD HH24:MI:SS') AS update_datetime,
            u_surplus_soil_disposal_request.preferred_date AS deadline,
            ` +
      NOTIFICATION_TYPE.SURPLUSSOILAPPROVAL +
      `AS notification_type
        FROM
            u_surplus_soil_disposal_request
        WHERE
            u_surplus_soil_disposal_request.status = 1 AND u_surplus_soil_disposal_request.con_id = $1
        ORDER BY 
            update_datetime DESC 
        LIMIT
            $2`;

    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }

  /**
   * 通知数取得
   * @param  {} loginId
   */
  async getNumberOfNotifications(loginId) {
    let sqlParam = [];
    sqlParam.push(loginId);

    const sql = `
        SELECT
            *
        FROM
        (
            SELECT
                COUNT(order_id) AS OrderApproval
            FROM
                u_order
            WHERE
                status = '2'
            AND
                ordering_side_con_id = $1
        ) OrderApproval
        , (
            SELECT
                COUNT(surplus_soil_disposal_request_id) AS SurplusSoilApproval
            FROM
                u_surplus_soil_disposal_request
            WHERE
                status = 1
            AND
                u_surplus_soil_disposal_request.con_id = $1
        ) SurplusSoilApproval
        , (
            SELECT
                COUNT(order_id) AS AchievementRegist
            FROM
                u_order
            WHERE
                status = '0'
            AND
                order_side_con_id = $1
        ) AchievementRegist
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
   * システム管理会社用通知一覧取得
   * @param  {} getNotificationNumber
   */
  async getNotificationForAdmin(getNotificationNumber) {
    let sqlParam = [];
    sqlParam.push(getNotificationNumber);

    const sql = `
        SELECT
            u_contractor.name AS name,
            u_surplus_soil_disposal_request.surplus_soil_disposal_request_id AS id,
            to_char(u_surplus_soil_disposal_request.update_datetime, 'YYYY/MM/DD HH24:MI:SS') AS update_datetime,
            u_surplus_soil_disposal_request.preferred_date AS deadline
        FROM
            u_surplus_soil_disposal_request
        JOIN 
            u_contractor
        ON
            u_surplus_soil_disposal_request.con_id = u_contractor.con_id
        WHERE
            u_surplus_soil_disposal_request.status = 0
        ORDER BY 
            update_datetime DESC 
        LIMIT
            $1`;

    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }

  /* トーク機能追加 2023/05/2 Y.Murase START */
  /**
   * システム管理会社用通報一覧取得
   * @param  {} getNotificationNumber
   */
  async getReportForAdmin(getNotificationNumber) {
    let sqlParam = [];
    sqlParam.push(getNotificationNumber);

    const sql = `
            SELECT
                function_code AS code,
                CASE 
                    WHEN function_code = 'TK' 
                        THEN report_value3 
                END AS title,
                CASE 
                    WHEN function_code = 'KC' 
                        THEN report_value3 
                END AS subject,
                report_value4 AS commentNumber,
                to_char(update_datetime, 'YYYY/MM/DD HH24:MI:SS') AS update_datetime
            FROM
                u_report
            WHERE
                status = 0
            ORDER BY 
                update_datetime DESC 
            LIMIT
                $1`;

    let result = [];
    result = await this.query(sql, sqlParam)
      .then((res) => this.jsonParse(res).rows)
      .catch((err) => {
        throw err;
      });

    return result;
  }
  /* トーク機能追加 2023/05/2 Y.Murase START */

  /**
   * システム管理会社用実績登録通知数取得
   * @param
   */
  async getNumberOfNotificationForAdmin() {
    let sqlParam = [];

    const sql = `
        SELECT
            *
        FROM
            (
                SELECT
                    COUNT(surplus_soil_disposal_request_id) AS achievementregistforadmin
                FROM
                    u_surplus_soil_disposal_request
                WHERE
                    status = '0'
                    ) achievementregistforadmin
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
