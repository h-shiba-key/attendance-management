import Repository from "./repository.js";
import { ACTION } from "../../../common/constants/index.js";

export default class ItemUnitPriceRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * 品目・単価情報（業者情報）取得
   * @param  {} conId
   */
  async getItemUnitPriceData(conId) {
    let sqlParam = [];
    sqlParam.push(conId);

    const sql = `
      SELECT
        name,
        remarks,
        is_cash_possible,
        is_transfer_possible,
        is_slip_possible,
        is_system_possible,
        extract(epoch from update_datetime) AS update_datetime,
        EXISTS(
          SELECT
            *
          FROM
            u_contractor
          WHERE
            con_id = $1
            AND bank_code <> ''
            AND bank_branch_code <> ''
            AND account_type IS NOT NULL
            AND account_code <> ''
            AND account_holder <> ''
        ) AS exists_account_data,
        disposal_license_number,
        security_license_number
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
    return result;
  }

  /**
   * 品目・単価情報（品目単価情報）取得
   * @param  {} conId
   */
  async getItemUnitPriceList(conId) {
    let sqlParam = [];
    sqlParam.push(conId);

    const sql = `
      SELECT
        u_item_unit_price.seq,
        u_item_unit_price.item_div_code,
        u_item_unit_price.item_major_code,
        m_item_major_class.item_major_name,
        u_item_unit_price.item_minor_code,
        m_item_minor_class.item_minor_name,
        u_item_unit_price.quantity,
        u_item_unit_price.unit_code,
        unit_code.code_name AS unit_name,
        u_item_unit_price.lowest_unit_price,
        u_item_unit_price.highest_unit_price,
        u_item_unit_price.update_datetime
      FROM u_item_unit_price
        LEFT JOIN m_item_minor_class
          ON u_item_unit_price.item_minor_code = m_item_minor_class.item_minor_code
          AND u_item_unit_price.item_major_code = m_item_minor_class.item_major_code
        JOIN m_item_major_class
          ON u_item_unit_price.item_major_code = m_item_major_class.item_major_code
        LEFT JOIN m_code AS unit_code
          ON unit_code.group_code = 'CD0003'
          AND unit_code.code = u_item_unit_price.unit_code
      WHERE
        u_item_unit_price.con_id = $1
      ORDER BY
        u_item_unit_price.seq      
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
   * 処分受入可能日情報取得
   * @param  {} conId
   */
  async getDisposalAcceptableDate(conId) {
    let sqlParam = [];
    sqlParam.push(conId);

    const sql = `
      SELECT
        to_char(possible_dates, 'YYYY/MM/DD') AS possible_dates,
        update_datetime
      FROM
      (
        SELECT
          to_date(to_char(year, 'FM9999') ||  left(trim(regexp_split_to_table(possible_dates, ',')), 2) || right(trim(regexp_split_to_table(possible_dates, ',')), 2) , 'YYYYMMDD') AS possible_dates,
          update_datetime
        FROM
          u_disposal_acceptable_date
        WHERE
          con_id = $1
      ) AS date_table
      WHERE
        possible_dates >= CURRENT_DATE
      ORDER BY 
        possible_dates  
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
   * 販売受入可能日情報取得
   * @param  {} conId
   */
  async getSaleAcceptableDate(conId) {
    let sqlParam = [];
    sqlParam.push(conId);

    const sql = `
      SELECT
        to_char(possible_dates, 'YYYY/MM/DD') AS possible_dates,
        update_datetime
      FROM
      (
        SELECT
          to_date(to_char(year, 'FM9999') ||  left(trim(regexp_split_to_table(possible_dates, ',')), 2) || right(trim(regexp_split_to_table(possible_dates, ',')), 2) , 'YYYYMMDD') AS possible_dates,
          update_datetime
        FROM
          u_sale_acceptable_date
        WHERE
          con_id = $1
      ) AS date_table
      WHERE
        possible_dates >= CURRENT_DATE
      ORDER BY 
        possible_dates  
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
   * 作業可能日情報取得
   * @param  {} conId
   */
  async getWorkableDate(conId) {
    let sqlParam = [];
    sqlParam.push(conId);

    const sql = `
      SELECT
        to_char(possible_dates, 'YYYY/MM/DD') AS possible_dates,
        update_datetime
      FROM
      (
        SELECT
          to_date(to_char(year, 'FM9999') ||  left(trim(regexp_split_to_table(possible_dates, ',')), 2) || right(trim(regexp_split_to_table(possible_dates, ',')), 2) , 'YYYYMMDD') AS possible_dates,
          update_datetime
        FROM
          u_workable_date
        WHERE
          con_id = $1
      ) AS date_table
      WHERE
        possible_dates >= CURRENT_DATE
      ORDER BY 
        possible_dates  
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
   * 品目・単価情報更新
   * @param  {} conId
   */
  async putItemUnitPrice(
    conId,
    itemUnitPriceData,
    itemUnitPriceList,
    disposalAcceptableDate,
    saleAcceptableDate,
    workableDate,
    loginConId
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
        remarks = $2,
        is_cash_possible = $3,
        is_transfer_possible = $4,
        is_slip_possible = $5,
        is_system_possible = $6,
        update_id = $7,
        update_datetime = CURRENT_TIMESTAMP
      WHERE
        con_id = $1
    `;

    // 該当の con_id、seq の品目・単価データを1行削除する
    const deleteItemUnitPriceSql = `
      DELETE FROM
        u_item_unit_price
      WHERE
        con_id = $1
        AND seq = $2
    `;

    const insertItemUnitPriceSql = `
      INSERT INTO
        u_item_unit_price(
          con_id,
          seq,
          item_div_code,
          item_major_code,
          item_minor_code,
          quantity,
          unit_code,
          lowest_unit_price,
          highest_unit_price,
          create_id,
          create_datetime,
          update_id,
          update_datetime
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
        CURRENT_TIMESTAMP,
        $10,
        CURRENT_TIMESTAMP
      )
    `;

    // 該当の con_id, seq の品目・単価データを1行更新する
    const updateItemUnitPriceSql = `
      UPDATE
        u_item_unit_price
      SET
        item_div_code = $3,
        item_major_code = $4,
        item_minor_code = $5,
        quantity = $6,
        unit_code = $7,
        lowest_unit_price = $8,
        highest_unit_price = $9,
        update_id = $10,
        update_datetime = CURRENT_TIMESTAMP
      WHERE
        con_id = $1
        AND seq = $2
    `;

    // 該当の con_id に紐づけられた日付データを全削除する
    const deleteDisposalAcceptableDateSql = `
      DELETE FROM
        u_disposal_acceptable_date
      WHERE
        con_id = $1
    `;

    const insertDisposalAcceptableDateSql = `
      INSERT INTO
        u_disposal_acceptable_date
      (
        con_id,
        year,
        possible_dates,
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
        $4,
        CURRENT_TIMESTAMP,
        $4,
        CURRENT_TIMESTAMP
      )    
    `;

    const deleteSaleAcceptableDateSql = `
      DELETE FROM
        u_sale_acceptable_date
      WHERE
        con_id = $1
    `;

    const insertSaleAcceptableDateSql = `
      INSERT INTO
        u_sale_acceptable_date
      (
        con_id,
        year,
        possible_dates,
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
        $4,
        CURRENT_TIMESTAMP,
        $4,
        CURRENT_TIMESTAMP
      )    
    `;

    const deleteWorkableDateSql = `
      DELETE FROM
        u_workable_date
      WHERE
        con_id = $1
    `;

    const insertWorkableDateSql = `
      INSERT INTO
        u_workable_date
      (
        con_id,
        year,
        possible_dates,
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
        $4,
        CURRENT_TIMESTAMP,
        $4,
        CURRENT_TIMESTAMP
      )    
    `;

    // 登録処理
    try {
      this.startTransaction();

      let result = [];
      let sqlParam = [];

      // 処分場/業者テーブル
      // 更新日時チェック
      sqlParam = [conId, itemUnitPriceData.updateDatetime];
      result = await this.query(selectConSql, sqlParam).catch((err) => {
        throw err;
      });

      if (result.rowCount == 0) {
        this.rollback();
        throw new Error("update target not found");
      }

      // 更新処理
      sqlParam = [
        conId,
        itemUnitPriceData.remarks,
        itemUnitPriceData.isCashPossible,
        itemUnitPriceData.isTransferPossible,
        itemUnitPriceData.isSlipPossible,
        itemUnitPriceData.isSystemPossible,
        loginConId,
      ];
      result = await this.query(updateConSql, sqlParam).catch((err) => {
        throw err;
      });

      if (result.rowCount != 1) {
        this.rollback();
        throw new Error();
      }

      // 品目単価テーブル
      // マージ処理
      let seq = 0;
      for (let i = 0; i < itemUnitPriceList.length; i++) {
        const item = itemUnitPriceList[i];
        switch (item.action) {
          case ACTION.CHANGE:
            // 変更
            sqlParam = [
              conId,
              item.seq,
              item.itemDivCode,
              item.itemMajorCode,
              item.itemMinorCode === "" ? null : item.itemMinorCode,
              item.quantity === "" ? null : item.quantity,
              item.unitCode === "" ? null : item.unitCode,
              item.lowestUnitPrice === "" ? null : item.lowestUnitPrice,
              item.highestUnitPrice === "" ? null : item.highestUnitPrice,
              loginConId,
            ];
            result = await this.query(updateItemUnitPriceSql, sqlParam).catch(
              (err) => {
                console.log(err);
                throw err;
              }
            );
            break;
          case ACTION.DELETE:
            // 行削除
            sqlParam = [conId, item.seq];
            result = await this.query(deleteItemUnitPriceSql, sqlParam).catch(
              (err) => {
                throw err;
              }
            );
            break;
          case ACTION.NEW:
            // 追加
            // 空いている seq を利用する
            seq = this.getNextSeq(seq, itemUnitPriceList);
            sqlParam = [
              conId,
              seq,
              item.itemDivCode,
              item.itemMajorCode,
              item.itemMinorCode === "" ? null : item.itemMinorCode,
              item.quantity === "" ? null : item.quantity,
              item.unitCode === "" ? null : item.unitCode,
              item.lowestUnitPrice === "" ? null : item.lowestUnitPrice,
              item.highestUnitPrice === "" ? null : item.highestUnitPrice,
              loginConId,
            ];
            result = await this.query(insertItemUnitPriceSql, sqlParam).catch(
              (err) => {
                throw err;
              }
            );
            // seq をインクリメント
            seq++;
            break;
          case ACTION.NO_CHANGE:
            // 更新なし > 何もしない
            break;
        }
      }

      // 処分受入可能日テーブル(DELETE&INSERT)
      // 削除
      sqlParam = [conId];
      result = await this.query(
        deleteDisposalAcceptableDateSql,
        sqlParam
      ).catch((err) => {
        throw err;
      });

      for (let i = 0; i < disposalAcceptableDate.length; i++) {
        // 挿入処理
        sqlParam = [
          conId,
          disposalAcceptableDate[i].year,
          disposalAcceptableDate[i].possibleDates.join(","),
          loginConId,
        ];
        result = await this.query(
          insertDisposalAcceptableDateSql,
          sqlParam
        ).catch((err) => {
          throw err;
        });
      }

      // 販売受入可能日テーブル(DELETE&INSERT)
      // 削除
      sqlParam = [conId];
      result = await this.query(deleteSaleAcceptableDateSql, sqlParam).catch(
        (err) => {
          throw err;
        }
      );

      for (let i = 0; i < saleAcceptableDate.length; i++) {
        // 挿入処理
        sqlParam = [
          conId,
          saleAcceptableDate[i].year,
          saleAcceptableDate[i].possibleDates.join(","),
          loginConId,
        ];
        result = await this.query(insertSaleAcceptableDateSql, sqlParam).catch(
          (err) => {
            throw err;
          }
        );
      }

      // 作業可能日テーブル(DELETE&INSERT)
      // 削除
      sqlParam = [conId];
      result = await this.query(deleteWorkableDateSql, sqlParam).catch(
        (err) => {
          throw err;
        }
      );

      // 更新日時チェック
      for (let i = 0; i < workableDate.length; i++) {
        // 挿入処理
        sqlParam = [
          conId,
          workableDate[i].year,
          workableDate[i].possibleDates.join(","),
          loginConId,
        ];
        result = await this.query(insertWorkableDateSql, sqlParam).catch(
          (err) => {
            throw err;
          }
        );
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
   * nowSeq から始まる seq の空きを調べて番号を返す
   * @param nowSeq
   * @param seqList [{ seq: number }...]
   * @returns number
   */
  getNextSeq(nowSeq, seqList) {
    let seq = nowSeq;
    while (true) {
      let isExist = false;
      seqList.forEach((e) => {
        if (e.seq == seq) {
          isExist = true;
        }
      });
      if (!isExist) break;

      seq++;
    }

    return seq;
  }
}
