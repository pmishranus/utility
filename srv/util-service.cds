type primaryAssignment {
  SF_STF_NUMBER  : String;
  STF_NUMBER     : String;
  ULU_C          : String;
  ULU_T          : String;
  FDLU_C         : String;
  FDLU_T         : String;
  JOIN_DATE      : Date;
  PAYSCALE_GRP_C : String;
  PAYSCALE_GRP_T : String;
  JOB_LVL_C      : String;
  JOB_LVL_T      : String;
  JOB_GRD_C      : String;
  JOB_GRD_T      : String;
  NUSNET_ID      : String;
  START_DATE     : Date;
  END_DATE       : Date;
};

type claimAuthorizations {
  ULU_C          : String;
  ULU_T          : String;
  FDLU_C         : String;
  FDLU_T         : String;
  STAFF_USER_GRP : String;
  VALID_FROM     : String;
  VALID_TO       : Date;
  PROCESS_CODE   : String;
};

type approverMatrixs {
  STF_NUMBER     : String;
  ULU_C          : String;
  ULU_T          : String;
  FDLU_C         : String;
  FDLU_T         : String;
  STAFF_USER_GRP : String;
  VALID_FROM     : String;
  VALID_TO       : Date;
  PROCESS_CODE   : String;
};

type staffInfo {
  ![primaryAssignment]   : primaryAssignment;
  BANK_INFO_FLG          : String;
  FULL_NM                : String;
  EMAIL                  : String;
  FIRST_NM               : String;
  LAST_NM                : String;
  STAFF_ID               : String;
  COST_DIST_FLG          : String;
  ![claimAuthorizations] : claimAuthorizations;
  ![approverMatrix]      : approverMatrixs;
  ![inboxApproverMatrix] : approverMatrixs;
  ![otherAssignment]     : array of primaryAssignment;
}

type UtilResponse {

  ![isError]          : String;
  ![message]          : String;
  ![staffInfo]        : staffInfo;
  ![IS_EXTERNAL_USER] : String;
}

type auditStructureDto {
  REFERENCE_ID          : String;
  CHANGED_BY            : String;
  CHANGED_ON            : Timestamp;
  TEMP_CHANGED_ON       : String;
  IDENTITY              : String;
  ACTION_TYPE           : String;
  SECTION               : String;
  SUB_SECTION           : String;
  FIELD_LABEL           : String;
  OLD_VALUE             : String;
  OLD_VALUE_DESC        : String;
  NEW_VALUE             : String;
  NEW_VALUE_DESC        : String;
  FIELD_TYPE            : String;
  CUSTOM_ATTR_1         : String;
  CUSTOM_ATTR_2         : String;
  CHANGED_BY_NID        : String;
  CHANGED_BY_FULLNM     : String;
  SUBMITTED_BY_NID      : String;
  SUBMITTED_BY_FULLNAME : String;
  SUBMITTED_BY          : String;
  SUBMITTED_ON          : Timestamp;
}

type auditRespDto {
  tabName : String;
  data    : array of auditStructureDto;
}

type eClaimsItemDataResDto {
  ITEM_ID              : String;
  DRAFT_ID             : String;
  CLAIM_DATE           : String;
  CLAIM_DAY            : String;
  CLAIM_DAY_TYPE       : String;
  START_DATE           : String;
  END_DATE             : String;
  CLAIM_START_DATE     : String;
  CLAIM_END_DATE       : String;
  IS_PH                : Integer;
  START_TIME           : String;
  END_TIME             : String;
  HOURS_COMPUTED       : String;
  HOURS                : String;
  HOURS_UNIT           : Decimal;
  CLAIM_MONTH          : String;
  CLAIM_WEEK_NO        : String;
  CLAIM_YEAR           : String;
  WBS                  : String;
  WBS_DESC             : String;
  RATE_TYPE            : String;
  RATE_UNIT            : String;
  RATE_AMOUNT          : String;
  RATE_TYPE_AMOUNT     : Decimal;
  IS_DISCREPENCY       : Integer;
  DISCREPENCY_AMOUNT   : String;
  DISC_RATETYPE_AMOUNT : String;
  TOTAL_AMOUNT         : Decimal;
  IS_MULTIPLE          : Integer;
  IS_MARK_DELETION     : Integer;
  IS_DELETED           : String;
  REMARKS              : String;
  UPDATED_BY           : String;
  UPDATED_ON           : Timestamp;
}

type auditMainResponse {
  auditLog         : array of auditRespDto;
  eClaimsItemsList : array of eClaimsItemDataResDto;
}

type responseDto {
  isError    : Boolean;
  message    : String;
  statusCode : String;
}

type appConfigurationRequests {
  ACFG_ID          : String;
  CWS_ACFG_ID      : String;
  SRC_CONFIG       : String;
  PROCESS_CODE     : String;
  CONFIG_DESC      : String;
  CONFIG_KEY       : String;
  REFERENCE_KEY    : String;
  REFERENCE_VALUE  : String;
  CFG_TYPE         : String;
  CONFIG_VALUE     : String;
  IS_MAINT_BY_USER : String;
  IS_ACTIVE        : String;
  UPDATED_BY       : String;
  UPDATED_BY_NID   : String;
  UPDATED_ON       : Date;
  STATUS_CODE      : String;
  MESSAGE          : String;

}


type userScopes {
  identified    : Boolean;
  authenticated : Boolean;
  Viewer        : Boolean;
  Admin         : Boolean;
};

type userType {
  user   : String;
  locale : String;
  scopes : userScopes;
};

using {nusext as db} from '../db/datamodel';
// using {CHECK_COST_DIST_EXISTS_F} from '../db/redefinemodel';


service UtilService @(path: '/util') {
  @open
  type object {};

  entity CHRS_JOB_INFO       as select * from db.MASTER_DATA.CHRS_JOB_INFO;
  entity CHRS_EXTERNAL_USERS as select * from db.UTILITY.CHRS_EXTERNAL_USERS;
  entity CHRS_COST_DIST      as select * from db.MASTER_DATA.CHRS_COST_DIST;

  // entity CHECK_COST_DIST_EXISTS(nusnetId : String, startDate: Date, endDate : Date)
  //  as select * from CHECK_COST_DIST_EXISTS_F where NUSNET_ID = :nusnetId and START_DATE <= :endDate and END_DATE >= :startDate;

  function userInfo()                                                  returns userType;
  function iasUserInfo()                                               returns {};
  function getUserDetails(userId : String)                             returns UtilResponse;
  action   appConfigCreateEntry(data : appConfigurationRequests)       returns String;
  function getAuditLogData(referenceId : String, processCode : String) returns auditMainResponse;
  function releaseLockedRequests(draftId : String)                     returns responseDto;

}
