// applicationConstants.js

const ApplicationConstants = {
    ECLAIMS_PROCESS: "ECLAIMS_PROCESS",
    CWS_PROCESS: "CW_PROCESS",

    TIMESTAMP: "timestamp",
    STATUSCODE: "statusCode",
    DESCRIPTION: "description",
    MESSAGE: "message",

    BEARER: "Bearer ",
    TOKEN_LENGTH: 7,
    START_DATE_END_DATE_FORMAT: "dd.MM.yyyy",
    CLAIM_START_DAY: 1,

    AUTHORIZATION: "Authorization",
    CONTENT_TYPE: "Content-Type",
    CONTENT_TYPE_SCIM: "application/scim+json",
    IAS_RESULT_TOTAL_RESULTS: "totalResults",
    IAS_RESULT_RESOURCES: "Resources",
    IAS_GROUP_NODE: "groups",
    COMMA: ",",
    COLON: ":",

    TASK_STATUS_APPROVE: "APPROVE",
    TASK_STATUS_REJECT: "REJECT",

    NUS_CHRS_ECLAIMS_ESS: "NUS_CHRS_ECLAIMS_ESS",
    ESS_MONTH: "ESS_MONTH",
    CA_MONTH: "CA_MONTH",

    CW_REQUESTOR_GRP: "CW_ESS",
    CW_DEPTADMIN_GRP: "CW_DEPARTMENT_ADMIN",
    CW_HRP: "CW_HRP",
    CW_REPORTING_MGR: "CW_REPORTING_MGR",
    CW_MANAGERS_MGR: "CW_MANAGERS_MGR",
    CW_OHRSS: "CW_OHRSS",
    CW_PROGRAM_ADMIN: "CW_PROGRAM_ADMIN",
    CW_PROGRAM_MANAGER: "CW_PROGRAM_MANAGER",
    CW_APPROVED_EMAIL: "CW_APPROVED_EMAIL",
    OPWN_APPROVED_EMAIL: "OPWN_APPROVED_EMAIL",
    OPWN_CONSTANT: "OPWN",

    TASK_SEQUENCE_CLAIM_SUBMIT: 1,
    TASK_SEQUENCE_CLAIM_RETRACT: 0,

    STATUS_PENDING_FOR_CLAIM_ASSISTANT: "02",

    STATUS_TASK_ACTIVE: "95",
    STATUS_TASK_COMPLETED: "97",
    STATUS_TASK_CANCELLED: "99",

    STATUS_PROCESS_INPROGRESS: "91",
    STATUS_PROCESS_CANCELLED: "93",
    STATUS_PROCESS_SUSPEND: "93",
    STATUS_PROCESS_COMPLETED: "94",

    STATUS_ECLAIMS_DRAFT: "01",
    STATUS_ECLAIMS_CLAIMANT_SUBMITTED: "02",
    STATUS_ECLAIMS_CLAIM_ASSISTANT_SUBMITTED: "03",
    STATUS_ECLAIMS_CLAIM_APP1_PENDING: "04",
    STATUS_ECLAIMS_CLAIM_APP2_PENDING: "05",
    STATUS_ECLAIMS_CLAIM_APPROVER_PENDING: "06",
    STATUS_ECLAIMS_CLAIMANT_REJECT: "07",
    STATUS_ECLAIMS_CLAIM_ASSISTANT_REJECT: "08",
    STATUS_ECLAIMS_APPROVED: "09",
    STATUS_ECLAIMS_TRANSFERRED_TO_PAYROLL_SYSTEM: "13",
    STATUS_ECLAIMS_POSTED_SUCCESSFULLY: "14",
    STATUS_ECLAIMS_CLAIMANT_RETRACT: "15",
    STATUS_ECLAIMS_CLAIM_ASSISTANT_RETRACT: "16",
    STATUS_ECLAIMS_CLAIM_ASSISTANT_RETRACT_NON_ESS: "17",
    STATUS_ECLAIMS_REJECTED_BY_SYSTEM: "18",
    STATUS_ECLAIMS_RETRACTED_BY_SUPER_ADMIN: "19",
    STATUS_ECLAIMS_WITHDRAWN_ADMIN: "11",
    STATUS_ECLAIMS_REJECTED_SYSTEM: "18",
    STATUS_ECLAIMS_WITHDRAWN_BY_ECP: "20",

    // CW Properties
    STATUS_CW_DRAFT: "31",
    STATUS_CW_PENDING_OHRSS: "32",

    STATUS_CW_DEPTADMIN_SUBMITTED: "33",
    STATUS_CW_HRP: "33",
    STATUS_CW_RM: "34",
    STATUS_CW_APPROVED: "38",
    STATUS_OPWN_PENDING_PM: "40",
    STATUS_CW_WITHDRAW: "39",
    STATUS_CW_RETRACT_ESS_201: "44",
    STATUS_OPWN_RETRACT_DEPT_ADMIN_201: "45",
    STATUS_CW_RETRACT_203: "46",
    STATUS_CW_CLOSE: "48",
    STATUS_CW_SOFT_DELETE: "49",
    STATUS_INT_CW_V: "50",

    STATUS_OPWN_NP: "51",
    STATUS_OPWN_BD: "52",
    STATUS_OPWN_ER: "53",
    STATUS_OPWN_PD: "54",
    STATUS_OPWN_REJECT: "41",
    TASK_ACTION_CODE_REJECT: "REJECT",
    TASK_ACTION_CODE_RETRACT: "RETRACT",
    TASK_ACTION_CODE_WITHDRAW: "WITHDRAW",
    TASK_ACTION_CODE_REVISION: "REVISION",

    TASK_NAME_APPROVER: "APPROVER",
    TASK_NAME_ADDITIONAL_APP_1: "ADDITIONAL_APP_1",
    TASK_NAME_ADDITIONAL_APP_2: "ADDITIONAL_APP_2",
    TASK_NAME_VERIFIER: "VERIFIER",
    TASK_NAME_FINANCE_LEAD: "FINANCE_LEAD",

    Y: "Y",
    HYPHEN: "-",
    N: "N",
    X: "X",
    Z: "Z",

    PREFIX_ZERO_TWO_DIGITS: "%02d",
    PREFIX_ZERO_THREE_DIGITS: "%03d",
    SUFFIX_ZERO_TWO_DIGITS: "%.02f",

    ACTION_CHECK: "CHECK",
    ACTION_REJECT: "REJECT",
    ACTION_SAVE: "SAVE",
    ACTION_WITHDRAW: "WITHDRAW",
    ACTION_SUBMIT: "SUBMIT",
    ACTION_ADMIN_SUBMIT: "ADMIN_SUBMIT",
    ACTION_RESUBMIT: "RESUBMIT",
    ACTION_REJECT_RESUBMIT: "R_RESUBMIT",
    ACTION_VERIFY: "VERIFY",
    ACTION_APPROVE: "APPROVE",
    ACTION_UPDATE: "UPDATE",
    SEND_EMAIL: "SEND_EMAIL",
    EMAIL: "EMAIL_ID",
    SELECTED_PROCESS: "SELECTED_PROCESS",
    ACTION_RETRACT: "RETRACT",
    ACTION_CLOSE: "CLOSE",
    ACTION_REVERT: "REVERT",

    RESTDAY: "Restday",
    WORKDAY: "Workday",
    OFFDAY: "Offday",
    RESTDAY_CONSTANT: "RESTDAY",
    WORKDAY_CONSTANT: "WORKDAY",
    OFFDAY_CONSTANT: "OFFDAY",
    OFFDAY_P: "Offday_P",
    OFFDAY_C: "Offday_C",
    PUBLIC_HOLIDAY: "Public Holiday",

    SOURCE_ACCESS_REQUESTOR_FORM: "R",
    SOURCE_ACCESS_INBOX: "I",

    CLAIMANT: "CLAIMANT",
    ESS: "ESS",

    CLAIM_ASSISTANT: "CLAIM_ASSISTANT",
    DEPT_ADMIN: "DEPARTMENT_ADMIN",
    HRP: "HRP",
    MATRIX_ADMIN: "NUS_CHRS_MATRIX_ADMIN",
    HRP_ACCESS_GRP: "NUS_CHRS_ECLAIMS_PTT_REPORT",
    NA: "NA",
    DEPT_MATRIX_ADMIN: "NUS_CHRS_MATRIX_DEPTADMIN",
    CA: "CA",
    APPROVER: "APPROVER",
    VERIFIER: "VERIFIER",
    ADDITIONAL_APP_2: "ADDITIONAL_APP_2",
    ADDITIONAL_APP_1: "ADDITIONAL_APP_1",
    REPORTING_MGR: "REPORTING_MGR",
    FINANCE_LEAD: "FINANCE_LEAD",
    REQUEST_STATUS_CONSTANT: "Request Status",

    // Excel Approver Matrix Designation Properties
    DEPT_ADMIN_ALIAS: "Department Admin",
    CA_ALIAS: "Claim Assistant",
    VERIFIER_ALIAS: "Verifier",
    APPROVER_ALIAS: "Approver",
    HRP_ALIAS: "HR Partner",

    UTC: "UTC",

    WBS_VALIDATION_MSG: "WBS Element provided is not valid.",

    // Properties for Task Tracker
    NO_USER_INFO: "User doesn't exists",

    EXCEL_HEADER_ROW: 0,
    EXCEL_DATA_ROW: 7,

    CLAIM_REQUEST_TYPE_PERIOD: "Period",
    CLAIM_REQUEST_TYPE_DAILY: "Daily",
    CLAIM_REQUEST_TYPE_HOURLY: "Hourly",
    CLAIM_REQUEST_TYPE_MONTHLY: "Monthly",
    CLAIM_REQUEST_TYPE_MONTHLY_NUMBER: "18",
    CLAIM_REQUEST_TYPE_DAILY_NUMBER: "19",
    CLAIM_START_TIME_DEFAULT: "00:00",
    CLAIM_END_TIME_DEFAULT: "23:59",
    INPUT_CLAIM_REQUEST_DATE_FORMAT: "yyyy-MM-dd",
    DEFAULT_FILE_PATTERN: "dd-MM-yyyy",
    APPN_DATE_FORMATTER: "dd.MM.yyyy",

    ITEM_INDEX: "ITEM-",
    TYPE_INT: "INT",
    TYPE_EXT: "EXT",

    ULU: "ULU",
    FDLU: "FDLU",
    PROCESS_CODE: "PROCESS_CODE",
    STAFF_USER_GRP: "STAFF_USER_GRP",
    STAFF_NUSNET_ID: "STAFF_NUSNET_ID",
    STAFF_ID: "STAFF_ID",
    SUBMITTED_BY: "SUBMITTED_BY",
    LOGGED_IN_USER: "LOGGED_IN_USER",
    REQUEST_STATUS: "REQUEST_STATUS",
    DUE_DATE: "DUE_DATE",
    PAGES: "PAGES",
    TASK_STATUS: "TASK_STATUS",
    MINUTES: "MINUTES",

    // Custom Logging Constants
    LOGGING_LEVEL_INFO: "INFO",
    LOGGING_LEVEL_ERROR: "ERROR",
    LOGGING_LEVEL_WARN: "WARN",
    LOGGING_LEVEL_DEBUG: "DEBUG"
};

module.exports = ApplicationConstants;
