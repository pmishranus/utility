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
    A: "A",
    INT_ACTIVE: "1",
    E: "E",
    S: "S",
    W: "W",
  B : "B",
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
  
    CLAIMANT_RETRACT_STATUS: "15",
    CLAIM_ASSISTANT_RETRACT_STATUS: "16",
  
    STATUS_SUCCESS: "S",
    STATUS_ERROR: "E",
    STATUS_WARNING: "W",
  
    DEFAULT_DOUBLE_VALUE: "0.00",
  
    DEFAULT_DOUBLE: 0.00,
  
    ALL: "ALL",
  
    LOCK: "LOCK",
    UNLOCK: "UNLOCK",
  
    EVSTATUS: "EvStatus",
    STATUS_E: "E",
    ITEM: "item",
    ETOUTPUT: "EtOutput",
    EVWBS: "EvWbs",
    EVMSG: "EvMsg",
  
    RATE_TYPE_HOURLY: "10",
    RATE_TYPE_HOURLY_19: "19",
    RATE_TYPE_HOURLY_20: "20",
    RATE_TYPE_HOURLY_21: "21",
  
    // Open Text Properties
    FOLDER_TYPE: "0",
    FILE_TYPE: "144",
  
    CLAIM_START_DATE: "CLAIM_START_DATE",
    CLAIM_END_DATE: "CLAIM_END_DATE",
    RATE_TYPE: "RATE_TYPE",
    START_TIME_END_TIME: "START_TIME_END_TIME",
    HOURS_UNIT: "HOURS_UNIT",
    TOTAL_AMOUNT: "TOTAL_AMOUNT",
    WBS: "WBS",
    CLAIM_EXISTS: "CLAIM_EXISTS",
    CLAIM_OVERLAP: "CLAIM_OVERLAP",
  
    SLASH: "/",
  
    OTSTICKET: "otcsticket",
  
    // Dashboard Properties
    QUICK_LINKS: "QUICK_LINKS",
    PHOTO_PREFIX: "data:image/png;base64,",
    D: "d",
    V: "v",
    RESULTS: "results",
    PHOTO: "photo",
    HEADER: "HEADER",
    REQUEST_HEADER: "REQUEST_HEADER",
    ULU_FDLU: "ULU / FDLU",
    TOTAL_REQUESTS: "Total Requests",
    URL: "url",
    TRUE: "true",
    NEW_LINE: "\n\n",
    ROLE: "ROLE",
    YYYY_MM_dd_HH_mm: "yyyy-MM-dd HH:mm",
    COMPLETED_REQUEST: "COMPLETED_REQUEST",
    COMPLETED_TASKS: "Completed Tasks",
    DELEGATED_TASKS: "Delegated Tasks",
    INBOX: "inbox",
    DISPLAY: "Display",
    NAV_TO_COMPLETED: "completed",
    NAV_TO_DELEGATED: "delegated",
    NAV_TO_PENDING: "pending",
    NAV_TO_DEFAULT: "default",
    LEGEND: "LEGEND",
    ICON: "sap-icon://desktop-mobile",
    CANCEL_TASK_ICON: "sap-icon://sys-cancel-2",
    TYPE_08: "Type08",
    MANAGER_DATA: "MANAGER_DATA",
    CLAIMREQUEST: "claimrequest",
    TBCLAIMS: "tbclaims",
    d_DISPLAY: "display",
    ROLE_CLMNT: "CLMNT",
    ROLE_CMASST: "CMASST",
    ROLE_TBASST: "TBASST",
    NUS_CHRS_ECLAIMS_CA: "NUS_CHRS_ECLAIMS_CA",
    MONTHLY: "MONTHLY",
    USEFULLINKS: "USEFULLINKS",
    MATRIX_ADMIN_ROLE: "MATRIX_ADMIN",
    SUPER_ADMIN_ROLE: "SUPER_ADMIN",
    DM_CW_Admin: "DM_CW_Admin",
  
    // Opentext Properties
    ECLAIMS_OPNTXT: "ECLAIMS_OPNTXT",
    CW_OPNTXT: "CW_OPNTXT",
    CW_ZIP_OPNTXT: "CW_MASS_ZIP_OPNTXT",
    CW_MASS_ZIP_ATTACHMENT: "CW_MASS_ZIP_ATTACHMENT",
  
    INVALID_ZIP: "Invalid ZIP attachment",
    INCORRECT_FILE_STRUCTURE: "Incorrect file structure. Attachments have to be directly uploaded and maintained in the zip.",
    VALIDATE_ZIP_REQ_NODE: "No attachments for Requests",
    VALIDATE_NO_REQ_EXISTS_NODE: "No Request Exists for files",
    VALIDATE_ATTCH_ERROR: "No attachments allowed for requests in Error",
    VALIDATE_ATT_TYPE_NODE: "No valid Document Type",
    VALIDATE_FILEEXT_NODE: "File extensions not allowed",
    VALIDATE_INVALID_FILENAME: "Invalid Filename",
    VALIDATE_FILENAME_NODE: "Filename has special characters",
    VALIDATE_REQ_FILE_SIZE: "Maximum filesize allowed per request is 10 MB",
    VALIDATE_REQ_FILE_SIZE_ZERO: "No Content In File",
    ALLOWED_FILE_EXTN: "jpg,jpeg,png,pdf,doc,docx,xls,xlsx",
    REQ_FILE_SIZE: 10.00,
  
    // BTP System User Properties
    BTP_SYS_USER: "BTP_SYS_USER",
  
    ATT_TYPE_REF_CWNED: "ATTACHMENT_TYPE",
    ATT_TYPE_REF_OPWN: "ATTACHMENT_TYPE_OPWN",
  
    OPNTEXT_END_POINT_REF: "OPENTEXT",
    OPNTEXT_EWSPACE_POINT_REF: "OPENTEXT_EWSPACE",
  
    // ECP System User Properties
    ECP_SYS_USER: "ECP_SYSTEM",
  
    // Job info claim type code
    PTT_CODE: "46",
    CW_CODE: "45",
    OT_CODE: "31",
    APP_TRACT_CODE: "27",
    EMP_CAT_PTT: "46",
  
    GENERIC_EXCEPTION: "Due to technical issues, the page cannot be displayed. Please contact us at itcare@nus.edu.sg",
  
    CWS_NED_SEMANTIC: "cwsnedrequestscreen",
    CW_ESS: "CW_ESS",
    CLAIM_TYPE_101: "101",
    CLAIM_TYPE_102: "102",
    CLAIM_TYPE_103: "103",
    CLAIM_TYPE_104: "104",
    CLAIM_TYPE_105: "105",
  
    CW_OVERALL_PROCESS: "200",
    ECLAIMS_OVERALL_PROCESS: "100",
  
    CW_PROCESS: "201",
    NED_PROCESS: "202",
    OPWN_PROCESS: "203",
  
    OPWN_FILE_NAME: "OPWN_Request",
  
    CW_SUBMISSION_TYPE: "SUBMISSION_TYPE",
    NEW_SUBMISSION_TYPE: "I",
    CHANGE_SUBMISSION_TYPE: "U",
    DELETE_SUBMISSION_TYPE: "D",
  
    DELETE_P: "P",
    DELETE_T: "T",
  
    // OPWN Payment Type Properties
    PAYMENT_TYPE: "PAYMENT_TYPE",
    OW: "OW",
    AW: "AW",
    CW: "CW",
    CWS: "CWS",
    DURATION_DAYS: "DURATION_DAYS",
    DURATION_DAYS_201: "201_DURATION_DAYS",
    CW_TEACHING: "ST01",
    PYROLLAREA_EXC: "SE",
    CW_PAYMENT_R: "R",
    CW_PAYMENT_A: "A",
  
    ackMessageRetract: "Task has been retracted successfully.",
    ackMessageReject: "Task has been rejected successfully.",
    ackMessageApprove: "Task has been completed successfully.",
    ackMessageWithdrawn: "Task has been withdrawn successfully.",
    ackMessageRevision: "Task has been sent for revision successfully.",
  
    SOURCE_MG: "MG",
    SOURCE_MC: "MC",
  
    CPI_SYS_USER: "CPI_SYSTEM",
    OTP_PAYMENT_STATUS_OK: "OK",
  
    DELEGATED_FOR: "DELEGATED_FOR",
    DELEGATED_TO: "DELEGATED_TO",
    OPWN_SHEET_NAME: "OPWN_Request",
    CW_NED_SHEET_NAME: "CW_NED_Request",
  
    EMP_TERMINATED_STS: "T",
    EMP_ACTIVE_STS: "A",
  
    CUTOFFDAY_PROP: "CUTOFFDAY",
    TERMINATION_CTR: "TERMINATION_COUNTER",
    EXEC_DAY_DIFF: "EXEC_DAY_DIFF",
  
    WeekDayAllowedValues: [4.0, 8.5, 0.0],
    FridayAllowedValues: [4.0, 8.0, 0.0],
  
    ADMIN_FEE_EFFDATE: "ADMIN_FEE_EFFDATE",
    INT_LEVY_0: "LVY05",
    INT_LEVY_10: "LVY04",
    CURRENCY_SGD: "SGD",
  
    STAFF_LDS_LIMIT: "STAFF_LDS_LIMIT",
  
    DELETE_ZIP_ATTACHMENT_MONTH: "DELETE_ZIP_ATTACHMENT_MONTH",
    DELETE_RETRACTED_REJECTED_REQ_DAYS: "DELETE_RETRACTED_REJECTED_REQ_DAYS",
    DELETE_RETRACTED_REJECTED_REQ_STATUS: "DELETE_RETRACTED_REJECTED_REQ_STATUS",
    BENEFIT_AUTO_REJECT_DAYS: "BENEFIT_AUTO_REJECT_DAYS",
  
    SRC_APP_CONFIG: "APP",
    SRC_CWS_APP_CONFIG: "CWS_APP",
  
    CW_NED: "CW_NED",
    ZA: "ZA",
    N001: "N001",
    YYYYMMDD_FORMAT: "yyyyMMdd",
    ACC_TYPE_D: "D",
    ACC_TYPE_S: "S",
    ACC_TYPE_T: "T",
  
    GL_ACC_NO: "5300410",
    PT00: "PT00",
    GL_WBS: "E-143-00-0001-01",
    NUS_CONST_EMAIL: "ofnar@nus.edu.sg",
    TC_09: "O9",
    DEPT_LEVY_SPLIT_PERCENT: "DEPT_LEVY_SPLIT_PERCENT",
    TAX_PERCENT: "TAX_PERCENT",
    MESSAGE_TYPE_CLR: "ZFICLEARDOC",
  
    // Custom Logging Constants
    LOGGING_LEVEL_INFO: "INFO",
    LOGGING_LEVEL_ERROR: "ERROR",
    LOGGING_LEVEL_WARN: "WARN",
    LOGGING_LEVEL_DEBUG: "DEBUG",

    SUBJECT : "SUBJECT",
  
  
  
    SEQUENCE_PATTERN: {
      SEQUENCE_DRAFT_ID_PATTERN: "DT",
      SEQUENCE_REQUEST_ID_PATTERN: "CM",
      SEQUENCE_ITEM_ID_PATTERN: "ITEM",
      SEQUENCE_PROCESS_ID_PATTERN: "P",
      SEQUENCE_TASK_ID_PATTERN: "T",
      SEQUENCE_DELEGATION_ID_PATTERN: "DLGT",
      SEQUENCE_REQUEST_LOCK_ID_PATTERN: "LOCK",
  
      // CW patterns
      SEQUENCE_DRAFT_ID_CW_PATTERN: "DTCW",
      SEQUENCE_REQUEST_ID_CW_PATTERN: "CW",
  
      // Migration patterns for CW
      SEQUENCE_DRAFT_ID_CW_MIGRARTION_PATTERN: "DTCWM",
      SEQUENCE_REQUEST_ID_CW_MIGRARTION_PATTERN: "CWM",
  
      // Digits
      SEQUENCE_DRAFT_ID_DIGITS: 6,
      SEQUENCE_REQUEST_ID_DIGITS: 6,
      SEQUENCE_ITEM_ID_DIGITS: 2,
      SEQUENCE_PROCESS_ID_DIGITS: 4,
      SEQUENCE_TASK_ID_DIGITS: 4,
      SEQUENCE_DELEGATION_ID_DIGITS: 5,
      SEQUENCE_REQUEST_LOCK_ID_DIGITS: 4
    },
  
    TASK_ACTION_verifier : 'VERIFIER',
    TASK_ACTION_addapp1 : 'ADDITIONAL_APP_1',
    TASK_ACTION_addapp2: 'ADDITIONAL_APP_2',
    
  
  
  
  
  
  
  
  
  
  
  PERSONAL_INFO: "PERSONAL_INFO",
    ECLAIMS_DASHBOARD_SYSTEM_REFRESH_ERROR: "System refresh is in-progress, please try again at later time.",
    INVALID_PROCESS_CODE: "Invalid process code : Pass the valid process code"
  };
  
  const MessageConstants = {
    MSG_REQUEST_LOCKED: 'Request is already locked by the user- ',
    VALIDATION_RESULT_MESSAGE: 'There is an incorrect claim record. Please check Error List for details.',
    VALIDATION_RESULT_CW_MESSAGE: 'There is an incorrect cw record. Please check Error List for details.',
    ERROR: 'Error'
  };
  
  
  
  module.exports = {
    ApplicationConstants, MessageConstants
  }
  