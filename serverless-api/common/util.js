import { PREFIX } from "./constants/index.js";
import shortid from "shortid";

/**
 * ランダムな文字列を生成
 * @param  {} length
 */
export function generateId(length) {
  let id = shortid.generate();
  if (id.length < length) {
    const newId = shortid.generate();
    id = id + newId;
  }
  return id.substring(0, length);
}

/**
 * 業者IDを生成
 * @param  {}
 */
export function generateContractorId() {
  return PREFIX.CONTRACTOR + generateId(7);
}

/**
 * 従業員IDを生成
 * @param  {}
 */
export function generateEmployeeId() {
  return PREFIX.EMPLOYEE + generateId(7);
}

/**
 * 残土処理場IDを生成
 * @param  {}
 */
export function generateSurplusSoilDisposalSiteId() {
  return generateId(8);
}

/**
 * 注文IDを生成
 * @param  {}
 */
export function generateOrderId() {
  return generateId(10);
}

/**
 * 残土処理依頼IDを生成
 * @param  {}
 */
export function generatesurplus_soil_disposal_request_id() {
  return generateId(10);
}

/**
 * ログインIDを生成
 * @param  {} length
 */
export function generateLoginId(length) {
  //ログインIDをランダム生成する
  let concatCharacters = "";
  // 生成時に使う、64文字を定義
  const characters = {
    small: "abcdefghijkmnopqrstuvwxyz", // 'l'を抜く
    capital: "ABCDEFGHIJKMNPQRSTUVWXYZ", // 'L','O'を抜く
    num: "23456789", // '1','0'を抜く
    symbol: "#$=_-!?",
  };
  const str = concatCharacters.concat(
    characters.small,
    characters.capital,
    characters.num,
    characters.symbol
  );
  // 定義した64文字を登録
  shortid.characters(str);
  // IDを生成
  let id = shortid.generate();
  // 生成したIDの桁数が足りない場合
  if (id.length < length) {
    id += shortid.generate();
  }

  return id.substring(0, length);
}

/**
 * 画面から離れるときの警告表示
 * @param {*} event
 */
export function beforeunload(event) {
  // Cancel the event as stated by the standard.
  event.preventDefault();
  // Chrome requires returnValue to be set.
  event.returnValue = "check";
}

export default generateId;
