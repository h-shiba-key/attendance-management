// 操作
export const SURPLUS_SOIL_DISPOSAL_SITE_ACTION = {
  NO_CHANGE: 0,
  NEW: 1,
  CHANGE: 2,
  DELETE: 3,
};

// テーブルヘッダ
export const SURPLUS_SOIL_DISPOSAL_SITE_HEADERS = {
  SURPLUS_SOIL_CUBIC_METER_10T_A: "surplus_soil_quantity_10t_A",
  SURPLUS_SOIL_CUBIC_METER_10T_B: "surplus_soil_quantity_10t_B",
  SURPLUS_SOIL_CUBIC_METER_10T_C: "surplus_soil_quantity_10t_C",
  SURPLUS_SOIL_CUBIC_METER_4T_A: "surplus_soil_quantity_4t_A",
  SURPLUS_SOIL_CUBIC_METER_4T_B: "surplus_soil_quantity_4t_B",
  SURPLUS_SOIL_CUBIC_METER_4T_C: "surplus_soil_quantity_4t_C",
  SURPLUS_SOIL_UNIT_PRICE_10T_A: "surplus_soil_unit_price_10t_A",
  SURPLUS_SOIL_UNIT_PRICE_10T_B: "surplus_soil_unit_price_10t_B",
  SURPLUS_SOIL_UNIT_PRICE_10T_C: "surplus_soil_unit_price_10t_C",
  SURPLUS_SOIL_UNIT_PRICE_4T_A: "surplus_soil_unit_price_4t_A",
  SURPLUS_SOIL_UNIT_PRICE_4T_B: "surplus_soil_unit_price_4t_B",
  SURPLUS_SOIL_UNIT_PRICE_4T_C: "surplus_soil_unit_price_4t_C",
};
// export const UNIT_PRICE_HEADERS = {
//     DISPOSAL_SALE_STATUS: 'DisposalSaleStatus',
//     ITEM_MAJOR: 'ItemMajor',
//     ITEM_MINOR: 'ItemMinor',
//     QUANTITY: 'Quantity',
//     UNIT: 'UnitName',
//     UNIT_PRICE: 'UnitPrice',
//     ACTION: 'Action',
//     IS_DELETED: 'IsDeleted',
//     VARIABLE_OPTIONS: 'Options',
// }

// 画面表示項目
export const SURPLUS_SOIL_DISPOSAL_SITE_DATA = {
  NAME: "name",
  POSTAL_CODE: "postal_code",
  PREFECTURE: "prefecture",
  MUNICIPALITY: "municipality",
  ADDRESS: "address",
  GEOM: "geom",
  PHONE_NUMBER: "phone_number",
  MANAGER_NAME: "manager_name",
  MANAGER_PHONE_NUMBER: "manager_phone_number",
  RESPONSIBLE_PERSON_NAME: "responsible_person_name",
  RESPONSIBLE_PERSON_PHONE_NUMBER: "responsible_person_phone_number",
  ACCEPTANCE_PERIOD_START_DATE: "acceptance_period_start_date",
  ACCEPTANCE_PERIOD_END_DATE: "acceptance_period_end_date",
  IS_ACCEPTABLE: "is_acceptable",
};

//
export const CAPACITY = {
  DUMP_10T: 6.5,
  DUNP_4T: 3.5,
};
