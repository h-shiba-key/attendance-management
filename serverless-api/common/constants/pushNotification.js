/* プッシュ通知配信予約対応 2023/01/26 Y.Murase START */
// 配信内容
export const DELIVERY_CONTENT_INDEX = {
  NOTICE: "0",
  QUESTIONNAIRE: "1",
  APPLY: "2",
  FORM: "3",
  /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
  QUIZ: "4",
  /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
};
export const DELIVERY_CONTENT = [
  "通知",
  "アンケート",
  "懸賞",
  "応募フォーム",
  /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi START */
  "クイズ",
  /* 懸案対応No.9 クイズ機能 2023/08/16 Y.Takagi END */
];
// 配信状況
export const DELIVERY_STATUS_INDEX = {
  UNDELIVERED: 0,
  DURINGDELIVERY: 1,
  ENDDELIVERY: 2,
};
export const DELIVERY_STATUS = ["配信予定", "配信中", "配信終了"];
/* プッシュ通知配信予約対応 2023/01/26 Y.Murase END */

export default DELIVERY_CONTENT_INDEX;
