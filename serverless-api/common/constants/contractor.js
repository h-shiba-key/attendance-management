/* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi START */
// 業者種別
export const VENDOR_CLASS = {
  DISPOSAL: 0,
  SALE: 1,
};
/* 懸案対応No.65 建材屋リフレッシュ対応 2023/10/10 Y.Takagi END */

// 承認状態
export const APPROVAL_STATUS_INDEX = {
  UNAPPROVAL: 0,
  APPROVAL: 1,
  DISAPPROVAL: 2,
  SELFREGISTRATION: 3,
};
export const APPROVAL_STATUS = ["未承認", "承認済", "否認", "自社"];
// ページID
export const BUTTON_TYPE_INDEX = {
  ACTIVE: 0,
  INACTIVE: 1,
  APPROVAL: 2,
  DISAPPROVAL: 3,
  UPDATE: 4,
};
export const BUTTON_TYPE = [
  "active",
  "inactive",
  "approval",
  "disapproval",
  "update",
];

export default VENDOR_CLASS;
