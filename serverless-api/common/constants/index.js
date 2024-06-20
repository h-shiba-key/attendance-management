export const RETURN_CODE = {
  SUCCESS: 0,
  ERROR: 1,
};

// 業者IDprefix
export const PREFIX = {
  ADMIN: "A",
  CONTRACTOR: "T",
  EMPLOYEE: "E",
};

export const MAIL_BODY_PARAM_KEY = {
  emailAddress: "{{EMAILADDRESS}}",
  name: "{{NAME}}",
  branchName: "{{BRANCHNAME}}",
  postalCode: "{{POSTALCODE}}",
  prefecture: "{{PREFECTURE}}",
  municipality: "{{MUNICIPALITY}}",
  address: "{{ADDRESS}}",
  phoneNumber: "{{PHONENUMBER}}",
  faxNumber: "{{FAXNUMBER}}",
  division: "{{DIVISION}}",
  referralSource: "{{REFERRALSOURCE}}",
  loginId: "{{LOGINID}}",
  password: "{{PASSWORD}}",
  employeeName: "{{EMPLOYEENAME}}",
  employeeNameKana: "{{EMPLOYEENAMEKANA}}",
  employeePhoneNumber: "{{EMPLOYEEPHONENUMBER}}",
};

// 操作
export const ACTION = {
  NO_CHANGE: 0,
  NEW: 1,
  CHANGE: 2,
  DELETE: 3,
};

export default RETURN_CODE;
